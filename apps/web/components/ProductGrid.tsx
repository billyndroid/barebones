import { useState, useEffect } from 'react';
import { ProductCard } from './ProductCard';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl?: string;
}

interface ProductGridProps {
  products?: Product[];
  loading?: boolean;
  error?: string;
  searchTerm?: string;
  sortBy?: 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc';
}

export function ProductGrid({ 
  products = [], 
  loading = false, 
  error,
  searchTerm = '',
  sortBy = 'name-asc'
}: ProductGridProps) {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  useEffect(() => {
    let filtered = [...products];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'name-desc':
          return b.title.localeCompare(a.title);
        case 'name-asc':
        default:
          return a.title.localeCompare(b.title);
      }
    });

    setFilteredProducts(filtered);
  }, [products, searchTerm, sortBy]);

  if (loading) {
    return (
      <div className="product-grid-container">
        <div className="loading-grid">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="skeleton-card">
              <div className="skeleton-image"></div>
              <div className="skeleton-content">
                <div className="skeleton-title"></div>
                <div className="skeleton-description"></div>
                <div className="skeleton-footer">
                  <div className="skeleton-price"></div>
                  <div className="skeleton-button"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <style jsx>{`
          .product-grid-container {
            width: 100%;
          }

          .loading-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 1.5rem;
            padding: 1rem 0;
          }

          .skeleton-card {
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            animation: pulse 1.5s ease-in-out infinite alternate;
          }

          .skeleton-image {
            width: 100%;
            height: 200px;
            background: #f0f0f0;
          }

          .skeleton-content {
            padding: 1.5rem;
          }

          .skeleton-title {
            height: 1.5rem;
            background: #f0f0f0;
            border-radius: 4px;
            margin-bottom: 0.75rem;
            width: 80%;
          }

          .skeleton-description {
            height: 3rem;
            background: #f0f0f0;
            border-radius: 4px;
            margin-bottom: 1.5rem;
          }

          .skeleton-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .skeleton-price {
            height: 1.5rem;
            width: 4rem;
            background: #f0f0f0;
            border-radius: 4px;
          }

          .skeleton-button {
            height: 2.5rem;
            width: 6rem;
            background: #f0f0f0;
            border-radius: 6px;
          }

          @keyframes pulse {
            0% {
              opacity: 1;
            }
            100% {
              opacity: 0.7;
            }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-content">
          <h3>Oops! Something went wrong</h3>
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="retry-button">
            Try Again
          </button>
        </div>
        <style jsx>{`
          .error-container {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 300px;
            padding: 2rem;
          }

          .error-content {
            text-align: center;
            background: white;
            padding: 2rem;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            max-width: 400px;
          }

          .error-content h3 {
            color: #e74c3c;
            margin: 0 0 1rem 0;
          }

          .error-content p {
            color: #7f8c8d;
            margin: 0 0 1.5rem 0;
          }

          .retry-button {
            background: #3498db;
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 6px;
            cursor: pointer;
            font-size: 0.9rem;
            font-weight: 500;
            transition: background 0.2s ease;
          }

          .retry-button:hover {
            background: #2980b9;
          }
        `}</style>
      </div>
    );
  }

  if (filteredProducts.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-content">
          <h3>No products found</h3>
          <p>
            {searchTerm 
              ? `No products match "${searchTerm}". Try a different search term.`
              : 'No products available at the moment.'
            }
          </p>
        </div>
        <style jsx>{`
          .empty-state {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 300px;
            padding: 2rem;
          }

          .empty-content {
            text-align: center;
            color: #7f8c8d;
          }

          .empty-content h3 {
            margin: 0 0 1rem 0;
            color: #2c3e50;
          }

          .empty-content p {
            margin: 0;
            max-width: 400px;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="product-grid-container">
      <div className="results-info">
        <span className="results-count">
          {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
        </span>
      </div>
      
      <div className="product-grid">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <style jsx>{`
        .product-grid-container {
          width: 100%;
        }

        .results-info {
          margin-bottom: 1.5rem;
          padding: 0 0.5rem;
        }

        .results-count {
          color: #7f8c8d;
          font-size: 0.9rem;
        }

        .product-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.5rem;
          padding: 0;
        }

        @media (max-width: 768px) {
          .product-grid {
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 1rem;
          }

          .results-info {
            margin-bottom: 1rem;
          }
        }

        @media (max-width: 480px) {
          .product-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
        }
      `}</style>
    </div>
  );
}