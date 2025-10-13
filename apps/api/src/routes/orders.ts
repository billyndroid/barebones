import { FastifyPluginAsync } from 'fastify';
import { prisma } from '../prisma/client';
import { authenticateToken, AuthenticatedRequest } from '../utils/auth';

export const orderRoutes: FastifyPluginAsync = async (fastify) => {


  // Get user's orders
  fastify.get('/', {
    preHandler: authenticateToken
  }, async (request, reply) => {
    try {
      const user = (request as AuthenticatedRequest).user;
      const orders = await prisma.order.findMany({
        where: { userId: user.id },
        include: {
          orderItems: {
            include: {
              product: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });

      return orders;
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to fetch orders' });
    }
  });

  // Get single order
  fastify.get('/:id', {
    preHandler: authenticateToken
  }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const user = (request as AuthenticatedRequest).user;

    try {
      const order = await prisma.order.findFirst({
        where: { 
          id,
          userId: user.id 
        },
        include: {
          orderItems: {
            include: {
              product: true
            }
          }
        }
      });

      if (!order) {
        return reply.status(404).send({ error: 'Order not found' });
      }

      return order;
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to fetch order' });
    }
  });

  // Create new order
  fastify.post('/', {
    preHandler: authenticateToken
  }, async (request, reply) => {
    const user = (request as AuthenticatedRequest).user;
    const { items } = request.body as { 
      items: Array<{ productId: string; quantity: number }> 
    };

    if (!items || items.length === 0) {
      return reply.status(400).send({ error: 'Order items are required' });
    }

    try {
      // Calculate total
      let total = 0;
      const orderItems = [];

      for (const item of items) {
        const product = await prisma.product.findUnique({
          where: { id: item.productId }
        });

        if (!product) {
          return reply.status(400).send({ error: `Product ${item.productId} not found` });
        }

        const itemTotal = product.price.toNumber() * item.quantity;
        total += itemTotal;

        orderItems.push({
          productId: item.productId,
          quantity: item.quantity,
          price: product.price
        });
      }

      // Create order
      const order = await prisma.order.create({
        data: {
          userId: user.id,
          total,
          orderItems: {
            create: orderItems
          }
        },
        include: {
          orderItems: {
            include: {
              product: true
            }
          }
        }
      });

      return order;
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to create order' });
    }
  });

  // Update order status
  fastify.patch('/:id/status', {
    preHandler: authenticateToken
  }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const { status } = request.body as { status: string };
    const user = (request as AuthenticatedRequest).user;

    // Validate status
    const validStatuses = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
    if (!validStatuses.includes(status)) {
      return reply.status(400).send({ error: 'Invalid status value' });
    }

    try {
      const order = await prisma.order.findFirst({
        where: { 
          id,
          userId: user.id 
        }
      });

      if (!order) {
        return reply.status(404).send({ error: 'Order not found' });
      }

      const updatedOrder = await prisma.order.update({
        where: { id },
        data: { status },
        include: {
          orderItems: {
            include: {
              product: true
            }
          }
        }
      });

      return updatedOrder;
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to update order status' });
    }
  });
};