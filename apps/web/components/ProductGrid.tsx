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
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 2rem;
            padding: 1rem 0;
          }

          .skeleton-card {
            background: rgba(255, 255, 255, 0.8);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.3);
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
            animation: skeletonPulse 2s ease-in-out infinite;
          }

          .skeleton-image {
            width: 100%;
            height: 240px;
            background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
            background-size: 200% 100%;
            animation: shimmer 2s infinite;
          }

          .skeleton-content {
            padding: 2rem 1.5rem 1.5rem;
          }

          .skeleton-title {
            height: 1.5rem;
            background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
            background-size: 200% 100%;
            border-radius: 8px;
            margin-bottom: 1rem;
            width: 80%;
            animation: shimmer 2s infinite;
            animation-delay: 0.2s;
          }

          .skeleton-description {
            height: 3.5rem;
            background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
            background-size: 200% 100%;
            border-radius: 8px;
            margin-bottom: 1.5rem;
            animation: shimmer 2s infinite;
            animation-delay: 0.4s;
          }

          .skeleton-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-top: 1rem;
            border-top: 1px solid rgba(0, 0, 0, 0.05);
          }

          .skeleton-price {
            height: 1.5rem;
            width: 5rem;
            background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
            background-size: 200% 100%;
            border-radius: 8px;
            animation: shimmer 2s infinite;
            animation-delay: 0.6s;
          }

          .skeleton-button {
            height: 2.5rem;
            width: 7rem;
            background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
            background-size: 200% 100%;
            border-radius: 12px;
            animation: shimmer 2s infinite;
            animation-delay: 0.8s;
          }

          @keyframes skeletonPulse {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.8;
            }
          }

          @keyframes shimmer {
            0% {
              background-position: -200% 0;
            }
            100% {
              background-position: 200% 0;
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
          <div className="error-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12S6.48 22 12 22 22 17.52 22 12 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z"/>
            </svg>
          </div>
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
            min-height: 400px;
            padding: 3rem;
          }

          .error-content {
            text-align: center;
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            padding: 3rem 2rem;
            border-radius: 24px;
            border: 1px solid rgba(255, 255, 255, 0.3);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
            max-width: 500px;
            animation: errorSlide 0.5s ease-out;
          }

          .error-icon {
            font-size: 4rem;
            margin-bottom: 1.5rem;
            animation: errorBounce 2s ease-in-out infinite;
          }

          .error-content h3 {
            font-family: 'Poppins', sans-serif;
            color: #ef4444;
            margin: 0 0 1rem 0;
            font-size: 1.5rem;
            font-weight: 600;
          }

          .error-content p {
            color: #64748b;
            margin: 0 0 2rem 0;
            font-size: 1.1rem;
            line-height: 1.6;
          }

          .retry-button {
            background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
            color: white;
            border: none;
            padding: 1rem 2rem;
            border-radius: 12px;
            cursor: pointer;
            font-size: 1rem;
            font-weight: 500;
            font-family: 'Inter', sans-serif;
            transition: all 0.3s ease;
            box-shadow: 0 4px 14px rgba(239, 68, 68, 0.3);
          }

          .retry-button:hover {
            background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(239, 68, 68, 0.4);
          }

          @keyframes errorSlide {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes errorBounce {
            0%, 100% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.1);
            }
          }
        `}</style>
      </div>
    );
  }

  if (filteredProducts.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-content">
          <div className="empty-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 7H16V6C16 3.79 14.21 2 12 2S8 3.79 8 6V7H5C3.9 7 3 7.9 3 9V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V9C21 7.9 20.1 7 19 7ZM10 6C10 4.9 10.9 4 12 4S14 4.9 14 6V7H10V6ZM19 19H5V9H7V11C7 11.55 7.45 12 8 12S9 11.55 9 11V9H15V11C15 11.55 15.45 12 16 12S17 11.55 17 11V9H19V19Z"/>
            </svg>
          </div>
          <h3>No products found</h3>
          <p>
            {searchTerm 
              ? `No products match "${searchTerm}". Try a different search term.`
              : 'No products available at the moment. Check back soon!'
            }
          </p>
        </div>
        <style jsx>{`
          .empty-state {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 400px;
            padding: 3rem;
          }

          .empty-content {
            text-align: center;
            background: rgba(255, 255, 255, 0.8);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            padding: 3rem 2rem;
            border-radius: 24px;
            border: 1px solid rgba(255, 255, 255, 0.3);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
            max-width: 500px;
            animation: emptySlide 0.5s ease-out;
          }

          .empty-icon {
            font-size: 4rem;
            margin-bottom: 1.5rem;
            animation: emptyFloat 3s ease-in-out infinite;
          }

          .empty-content h3 {
            font-family: 'Poppins', sans-serif;
            margin: 0 0 1rem 0;
            color: #334155;
            font-size: 1.5rem;
            font-weight: 600;
          }

          .empty-content p {
            color: #64748b;
            margin: 0;
            max-width: 400px;
            font-size: 1.1rem;
            line-height: 1.6;
          }

          @keyframes emptySlide {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes emptyFloat {
            0%, 100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-10px);
            }
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
          margin-bottom: 2rem;
          padding: 1rem 1.5rem;
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
        }

        .results-count {
          color: #64748b;
          font-size: 1rem;
          font-weight: 500;
          font-family: 'Inter', sans-serif;
        }

        .product-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 2rem;
          padding: 0;
        }

        @media (max-width: 768px) {
          .product-grid {
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 1.5rem;
          }

          .results-info {
            margin-bottom: 1.5rem;
            padding: 0.75rem 1rem;
          }

          .results-count {
            font-size: 0.9rem;
          }
        }

        @media (max-width: 480px) {
          .product-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .results-info {
            padding: 0.75rem;
          }
        }
      `}</style>
    </div>
  );
}