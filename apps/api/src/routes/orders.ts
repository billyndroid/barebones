import { FastifyPluginAsync } from 'fastify';
import { prisma } from '../prisma/client';
import jwt from 'jsonwebtoken';

export const orderRoutes: FastifyPluginAsync = async (fastify) => {
  // Middleware to verify JWT token
  const verifyToken = async (request: any, reply: any) => {
    try {
      const authHeader = request.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return reply.status(401).send({ error: 'Missing or invalid token' });
      }

      const token = authHeader.substring(7);
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
      request.user = decoded;
    } catch (error) {
      return reply.status(401).send({ error: 'Invalid token' });
    }
  };

  // Get user's orders
  fastify.get('/', {
    preHandler: verifyToken
  }, async (request: any, reply) => {
    try {
      const orders = await prisma.order.findMany({
        where: { userId: request.user.userId },
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
    preHandler: verifyToken
  }, async (request: any, reply) => {
    const { id } = request.params;

    try {
      const order = await prisma.order.findFirst({
        where: { 
          id,
          userId: request.user.userId 
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
    preHandler: verifyToken
  }, async (request: any, reply) => {
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
          userId: request.user.userId,
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
    preHandler: verifyToken
  }, async (request: any, reply) => {
    const { id } = request.params;
    const { status } = request.body as { status: string };

    try {
      const order = await prisma.order.findFirst({
        where: { 
          id,
          userId: request.user.userId 
        }
      });

      if (!order) {
        return reply.status(404).send({ error: 'Order not found' });
      }

      const updatedOrder = await prisma.order.update({
        where: { id },
        data: { status: status as any },
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