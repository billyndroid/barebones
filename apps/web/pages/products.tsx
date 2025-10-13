import { useState, useEffect } from 'react';
import { ProductCard } from '../components/ProductCard';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl?: string;
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [products, searchQuery]);

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

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() === '') return;

    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products/search?q=${encodeURIComponent(searchQuery)}`
      );
      if (!response.ok) {
        throw new Error('Search failed');
      }
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
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
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error">Error: {error}</div>
        <button onClick={fetchProducts}>Try Again</button>
        <style jsx>{`
          .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
            text-align: center;
          }
          .error {
            color: #e74c3c;
            font-size: 1.2rem;
            margin-bottom: 1rem;
          }
          button {
            background: #3498db;
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 4px;
            cursor: pointer;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="container">
      <header className="header">
        <h1>All Products</h1>
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-button">
            Search
          </button>
        </form>
      </header>

      <main className="main">
        <div className="results-info">
          <p>{filteredProducts.length} products found</p>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="empty">
            <p>No products found</p>
            {searchQuery && (
              <button onClick={() => {
                setSearchQuery('');
                fetchProducts();
              }}>
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className="products-grid">
            {filteredProducts.map((product) => (
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
          margin-bottom: 2rem;
        }

        .header h1 {
          font-size: 2.5rem;
          color: #2c3e50;
          margin-bottom: 1.5rem;
        }

        .search-form {
          display: flex;
          gap: 0.5rem;
          max-width: 500px;
        }

        .search-input {
          flex: 1;
          padding: 0.75rem;
          border: 2px solid #bdc3c7;
          border-radius: 4px;
          font-size: 1rem;
        }

        .search-input:focus {
          outline: none;
          border-color: #3498db;
        }

        .search-button {
          background: #3498db;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 4px;
          cursor: pointer;
          font-size: 1rem;
        }

        .search-button:hover {
          background: #2980b9;
        }

        .results-info {
          margin: 1rem 0;
          color: #7f8c8d;
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
          background: #e74c3c;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 4px;
          cursor: pointer;
          font-size: 1rem;
        }

        .empty button:hover {
          background: #c0392b;
        }

        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 2rem;
          margin-top: 1rem;
        }

        @media (max-width: 768px) {
          .container {
            padding: 1rem;
          }
          
          .header h1 {
            font-size: 2rem;
          }
          
          .search-form {
            flex-direction: column;
          }
          
          .products-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
        }
      `}</style>
    </div>
  );
}