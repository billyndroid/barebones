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
        {/* Add best seller badge for demonstration */}
        {product.price > 50 && (
          <div className="best-seller-badge">BEST SELLER</div>
        )}
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
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 20px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          height: 100%;
          display: flex;
          flex-direction: column;
          position: relative;
        }

        .product-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #F0386B, #FE654F, #F8C0C8);
          transform: scaleX(0);
          transition: transform 0.3s ease;
        }

        .product-card:hover {
          transform: translateY(-12px) scale(1.02);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }

        .product-card:hover::before {
          transform: scaleX(1);
        }

        .image-container {
          position: relative;
          width: 100%;
          height: 240px;
          overflow: hidden;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
        }

        .best-seller-badge {
          position: absolute;
          top: 10px;
          right: 10px;
          background: linear-gradient(135deg, #F0386B 0%, #FE654F 100%);
          color: white;
          font-family: 'Bebas Neue', cursive;
          font-size: 0.8rem;
          font-weight: 400;
          letter-spacing: 1px;
          padding: 4px 12px;
          border-radius: 15px;
          z-index: 2;
          transform: rotate(15deg);
          box-shadow: 0 2px 8px rgba(240, 56, 107, 0.3);
          animation: badgePulse 3s ease-in-out infinite;
        }

        @keyframes badgePulse {
          0%, 100% { transform: rotate(15deg) scale(1); }
          50% { transform: rotate(15deg) scale(1.05); }
        }

        .image-container::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%);
          transform: translateX(-100%);
          transition: transform 0.6s ease;
        }

        .product-card:hover .image-container::after {
          transform: translateX(100%);
        }

        .product-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: all 0.4s ease;
        }

        .product-card:hover .product-image {
          transform: scale(1.05);
        }

        .image-placeholder {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #64748b;
          font-size: 1rem;
          font-weight: 500;
          font-family: 'Roboto', sans-serif;
        }

        .product-info {
          padding: 2rem 1.5rem 1.5rem;
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .product-title {
          font-family: 'Montserrat', sans-serif;
          font-size: 1.3rem;
          font-weight: 600;
          color: #3F334D;
          margin: 0 0 1rem 0;
          line-height: 1.4;
          transition: color 0.3s ease;
        }

        .product-card:hover .product-title {
          color: #F0386B;
        }

        .product-description {
          color: #64748b;
          font-size: 0.95rem;
          line-height: 1.6;
          margin: 0 0 1.5rem 0;
          flex: 1;
          font-weight: 400;
        }

        .product-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: auto;
          padding-top: 1rem;
          border-top: 1px solid rgba(0, 0, 0, 0.05);
        }

        .product-price {
          font-family: 'Bebas Neue', cursive;
          font-size: 1.6rem;
          font-weight: 400;
          letter-spacing: 1px;
          background: linear-gradient(135deg, #F0386B 0%, #FE654F 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .add-to-cart-btn {
          background: linear-gradient(135deg, #F0386B 0%, #FE654F 100%);
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 12px;
          cursor: pointer;
          font-size: 0.9rem;
          font-weight: 500;
          font-family: 'Roboto', sans-serif;
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          min-width: 120px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 4px 14px rgba(240, 56, 107, 0.4);
        }

        .add-to-cart-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s ease;
        }

        .add-to-cart-btn:hover::before {
          left: 100%;
        }

        .add-to-cart-btn:hover:not(:disabled) {
          background: linear-gradient(135deg, #e02d5f 0%, #fe4a3b 100%);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(240, 56, 107, 0.6);
        }

        .add-to-cart-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .add-to-cart-btn.added {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          box-shadow: 0 4px 14px rgba(16, 185, 129, 0.3);
        }

        .add-to-cart-btn.added:hover {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);
        }

        .cart-controls {
          display: flex;
          align-items: center;
        }

        .quantity-info {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          align-items: stretch;
        }

        .in-cart {
          font-size: 0.9rem;
          color: #F0386B;
          font-weight: 600;
          font-family: 'Roboto', sans-serif;
          text-align: center;
          padding: 0.25rem 0.75rem;
          background: rgba(240, 56, 107, 0.1);
          border-radius: 8px;
        }

        .add-more-btn {
          background: linear-gradient(135deg, #FE654F 0%, #F8C0C8 100%);
          color: white;
          border: none;
          padding: 0.6rem 1.2rem;
          border-radius: 10px;
          cursor: pointer;
          font-size: 0.85rem;
          font-weight: 500;
          font-family: 'Roboto', sans-serif;
          transition: all 0.3s ease;
          box-shadow: 0 4px 14px rgba(254, 101, 79, 0.3);
        }

        .add-more-btn:hover:not(:disabled) {
          background: linear-gradient(135deg, #fe4a3b 0%, #f5adb9 100%);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(254, 101, 79, 0.5);
        }

        .add-more-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .product-info {
            padding: 1.5rem 1rem 1rem;
          }

          .product-title {
            font-size: 1.2rem;
          }

          .product-price {
            font-size: 1.3rem;
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

          .image-container {
            height: 200px;
          }
        }
      `}</style>
    </div>
  );
}