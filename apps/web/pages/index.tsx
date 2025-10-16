import { useState, useEffect } from 'react';
import { ProductGrid } from '../components/ProductGrid';
import { Header } from '../components/Header';
import { Button } from '../components/UIComponents';
import Head from 'next/head';

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
      console.log('Fetching from:', `${API_URL}/api/products`);
      const response = await fetch(`${API_URL}/api/products`);
      console.log('Response status:', response.status);
      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      console.log('Fetched products:', data.length);
      // Show only first 6 products on home page
      setProducts(data.slice(0, 6));
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Poppins:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>
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
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 8H17V6C17 3.24 14.76 1 12 1S7 3.24 7 6V8H4C2.9 8 2 8.9 2 10V20C2 21.1 2.9 22 4 22H20C21.1 22 22 21.1 22 20V10C22 8.9 21.1 8 20 8ZM12 3C13.66 3 15 4.34 15 6V8H9V6C9 4.34 10.34 3 12 3ZM20 20H4V10H20V20ZM12 12C10.9 12 10 12.9 10 14S10.9 16 12 16 14 15.1 14 14 13.1 12 12 12Z"/>
                </svg>
              </div>
              <h3>Fast Shipping</h3>
              <p>Free shipping on orders over $50. Get your products delivered quickly and safely.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 8H17V6C17 3.24 14.76 1 12 1S7 3.24 7 6V8H6C4.9 8 4 8.9 4 10V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V10C20 8.9 19.1 8 18 8ZM9 6C9 4.34 10.34 3 12 3S15 4.34 15 6V8H9V6ZM18 20H6V10H18V20ZM12 17C13.1 17 14 16.1 14 15S13.1 13 12 13 10 13.9 10 15 10.9 17 12 17Z"/>
                </svg>
              </div>
              <h3>Secure Payments</h3>
              <p>Your payment information is protected with industry-standard security measures.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 15.5C18.75 15.5 17.58 15.15 16.61 14.54L14.21 16.94C14.21 16.94 15.5 18.75 15.5 20C15.5 21.25 14.25 22.5 13 22.5S10.5 21.25 10.5 20C10.5 18.75 11.79 16.94 11.79 16.94L9.39 14.54C8.42 15.15 7.25 15.5 6 15.5C4.75 15.5 3.5 14.25 3.5 13S4.75 10.5 6 10.5C7.25 10.5 8.42 10.85 9.39 11.46L11.79 9.06C11.79 9.06 10.5 7.25 10.5 6C10.5 4.75 11.75 3.5 13 3.5S15.5 4.75 15.5 6C15.5 7.25 14.21 9.06 14.21 9.06L16.61 11.46C17.58 10.85 18.75 10.5 20 10.5C21.25 10.5 22.5 11.75 22.5 13S21.25 15.5 20 15.5Z"/>
                </svg>
              </div>
              <h3>24/7 Support</h3>
              <p>Our customer service team is available around the clock to help you.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.5 8C9.85 8 7.45 6.92 6.26 5.23C5.28 8.47 6.56 12.13 9.44 14.56C10.61 15.5 12.06 16 13.5 16C14.94 16 16.39 15.5 17.56 14.56C20.44 12.13 21.72 8.47 20.74 5.23C19.55 6.92 17.15 8 14.5 8H12.5ZM21 3C21 4.1 20.1 5 19 5C17.9 5 17 4.1 17 3S17.9 1 19 1 21 1.9 21 3ZM5 3C5 4.1 4.1 5 3 5S1 4.1 1 3 1.9 1 3 1 5 1.9 5 3Z"/>
                </svg>
              </div>
              <h3>Easy Returns</h3>
              <p>Not satisfied? Return your purchase within 30 days for a full refund.</p>
            </div>
          </div>
        </section>
      </div>

      <style jsx>{`
        :global(:root) {
          --primary-600: #F0386B;
          --primary-700: #e02d5f;
          --primary-800: #d12653;
          --primary-900: #c01e47;
          --accent-500: #FE654F;
          --accent-600: #fe4a3b;
          --neutral-50: #FFFFFF;
          --neutral-100: #F8C0C8;
          --neutral-200: #E2C290;
          --neutral-300: #cbd5e1;
          --neutral-400: #94a3b8;
          --neutral-500: #64748b;
          --neutral-600: #475569;
          --neutral-700: #3F334D;
          --neutral-800: #1e293b;
          --neutral-900: #0f172a;
          --glass-bg: rgba(255, 255, 255, 0.1);
          --glass-border: rgba(255, 255, 255, 0.2);
          --shadow-glass: 0 8px 32px rgba(0, 0, 0, 0.1);
          --shadow-elevated: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }

        :global(body) {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: linear-gradient(135deg, #F0386B 0%, #FE654F 50%, #F8C0C8 100%);
          min-height: 100vh;
          margin: 0;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
          animation: fadeInUp 0.8s ease-out;
        }

        .hero-section {
          text-align: center;
          margin-bottom: 4rem;
          padding: 5rem 2rem;
          background: linear-gradient(135deg, 
            rgba(240, 56, 107, 0.9) 0%, 
            rgba(254, 101, 79, 0.9) 50%,
            rgba(248, 192, 200, 0.9) 100%);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid var(--glass-border);
          border-radius: 24px;
          color: white;
          position: relative;
          overflow: hidden;
          box-shadow: var(--shadow-glass);
          animation: heroFloat 6s ease-in-out infinite;
        }

        .hero-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
                      radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
                      url('data:image/svg+xml,<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><g fill="%23ffffff" fill-opacity="0.05"><circle cx="30" cy="30" r="2"/></g></svg>');
          pointer-events: none;
          animation: shimmer 3s ease-in-out infinite;
        }

        .hero-section::after {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: conic-gradient(from 0deg, transparent, rgba(255, 255, 255, 0.1), transparent);
          animation: rotate 20s linear infinite;
          pointer-events: none;
        }

        .hero-content {
          position: relative;
          z-index: 1;
        }

        .hero-section h1 {
          font-family: 'Poppins', sans-serif;
          font-size: 3.5rem;
          margin-bottom: 1.5rem;
          font-weight: 700;
          background: linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          animation: textGlow 2s ease-in-out infinite alternate;
        }

        .hero-section p {
          font-size: 1.3rem;
          margin-bottom: 2.5rem;
          opacity: 0.95;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
          font-weight: 400;
          line-height: 1.6;
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .hero-actions {
          display: flex;
          gap: 1.5rem;
          justify-content: center;
          flex-wrap: wrap;
          animation: buttonsSlideUp 1s ease-out 0.5s both;
        }

        .featured-products {
          margin-bottom: 4rem;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-radius: 24px;
          padding: 3rem;
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: var(--shadow-glass);
        }

        .section-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .section-header h2 {
          font-family: 'Poppins', sans-serif;
          font-size: 2.8rem;
          color: var(--neutral-800);
          margin-bottom: 1rem;
          font-weight: 600;
          background: linear-gradient(135deg, var(--primary-700) 0%, var(--primary-900) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .section-header p {
          font-size: 1.2rem;
          color: var(--neutral-600);
          font-weight: 400;
        }

        .view-all-section {
          text-align: center;
          margin-top: 3rem;
        }

        .features-section {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          padding: 4rem 2rem;
          border-radius: 24px;
          margin-top: 4rem;
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: var(--shadow-glass);
        }

        .features-section h2 {
          font-family: 'Poppins', sans-serif;
          text-align: center;
          font-size: 2.8rem;
          color: var(--neutral-800);
          margin-bottom: 3rem;
          font-weight: 600;
          background: linear-gradient(135deg, var(--primary-700) 0%, var(--accent-600) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
        }

        .feature-card {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          padding: 2.5rem;
          border-radius: 20px;
          text-align: center;
          border: 1px solid rgba(255, 255, 255, 0.4);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          position: relative;
          overflow: hidden;
        }

        .feature-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #F0386B, #FE654F);
          transform: scaleX(0);
          transition: transform 0.3s ease;
        }

        .feature-card:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: var(--shadow-elevated);
        }

        .feature-card:hover::before {
          transform: scaleX(1);
        }

        .feature-icon {
          font-size: 3.5rem;
          margin-bottom: 1.5rem;
          transition: transform 0.3s ease;
          filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
          color: #F0386B;
        }

        .feature-card:hover .feature-icon {
          transform: scale(1.1) rotate(5deg);
        }

        .feature-card h3 {
          color: var(--neutral-800);
          margin-bottom: 1rem;
          font-size: 1.4rem;
          font-weight: 600;
          font-family: 'Poppins', sans-serif;
        }

        .feature-card p {
          color: var(--neutral-600);
          line-height: 1.7;
          font-weight: 400;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes heroFloat {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes shimmer {
          0%, 100% {
            opacity: 0.5;
          }
          50% {
            opacity: 1;
          }
        }

        @keyframes rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes textGlow {
          from {
            filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.5));
          }
          to {
            filter: drop-shadow(0 0 30px rgba(255, 255, 255, 0.8));
          }
        }

        @keyframes buttonsSlideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          .container {
            padding: 1rem;
          }

          .hero-section {
            padding: 3rem 1.5rem;
            margin-bottom: 3rem;
          }
          
          .hero-section h1 {
            font-size: 2.8rem;
          }

          .hero-section p {
            font-size: 1.1rem;
          }

          .hero-actions {
            flex-direction: column;
            align-items: center;
            gap: 1rem;
          }

          .section-header h2 {
            font-size: 2.2rem;
          }

          .features-section {
            padding: 3rem 1.5rem;
          }

          .features-section h2 {
            font-size: 2.2rem;
          }

          .features-grid {
            grid-template-columns: 1fr;
          }

          .featured-products {
            padding: 2rem 1.5rem;
          }
        }

        @media (max-width: 480px) {
          .hero-section h1 {
            font-size: 2.2rem;
          }

          .hero-section p {
            font-size: 1rem;
          }

          .feature-card {
            padding: 2rem 1.5rem;
          }
        }
      `}</style>
    </>
  );
}