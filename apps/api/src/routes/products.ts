import { FastifyPluginAsync } from 'fastify';
import { prisma } from '../prisma/client';
import { shopifyService } from '../services/shopifyService';

export const productRoutes: FastifyPluginAsync = async (fastify) => {
  // Get all products
  fastify.get('/', async (request, reply) => {
    try {
      const products = await prisma.product.findMany({
        orderBy: { createdAt: 'desc' }
      });
      return products;
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to fetch products' });
    }
  });

  // Get single product
  fastify.get('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };

    try {
      const product = await prisma.product.findUnique({
        where: { id }
      });

      if (!product) {
        return reply.status(404).send({ error: 'Product not found' });
      }

      return product;
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to fetch product' });
    }
  });

  // Sync products from Shopify
  fastify.post('/sync', async (request, reply) => {
    try {
      const shopifyProducts = await shopifyService.getProducts();
      
      const products = await Promise.all(
        shopifyProducts.map(async (shopifyProduct: any) => {
          return prisma.product.upsert({
            where: { shopifyId: shopifyProduct.id.toString() },
            update: {
              title: shopifyProduct.title,
              description: shopifyProduct.body_html,
              price: parseFloat(shopifyProduct.variants[0]?.price || '0'),
              imageUrl: shopifyProduct.images[0]?.src
            },
            create: {
              shopifyId: shopifyProduct.id.toString(),
              title: shopifyProduct.title,
              description: shopifyProduct.body_html,
              price: parseFloat(shopifyProduct.variants[0]?.price || '0'),
              imageUrl: shopifyProduct.images[0]?.src
            }
          });
        })
      );

      return { message: 'Products synced successfully', count: products.length };
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to sync products' });
    }
  });

  // Search products
  fastify.get('/search', async (request, reply) => {
    const { q } = request.query as { q?: string };

    if (!q) {
      return reply.status(400).send({ error: 'Search query is required' });
    }

    try {
      const products = await prisma.product.findMany({
        where: {
          OR: [
            { title: { contains: q, mode: 'insensitive' } },
            { description: { contains: q, mode: 'insensitive' } }
          ]
        },
        orderBy: { createdAt: 'desc' }
      });

      return products;
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to search products' });
    }
  });
};