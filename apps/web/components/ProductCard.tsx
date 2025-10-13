import { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { useToast } from '../contexts/ToastContext';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl?: string;
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const { addItem, isInCart, getItemQuantity } = useCart();
  const { showSuccess, showError } = useToast();

  const handleAddToCart = async () => {
    setIsLoading(true);
    
    try {
      // Add item to cart
      addItem({
        id: product.id,
        title: product.title,
        price: product.price,
        imageUrl: product.imageUrl
      });
      
      showSuccess(`${product.title} added to cart!`);
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    } catch (error) {
      console.error('Failed to add to cart:', error);
      showError('Failed to add item to cart');
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  return (
    <div className="product-card">
      <div className="image-container">
        {product.imageUrl ? (
          <img 
            src={product.imageUrl} 
            alt={product.title}
            className="product-image"
          />
        ) : (
          <div className="image-placeholder">
            <span>No Image</span>
          </div>
        )}
      </div>
      
      <div className="product-info">
        <h3 className="product-title">{product.title}</h3>
        
        {product.description && (
          <p className="product-description">
            {product.description.length > 100 
              ? `${product.description.substring(0, 100)}...`
              : product.description
            }
          </p>
        )}
        
        <div className="product-footer">
          <span className="product-price">{formatPrice(product.price)}</span>
          
          <div className="cart-controls">
            {isInCart(product.id) ? (
              <div className="quantity-info">
                <span className="in-cart">In cart: {getItemQuantity(product.id)}</span>
                <button 
                  className="add-more-btn"
                  onClick={handleAddToCart}
                  disabled={isLoading}
                >
                  {isLoading ? 'Adding...' : 'Add More'}
                </button>
              </div>
            ) : (
              <button 
                className={`add-to-cart-btn ${addedToCart ? 'added' : ''}`}
                onClick={handleAddToCart}
                disabled={isLoading || addedToCart}
              >
                {isLoading ? 'Adding...' : addedToCart ? 'Added!' : 'Add to Cart'}
              </button>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .product-card {
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .product-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
        }

        .image-container {
          position: relative;
          width: 100%;
          height: 200px;
          overflow: hidden;
        }

        .product-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .product-card:hover .product-image {
          transform: scale(1.05);
        }

        .image-placeholder {
          width: 100%;
          height: 100%;
          background: #f8f9fa;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6c757d;
          font-size: 0.9rem;
        }

        .product-info {
          padding: 1.5rem;
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .product-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #2c3e50;
          margin: 0 0 0.75rem 0;
          line-height: 1.3;
        }

        .product-description {
          color: #7f8c8d;
          font-size: 0.9rem;
          line-height: 1.5;
          margin: 0 0 1.5rem 0;
          flex: 1;
        }

        .product-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: auto;
        }

        .product-price {
          font-size: 1.5rem;
          font-weight: 700;
          color: #e74c3c;
        }

        .add-to-cart-btn {
          background: #3498db;
          color: white;
          border: none;
          padding: 0.75rem 1.25rem;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.9rem;
          font-weight: 500;
          transition: all 0.2s ease;
          min-width: 100px;
        }

        .add-to-cart-btn:hover:not(:disabled) {
          background: #2980b9;
          transform: translateY(-1px);
        }

        .add-to-cart-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .add-to-cart-btn.added {
          background: #27ae60;
        }

        .add-to-cart-btn.added:hover {
          background: #27ae60;
        }

        .cart-controls {
          display: flex;
          align-items: center;
        }

        .quantity-info {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          align-items: stretch;
        }

        .in-cart {
          font-size: 0.85rem;
          color: #27ae60;
          font-weight: 500;
          text-align: center;
        }

        .add-more-btn {
          background: #3498db;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.85rem;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .add-more-btn:hover:not(:disabled) {
          background: #2980b9;
        }

        .add-more-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .product-info {
            padding: 1rem;
          }
          
          .product-footer {
            flex-direction: column;
            gap: 1rem;
            align-items: stretch;
          }
          
          .add-to-cart-btn, .add-more-btn {
            width: 100%;
          }

          .cart-controls {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}