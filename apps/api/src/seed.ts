import { prisma } from './prisma/client';

const dummyProducts = [
  {
    shopifyId: 'dummy-1',
    title: 'Wireless Bluetooth Headphones',
    description: 'Premium noise-canceling wireless headphones with 30-hour battery life. Perfect for music lovers and professionals who demand crystal-clear audio quality.',
    price: 199.99,
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop'
  },
  {
    shopifyId: 'dummy-2',
    title: 'Smartphone Stand',
    description: 'Adjustable aluminum smartphone stand compatible with all devices. Sturdy, lightweight, and perfect for video calls, streaming, or hands-free use.',
    price: 29.99,
    imageUrl: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=500&h=500&fit=crop'
  },
  {
    shopifyId: 'dummy-3',
    title: 'Portable Power Bank',
    description: '20,000mAh high-capacity power bank with fast charging technology. Keep your devices powered up wherever you go with dual USB ports and LED display.',
    price: 49.99,
    imageUrl: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500&h=500&fit=crop'
  },
  {
    shopifyId: 'dummy-4',
    title: 'Mechanical Gaming Keyboard',
    description: 'RGB backlit mechanical keyboard with blue switches. Perfect for gaming and typing with customizable keys and anti-ghosting technology.',
    price: 129.99,
    imageUrl: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=500&h=500&fit=crop'
  },
  {
    shopifyId: 'dummy-5',
    title: 'Wireless Mouse',
    description: 'Ergonomic wireless mouse with precision tracking and long battery life. Comfortable grip design perfect for both work and gaming.',
    price: 39.99,
    imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&h=500&fit=crop'
  },
  {
    shopifyId: 'dummy-6',
    title: 'USB-C Hub',
    description: '7-in-1 USB-C hub with HDMI, USB 3.0, SD card reader, and more. Expand your laptop connectivity with this compact and versatile hub.',
    price: 69.99,
    imageUrl: 'https://images.unsplash.com/photo-1625842268584-8f3296236761?w=500&h=500&fit=crop'
  },
  {
    shopifyId: 'dummy-7',
    title: 'Webcam HD 1080p',
    description: 'Professional HD webcam with autofocus and built-in microphone. Perfect for video conferencing, streaming, and content creation.',
    price: 79.99,
    imageUrl: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=500&h=500&fit=crop'
  },
  {
    shopifyId: 'dummy-8',
    title: 'Laptop Sleeve',
    description: 'Premium leather laptop sleeve with soft interior lining. Available in multiple sizes to protect your laptop in style.',
    price: 45.99,
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop'
  },
  {
    shopifyId: 'dummy-9',
    title: 'Smart Watch',
    description: 'Feature-rich smartwatch with fitness tracking, heart rate monitor, and 7-day battery life. Stay connected and healthy with style.',
    price: 249.99,
    imageUrl: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&h=500&fit=crop'
  },
  {
    shopifyId: 'dummy-10',
    title: 'Bluetooth Speaker',
    description: 'Waterproof portable Bluetooth speaker with 360-degree sound. Perfect for outdoor adventures with 12-hour battery life.',
    price: 89.99,
    imageUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&h=500&fit=crop'
  },
  {
    shopifyId: 'dummy-11',
    title: 'Phone Case',
    description: 'Shockproof phone case with military-grade protection. Clear design showcases your phone while providing maximum security.',
    price: 24.99,
    imageUrl: 'https://images.unsplash.com/photo-1601593346740-925612772716?w=500&h=500&fit=crop'
  },
  {
    shopifyId: 'dummy-12',
    title: 'Desk Lamp LED',
    description: 'Modern LED desk lamp with adjustable brightness and color temperature. Eye-caring technology perfect for work and study.',
    price: 59.99,
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop'
  },
  {
    shopifyId: 'dummy-13',
    title: 'Ergonomic Office Chair',
    description: 'Comfortable ergonomic office chair with lumbar support and adjustable height. Breathable mesh design for all-day comfort.',
    price: 299.99,
    imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=500&fit=crop'
  },
  {
    shopifyId: 'dummy-14',
    title: 'Monitor Stand',
    description: 'Bamboo monitor stand with storage drawer. Raise your screen to eye level while organizing your desk space efficiently.',
    price: 34.99,
    imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&h=500&fit=crop'
  },
  {
    shopifyId: 'dummy-15',
    title: 'Coffee Mug Warmer',
    description: 'Electric coffee mug warmer to keep your beverages at the perfect temperature. Auto shut-off safety feature included.',
    price: 19.99,
    imageUrl: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=500&h=500&fit=crop'
  }
];

async function seedProducts() {
  console.log('🌱 Seeding dummy products...');

  try {
    // Check if we already have products
    const existingProducts = await prisma.product.count();
    
    if (existingProducts > 0) {
      console.log(`✅ Database already has ${existingProducts} products. Skipping seed.`);
      return;
    }

    // Create dummy products only if none exist
    for (const product of dummyProducts) {
      await prisma.product.upsert({
        where: { shopifyId: product.shopifyId },
        update: {},
        create: product
      });
    }

    console.log(`✅ Successfully seeded ${dummyProducts.length} dummy products!`);
  } catch (error) {
    console.error('❌ Error seeding products:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed function if this file is executed directly
if (require.main === module) {
  seedProducts();
}

export { seedProducts, dummyProducts };