import { FastifyPluginAsync } from 'fastify';
import { shopifyService } from '../services/shopifyService';
import { stripeService } from '../services/stripeService';
import { verifyShopifyWebhook } from '../utils/verifyShopifyWebhook';
import { prisma } from '../prisma/client';
import { authenticateToken, optionalAuth, AuthenticatedRequest } from '../utils/auth';

export const checkoutRoutes: FastifyPluginAsync = async (fastify) => {
  // Create payment intent for checkout
  fastify.post('/create-payment-intent', { preHandler: optionalAuth }, async (request, reply) => {
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
      let customerEmail = user?.email;
      let customerName = user?.name;

      // If no authenticated user but customer info provided, create a guest user
      if (!userId && customerInfo?.email) {
        const existingUser = await prisma.user.findUnique({
          where: { email: customerInfo.email }
        });

        if (existingUser) {
          userId = existingUser.id;
          customerEmail = existingUser.email;
          customerName = existingUser.name;
        } else {
          const guestUser = await prisma.user.create({
            data: {
              email: customerInfo.email,
              name: customerInfo.name || 'Guest User',
              password: 'guest-user-no-password' // Placeholder for guest users
            }
          });
          userId = guestUser.id;
          customerEmail = guestUser.email;
          customerName = guestUser.name;
        }
      }

      if (!userId || !customerEmail) {
        return reply.status(400).send({ error: 'User authentication or customer info required' });
      }

      // Calculate total
      const total = items.reduce((sum, item) => {
        const product = products.find((p: any) => p.id === item.id);
        return sum + (product ? Number(product.price) * item.quantity : 0);
      }, 0);

      // Create Stripe customer if not exists
      let stripeCustomerId: string | undefined;
      try {
        const customer = await stripeService.createCustomer(customerEmail, customerName || undefined);
        stripeCustomerId = customer.id;
      } catch (error) {
        // Customer might already exist, continue without customer ID
        console.warn('Could not create Stripe customer:', error);
      }

      // Create order
      const order = await prisma.order.create({
        data: {
          userId,
          total,
          status: 'PENDING',
          paymentStatus: 'PENDING',
          stripeCustomerId,
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

      // Create Stripe PaymentIntent
      const paymentIntent = await stripeService.createPaymentIntent(
        total,
        'usd',
        {
          orderId: order.id,
          customerEmail,
          itemCount: items.length.toString()
        }
      );

      // Update order with payment intent ID
      await prisma.order.update({
        where: { id: order.id },
        data: { paymentIntentId: paymentIntent.id }
      });

      return {
        orderId: order.id,
        clientSecret: paymentIntent.client_secret,
        total: order.total,
        status: 'payment_intent_created'
      };
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to create payment intent' });
    }
  });

  // Create checkout from cart items (legacy endpoint for compatibility)
  fastify.post('/create', { preHandler: optionalAuth }, async (request, reply) => {
    // Redirect to new payment intent endpoint
    return reply.redirect(307, '/api/checkout/create-payment-intent');
  });

  // Confirm payment and complete order
  fastify.post('/confirm-payment/:orderId', { preHandler: optionalAuth }, async (request, reply) => {
    const { orderId } = request.params as { orderId: string };
    const { paymentIntentId } = request.body as { paymentIntentId: string };

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

      if (order.paymentIntentId !== paymentIntentId) {
        return reply.status(400).send({ error: 'Payment intent mismatch' });
      }

      // Verify payment with Stripe
      const paymentIntent = await stripeService.retrievePaymentIntent(paymentIntentId);
      
      if (paymentIntent.status === 'succeeded') {
        // Update order status to completed
        const updatedOrder = await prisma.order.update({
          where: { id: orderId },
          data: { 
            status: 'COMPLETED',
            paymentStatus: 'COMPLETED'
          }
        });

        return {
          orderId: updatedOrder.id,
          status: 'completed',
          paymentStatus: 'completed',
          total: updatedOrder.total,
          message: 'Payment confirmed and order completed successfully!'
        };
      } else {
        // Update payment status to failed
        await prisma.order.update({
          where: { id: orderId },
          data: { paymentStatus: 'FAILED' }
        });

        return reply.status(400).send({ 
          error: 'Payment not completed',
          paymentStatus: paymentIntent.status
        });
      }
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to confirm payment' });
    }
  });

  // Complete checkout/order (legacy endpoint)
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

      // For demo/testing purposes, mark as completed
      const updatedOrder = await prisma.order.update({
        where: { id: orderId },
        data: { 
          status: 'COMPLETED',
          paymentStatus: 'COMPLETED'
        }
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

  // Handle Stripe webhooks
  fastify.post('/webhook/stripe', async (request, reply) => {
    const signature = request.headers['stripe-signature'] as string;
    
    if (!signature) {
      return reply.status(400).send({ error: 'Missing stripe signature' });
    }

    try {
      const event = await stripeService.handleWebhook(
        JSON.stringify(request.body),
        signature
      );

      switch (event.type) {
        case 'payment_intent.succeeded':
          const paymentIntent = event.data.object as any;
          const orderId = paymentIntent.metadata?.orderId;
          
          if (orderId) {
            await prisma.order.update({
              where: { id: orderId },
              data: { 
                status: 'COMPLETED',
                paymentStatus: 'COMPLETED'
              }
            });
            fastify.log.info(`Order ${orderId} payment confirmed via webhook`);
          }
          break;

        case 'payment_intent.payment_failed':
          const failedPayment = event.data.object as any;
          const failedOrderId = failedPayment.metadata?.orderId;
          
          if (failedOrderId) {
            await prisma.order.update({
              where: { id: failedOrderId },
              data: { paymentStatus: 'FAILED' }
            });
            fastify.log.info(`Order ${failedOrderId} payment failed via webhook`);
          }
          break;

        default:
          fastify.log.info(`Unhandled Stripe event type: ${event.type}`);
      }

      return reply.status(200).send({ received: true });
    } catch (error) {
      fastify.log.error('Stripe webhook error:', error);
      return reply.status(400).send({ error: 'Webhook processing failed' });
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

  // Get order status
  fastify.get('/order-status/:orderId', { preHandler: optionalAuth }, async (request, reply) => {
    const { orderId } = request.params as { orderId: string };

    try {
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        select: {
          id: true,
          status: true,
          paymentStatus: true,
          total: true,
          createdAt: true,
          updatedAt: true
        }
      });

      if (!order) {
        return reply.status(404).send({ error: 'Order not found' });
      }

      return {
        orderId: order.id,
        status: order.status,
        paymentStatus: order.paymentStatus,
        total: order.total,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt
      };
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to get order status' });
    }
  });
};