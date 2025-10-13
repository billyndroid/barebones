import { FastifyPluginAsync } from 'fastify';
import jwt from 'jsonwebtoken';
import { prisma } from '../prisma/client';

export const authRoutes: FastifyPluginAsync = async (fastify) => {
  // Login endpoint
  fastify.post('/login', async (request, reply) => {
    const { email, password } = request.body as { email: string; password: string };

    try {
      // In a real app, you'd verify password against hashed version
      const user = await prisma.user.findUnique({
        where: { email }
      });

      if (!user) {
        return reply.status(401).send({ error: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      return { token, user: { id: user.id, email: user.email, name: user.name } };
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  });

  // Register endpoint
  fastify.post('/register', async (request, reply) => {
    const { email, name, password } = request.body as { 
      email: string; 
      name: string; 
      password: string; 
    };

    try {
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });

      if (existingUser) {
        return reply.status(400).send({ error: 'User already exists' });
      }

      // In a real app, you'd hash the password before storing
      const user = await prisma.user.create({
        data: {
          email,
          name
        }
      });

      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      return { token, user: { id: user.id, email: user.email, name: user.name } };
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  });

  // Verify token endpoint
  fastify.get('/verify', async (request, reply) => {
    try {
      const authHeader = request.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return reply.status(401).send({ error: 'Missing or invalid token' });
      }

      const token = authHeader.substring(7);
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;

      const user = await prisma.user.findUnique({
        where: { id: decoded.userId }
      });

      if (!user) {
        return reply.status(401).send({ error: 'User not found' });
      }

      return { user: { id: user.id, email: user.email, name: user.name } };
    } catch (error) {
      return reply.status(401).send({ error: 'Invalid token' });
    }
  });
};