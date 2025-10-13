import { FastifyPluginAsync } from 'fastify';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { prisma } from '../prisma/client';

export const authRoutes: FastifyPluginAsync = async (fastify) => {
  // Input validation schemas
  const loginSchema = {
    body: {
      type: 'object',
      required: ['email', 'password'],
      properties: {
        email: { type: 'string', format: 'email' },
        password: { type: 'string', minLength: 6 }
      }
    }
  };

  const registerSchema = {
    body: {
      type: 'object',
      required: ['email', 'name', 'password'],
      properties: {
        email: { type: 'string', format: 'email' },
        name: { type: 'string', minLength: 1 },
        password: { type: 'string', minLength: 6 }
      }
    }
  };

  // Login endpoint
  fastify.post('/login', { schema: loginSchema }, async (request, reply) => {
    const { email, password } = request.body as { email: string; password: string };

    try {
      const user = await prisma.user.findUnique({
        where: { email }
      });

      if (!user) {
        return reply.status(401).send({ error: 'Invalid credentials' });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
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
  fastify.post('/register', { schema: registerSchema }, async (request, reply) => {
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

      // Hash password before storing
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const user = await prisma.user.create({
        data: {
          email,
          name,
          password: hashedPassword
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
  fastify.get('/verify', { preHandler: async (request, reply) => {
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return reply.status(401).send({ error: 'Missing or invalid token' });
    }

    const token = authHeader.substring(7);
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: { id: true, email: true, name: true }
      });

      if (!user) {
        return reply.status(401).send({ error: 'User not found' });
      }

      (request as any).user = user;
    } catch (error) {
      return reply.status(401).send({ error: 'Invalid token' });
    }
  }}, async (request, reply) => {
    return { user: (request as any).user };
  });

  // Get user profile
  fastify.get('/profile', { preHandler: async (request, reply) => {
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return reply.status(401).send({ error: 'Missing or invalid token' });
    }

    const token = authHeader.substring(7);
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: { id: true, email: true, name: true, createdAt: true }
      });

      if (!user) {
        return reply.status(401).send({ error: 'User not found' });
      }

      (request as any).user = user;
    } catch (error) {
      return reply.status(401).send({ error: 'Invalid token' });
    }
  }}, async (request, reply) => {
    const user = (request as any).user;
    const orderCount = await prisma.order.count({
      where: { userId: user.id }
    });

    return { 
      user: { 
        ...user, 
        orderCount 
      } 
    };
  });
};