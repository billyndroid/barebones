import { FastifyPluginAsync } from 'fastify';
import { shopifyService } from '../services/shopifyService';
import { verifyShopifyWebhook } from '../utils/verifyShopifyWebhook';
import { prisma } from '../prisma/client';
import { authenticateToken, optionalAuth, AuthenticatedRequest } from '../utils/auth';

export const checkoutRoutes: FastifyPluginAsync = async (fastify) => {
  // Create checkout from cart items
  fastify.post('/create', { preHandler: optionalAuth }, async (request, reply) => {
    const { items, customerInfo } = request.body as {
      items: Array<{ id: string; quantity: number; price: number }>;
      customerInfo?: { email: string; name?: string; phone?: string };
    };

    if (!items || items.length === 0) {
      return reply.status(400).send({ error: 'Items are required' });
    }

    try {
      // Get product details from database
      const productIds = items.map(item => item.id);
      const products = await prisma.product.findMany({
        where: { id: { in: productIds } }
      });

      // Create order in our database first
      const user = (request as AuthenticatedRequest).user;
      let userId = user?.id;

      // If no authenticated user but customer info provided, create a guest user
      if (!userId && customerInfo?.email) {
        const existingUser = await prisma.user.findUnique({
          where: { email: customerInfo.email }
        });

        if (existingUser) {
          userId = existingUser.id;
        } else {
          const guestUser = await prisma.user.create({
            data: {
              email: customerInfo.email,
              name: customerInfo.name || 'Guest User',
              password: 'guest-user-no-password' // Placeholder for guest users
            }
          });
          userId = guestUser.id;
        }
      }

      if (!userId) {
        return reply.status(400).send({ error: 'User authentication or customer info required' });
      }

      // Calculate total
      const total = items.reduce((sum, item) => {
        const product = products.find((p: any) => p.id === item.id);
        return sum + (product ? Number(product.price) * item.quantity : 0);
      }, 0);

      // Create order
      const order = await prisma.order.create({
        data: {
          userId,
          total,
          status: 'PENDING',
          orderItems: {
            create: items.map(item => {
              const product = products.find((p: any) => p.id === item.id);
              return {
                productId: item.id,
                quantity: item.quantity,
                price: product ? Number(product.price) : 0
              };
            })
          }
        }
      });

      // For now, simulate checkout completion since we don't have real Shopify integration
      // In a real app, you would create a Shopify checkout here
      return {
        orderId: order.id,
        total: order.total,
        status: 'created',
        message: 'Order created successfully. In a real app, this would redirect to Shopify checkout.',
        // In real implementation: checkoutUrl: shopifyCheckout.web_url
      };
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to create checkout' });
    }
  });

  // Complete checkout/order
  fastify.post('/complete/:orderId', { preHandler: optionalAuth }, async (request, reply) => {
    const { orderId } = request.params as { orderId: string };
    const { paymentMethod } = request.body as { paymentMethod?: string };

    try {
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
          orderItems: {
            include: { product: true }
          }
        }
      });

      if (!order) {
        return reply.status(404).send({ error: 'Order not found' });
      }

      // Update order status to completed
      const updatedOrder = await prisma.order.update({
        where: { id: orderId },
        data: { status: 'COMPLETED' }
      });

      return {
        orderId: updatedOrder.id,
        status: 'completed',
        total: updatedOrder.total,
        message: 'Order completed successfully!'
      };
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to complete checkout' });
    }
  });

  // Handle Shopify webhook for order creation
  fastify.post('/webhook/order/created', async (request, reply) => {
    try {
      const isValid = verifyShopifyWebhook(
        JSON.stringify(request.body),
        request.headers['x-shopify-hmac-sha256'] as string
      );

      if (!isValid) {
        return reply.status(401).send({ error: 'Unauthorized' });
      }

      const orderData = request.body as any;
      
      // Process the order data - save to database, send notifications, etc.
      fastify.log.info('Order created webhook received:', orderData.id);
      
      // Here you would typically:
      // 1. Save order to your database
      // 2. Send confirmation emails
      // 3. Update inventory
      // 4. Trigger fulfillment processes

      return reply.status(200).send({ status: 'ok' });
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Webhook processing failed' });
    }
  });

  // Handle Shopify webhook for order updates
  fastify.post('/webhook/order/updated', async (request, reply) => {
    try {
      const isValid = verifyShopifyWebhook(
        JSON.stringify(request.body),
        request.headers['x-shopify-hmac-sha256'] as string
      );

      if (!isValid) {
        return reply.status(401).send({ error: 'Unauthorized' });
      }

      const orderData = request.body as any;
      
      fastify.log.info('Order updated webhook received:', orderData.id);
      
      // Update order status in your database
      // Send status update notifications to customers

      return reply.status(200).send({ status: 'ok' });
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Webhook processing failed' });
    }
  });

  // Handle Shopify webhook for payment status
  fastify.post('/webhook/order/paid', async (request, reply) => {
    try {
      const isValid = verifyShopifyWebhook(
        JSON.stringify(request.body),
        request.headers['x-shopify-hmac-sha256'] as string
      );

      if (!isValid) {
        return reply.status(401).send({ error: 'Unauthorized' });
      }

      const orderData = request.body as any;
      
      fastify.log.info('Order paid webhook received:', orderData.id);
      
      // Mark order as paid in your database
      // Trigger fulfillment process
      // Send payment confirmation

      return reply.status(200).send({ status: 'ok' });
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Webhook processing failed' });
    }
  });

  // Get checkout status
  fastify.get('/status/:checkoutId', async (request, reply) => {
    const { checkoutId } = request.params as { checkoutId: string };

    try {
      const checkout = await shopifyService.getCheckout(checkoutId);
      return {
        id: checkout.id,
        completed: checkout.completed_at !== null,
        totalPrice: checkout.total_price,
        currency: checkout.currency
      };
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to get checkout status' });
    }
  });
};