import { FastifyPluginAsync } from 'fastify';
import { shopifyService } from '../services/shopifyService';
import { verifyShopifyWebhook } from '../utils/verifyShopifyWebhook';

export const checkoutRoutes: FastifyPluginAsync = async (fastify) => {
  // Create Shopify checkout
  fastify.post('/create', async (request, reply) => {
    const { items } = request.body as {
      items: Array<{ variantId: string; quantity: number }>
    };

    if (!items || items.length === 0) {
      return reply.status(400).send({ error: 'Items are required' });
    }

    try {
      const checkout = await shopifyService.createCheckout(items);
      return { checkoutUrl: checkout.web_url };
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to create checkout' });
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