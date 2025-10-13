import { useState, useEffect } from 'react';
import { ProductGrid } from '../components/ProductGrid';
import { Header } from '../components/Header';
import { Button } from '../components/UIComponents';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl?: string;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const response = await fetch(`${API_URL}/api/products`);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      // Show only first 6 products on home page
      setProducts(data.slice(0, 6));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="container">
        <header className="hero-section">
          <div className="hero-content">
            <h1>Welcome to Barebones Store</h1>
            <p>Discover our amazing collection of high-quality products</p>
            <div className="hero-actions">
              <Button 
                variant="primary" 
                size="large"
                onClick={() => window.location.href = '/products'}
              >
                Shop All Products
              </Button>
              <Button 
                variant="outline" 
                size="large"
                onClick={() => window.location.href = '/about'}
              >
                Learn More
              </Button>
            </div>
          </div>
        </header>

        <section className="featured-products">
          <div className="section-header">
            <h2>Featured Products</h2>
            <p>Check out some of our best-selling items</p>
          </div>

          <ProductGrid
            products={products}
            loading={loading}
            error={error}
          />

          {products.length > 0 && (
            <div className="view-all-section">
              <Button 
                variant="primary"
                onClick={() => window.location.href = '/products'}
              >
                View All Products
              </Button>
            </div>
          )}
        </section>

        <section className="features-section">
          <h2>Why Choose Barebones Store?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🚚</div>
              <h3>Fast Shipping</h3>
              <p>Free shipping on orders over $50. Get your products delivered quickly and safely.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Secure Payments</h3>
              <p>Your payment information is protected with industry-standard security measures.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📞</div>
              <h3>24/7 Support</h3>
              <p>Our customer service team is available around the clock to help you.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">↩️</div>
              <h3>Easy Returns</h3>
              <p>Not satisfied? Return your purchase within 30 days for a full refund.</p>
            </div>
          </div>
        </section>
      </div>

      <style jsx>{`
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .hero-section {
          text-align: center;
          margin-bottom: 4rem;
          padding: 4rem 2rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 16px;
          color: white;
          position: relative;
          overflow: hidden;
        }

        .hero-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><g fill="%23ffffff" fill-opacity="0.1"><circle cx="30" cy="30" r="4"/></g></svg>');
          pointer-events: none;
        }

        .hero-content {
          position: relative;
          z-index: 1;
        }

        .hero-section h1 {
          font-size: 3rem;
          margin-bottom: 1rem;
          font-weight: 700;
        }

        .hero-section p {
          font-size: 1.25rem;
          margin-bottom: 2rem;
          opacity: 0.9;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .hero-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .featured-products {
          margin-bottom: 4rem;
        }

        .section-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .section-header h2 {
          font-size: 2.5rem;
          color: #2c3e50;
          margin-bottom: 0.5rem;
        }

        .section-header p {
          font-size: 1.1rem;
          color: #7f8c8d;
        }

        .view-all-section {
          text-align: center;
          margin-top: 3rem;
        }

        .features-section {
          background: #f8f9fa;
          padding: 4rem 2rem;
          border-radius: 16px;
          margin-top: 4rem;
        }

        .features-section h2 {
          text-align: center;
          font-size: 2.5rem;
          color: #2c3e50;
          margin-bottom: 3rem;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
        }

        .feature-card {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          text-align: center;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .feature-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }

        .feature-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .feature-card h3 {
          color: #2c3e50;
          margin-bottom: 1rem;
          font-size: 1.25rem;
        }

        .feature-card p {
          color: #7f8c8d;
          line-height: 1.6;
        }

        @media (max-width: 768px) {
          .container {
            padding: 1rem;
          }

          .hero-section {
            padding: 3rem 1rem;
            margin-bottom: 3rem;
          }
          
          .hero-section h1 {
            font-size: 2.5rem;
          }

          .hero-section p {
            font-size: 1.1rem;
          }

          .hero-actions {
            flex-direction: column;
            align-items: center;
          }

          .section-header h2 {
            font-size: 2rem;
          }

          .features-section {
            padding: 3rem 1rem;
          }

          .features-section h2 {
            font-size: 2rem;
          }

          .features-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 480px) {
          .hero-section h1 {
            font-size: 2rem;
          }

          .hero-section p {
            font-size: 1rem;
          }
        }
      `}</style>
    </>
  );
}