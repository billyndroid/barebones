import { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { Button } from '../components/UIComponents';
import { useCart } from '../contexts/CartContext';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl?: string;
}

export default function Wishlist() {
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();

  useEffect(() => {
    fetchWishlistProducts();
  }, []);

  const fetchWishlistProducts = async () => {
    if (typeof window === 'undefined') return;
    
    try {
      const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      if (wishlist.length === 0) {
        setLoading(false);
        return;
      }

      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const response = await fetch(`${API_URL}/api/products`);
      
      if (response.ok) {
        const allProducts = await response.json();
        const wishlistProducts = allProducts.filter((product: Product) => 
          wishlist.includes(product.id)
        );
        setWishlistProducts(wishlistProducts);
      }
    } catch (error) {
      console.error('Failed to fetch wishlist products:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = (productId: string) => {
    if (typeof window === 'undefined') return;
    
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    const newWishlist = wishlist.filter((id: string) => id !== productId);
    localStorage.setItem('wishlist', JSON.stringify(newWishlist));
    
    setWishlistProducts(prev => prev.filter(product => product.id !== productId));
  };

  const addToCart = (product: Product) => {
    addItem({
      id: product.id,
      title: product.title,
      price: product.price,
      imageUrl: product.imageUrl
    });
  };

  const moveAllToCart = () => {
    wishlistProducts.forEach(product => {
      addToCart(product);
    });
    // Clear wishlist after moving all to cart
    localStorage.setItem('wishlist', JSON.stringify([]));
    setWishlistProducts([]);
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="container">
          <div className="loading">Loading your wishlist...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="container">
        <div className="page-header">
          <h1>My Wishlist</h1>
          <p>Save your favorite items for later</p>
          {wishlistProducts.length > 0 && (
            <div className="header-actions">
              <Button variant="primary" onClick={moveAllToCart}>
                Move All to Cart
              </Button>
              <span className="item-count">
                {wishlistProducts.length} item{wishlistProducts.length !== 1 ? 's' : ''}
              </span>
            </div>
          )}
        </div>

        {wishlistProducts.length === 0 ? (
          <div className="empty-wishlist">
            <div className="empty-icon">💝</div>
            <h2>Your wishlist is empty</h2>
            <p>Discover amazing products and save your favorites here</p>
            <Button 
              variant="primary" 
              size="large"
              onClick={() => window.location.href = '/products'}
            >
              Start Shopping
            </Button>
          </div>
        ) : (
          <div className="wishlist-grid">
            {wishlistProducts.map((product) => (
              <div key={product.id} className="wishlist-item">
                <div className="item-image">
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.title} />
                  ) : (
                    <div className="placeholder-image">
                      <span>📦</span>
                    </div>
                  )}
                  <button 
                    className="remove-btn"
                    onClick={() => removeFromWishlist(product.id)}
                    title="Remove from wishlist"
                  >
                    ×\n                  </button>
                </div>
                
                <div className="item-details">
                  <h3 
                    onClick={() => window.location.href = `/product/${product.id}`}
                    className="item-title"
                  >
                    {product.title}
                  </h3>
                  <p className="item-description">{product.description}</p>
                  <div className="item-price">${product.price.toFixed(2)}</div>
                  
                  <div className="item-actions">
                    <Button 
                      variant="primary"
                      onClick={() => addToCart(product)}
                    >
                      Add to Cart
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => window.location.href = `/product/${product.id}`}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            ))}\n          </div>
        )}

        <div className="wishlist-tips">
          <h3>💡 Wishlist Tips</h3>
          <ul>
            <li>Items in your wishlist are saved locally on your device</li>
            <li>Share your wishlist by copying the page URL</li>
            <li>Get notified when wishlist items go on sale (coming soon)</li>
            <li>Move multiple items to cart at once for faster checkout</li>
          </ul>
        </div>
      </div>

      <style jsx>{`
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .loading {
          text-align: center;
          padding: 4rem 2rem;
          font-size: 1.1rem;
          color: #7f8c8d;
        }

        .page-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .page-header h1 {
          font-size: 3rem;
          color: #2c3e50;
          margin-bottom: 0.5rem;
        }

        .page-header p {
          font-size: 1.1rem;
          color: #7f8c8d;
          margin-bottom: 2rem;
        }

        .header-actions {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 2rem;
          flex-wrap: wrap;
        }

        .item-count {
          color: #7f8c8d;
          font-size: 1rem;
        }

        .empty-wishlist {
          text-align: center;
          padding: 4rem 2rem;
        }

        .empty-icon {
          font-size: 4rem;
          margin-bottom: 2rem;
        }

        .empty-wishlist h2 {
          color: #2c3e50;
          margin-bottom: 1rem;
          font-size: 2rem;
        }

        .empty-wishlist p {
          color: #7f8c8d;
          margin-bottom: 2rem;
          font-size: 1.1rem;
        }

        .wishlist-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .wishlist-item {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          border: 1px solid #e9ecef;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .wishlist-item:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }

        .item-image {
          position: relative;
          height: 250px;
        }

        .item-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .placeholder-image {
          width: 100%;
          height: 100%;
          background: #f8f9fa;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 3rem;
          border-bottom: 1px solid #e9ecef;
        }

        .remove-btn {
          position: absolute;
          top: 10px;
          right: 10px;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: rgba(231, 76, 60, 0.9);
          color: white;
          border: none;
          cursor: pointer;
          font-size: 1.2rem;
          font-weight: bold;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s ease;
        }

        .remove-btn:hover {
          background: rgba(231, 76, 60, 1);
        }

        .item-details {
          padding: 1.5rem;
        }

        .item-title {
          color: #2c3e50;
          font-size: 1.25rem;
          margin-bottom: 0.5rem;
          cursor: pointer;
          transition: color 0.2s ease;
        }

        .item-title:hover {
          color: #667eea;
        }

        .item-description {
          color: #7f8c8d;
          font-size: 0.9rem;
          line-height: 1.5;
          margin-bottom: 1rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .item-price {
          font-size: 1.5rem;
          color: #e74c3c;
          font-weight: 700;
          margin-bottom: 1.5rem;
        }

        .item-actions {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .item-actions :global(.btn) {
          flex: 1;
          min-width: 120px;
        }

        .wishlist-tips {
          background: #f8f9fa;
          padding: 2rem;
          border-radius: 16px;
          margin-top: 3rem;
        }

        .wishlist-tips h3 {
          color: #2c3e50;
          margin-bottom: 1rem;
          font-size: 1.25rem;
        }

        .wishlist-tips ul {
          list-style: none;
          padding: 0;
        }

        .wishlist-tips li {
          color: #5a6c7d;
          margin-bottom: 0.75rem;
          padding-left: 1.5rem;
          position: relative;
        }

        .wishlist-tips li:before {
          content: '•';
          color: #667eea;
          font-weight: bold;
          position: absolute;
          left: 0;
        }

        @media (max-width: 768px) {
          .container {
            padding: 1rem;
          }

          .page-header h1 {
            font-size: 2.5rem;
          }

          .header-actions {
            flex-direction: column;
            gap: 1rem;
          }

          .wishlist-grid {
            grid-template-columns: 1fr;
          }

          .item-actions {
            flex-direction: column;
          }

          .item-actions :global(.btn) {
            min-width: auto;
          }
        }
      `}</style>
    </>
  );
}