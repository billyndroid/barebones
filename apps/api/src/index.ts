import Fastify from 'fastify';
import cors from '@fastify/cors';
import { authRoutes } from './routes/auth';
import { productRoutes } from './routes/products';
import { orderRoutes } from './routes/orders';
import { checkoutRoutes } from './routes/checkout';

const fastify = Fastify({
  logger: true
});

// Register CORS
fastify.register(cors, {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-domain.com'] 
    : ['http://localhost:3000', 'http://localhost:3002']
});

// Register routes
fastify.register(authRoutes, { prefix: '/api/auth' });
fastify.register(productRoutes, { prefix: '/api/products' });
fastify.register(orderRoutes, { prefix: '/api/orders' });
fastify.register(checkoutRoutes, { prefix: '/api/checkout' });

// Health check
fastify.get('/health', async () => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});

const start = async () => {
  try {
    const port = Number(process.env.API_PORT) || 3001;
    await fastify.listen({ port, host: '0.0.0.0' });
    console.log(`Server running on http://localhost:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();