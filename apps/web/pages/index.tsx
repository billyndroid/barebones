import { useState, useEffect } from 'react';
import { ProductCard } from '../components/ProductCard';
import { Header } from '../components/Header';

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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="container">
          <div className="loading">Loading products...</div>
          <style jsx>{`
            .container {
              max-width: 1200px;
              margin: 0 auto;
              padding: 2rem;
            }
            .loading {
              text-align: center;
              font-size: 1.2rem;
              color: #666;
            }
          `}</style>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="container">
          <div className="error">Error: {error}</div>
          <style jsx>{`
            .container {
              max-width: 1200px;
              margin: 0 auto;
              padding: 2rem;
            }
            .error {
              text-align: center;
              font-size: 1.2rem;
              color: #e74c3c;
            }
          `}</style>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="container">
        <header className="header">
          <h1>Welcome to Barebones Store</h1>
          <p>Discover our amazing product catalog</p>
        </header>

      <main className="main">
        {products.length === 0 ? (
          <div className="empty">
            <p>No products available</p>
            <button onClick={fetchProducts}>Refresh</button>
          </div>
        ) : (
          <div className="products-grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>

      <style jsx>{`
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .header h1 {
          font-size: 2.5rem;
          color: #2c3e50;
          margin-bottom: 0.5rem;
        }

        .header p {
          font-size: 1.1rem;
          color: #7f8c8d;
        }

        .main {
          min-height: 400px;
        }

        .empty {
          text-align: center;
          padding: 4rem 0;
        }

        .empty p {
          font-size: 1.2rem;
          color: #95a5a6;
          margin-bottom: 1rem;
        }

        .empty button {
          background: #3498db;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 4px;
          cursor: pointer;
          font-size: 1rem;
        }

        .empty button:hover {
          background: #2980b9;
        }

        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 2rem;
          margin-top: 2rem;
        }

        @media (max-width: 768px) {
          .container {
            padding: 1rem;
          }
          
          .header h1 {
            font-size: 2rem;
          }
          
          .products-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
        }
      `}</style>
      </div>
    </>
  );
}