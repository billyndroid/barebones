import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Header } from '../../components/Header';
import { Button } from '../../components/UIComponents';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl?: string;
  shopifyId: string;
}

export default function ProductDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { addToCart } = useCart();
  const { user } = useAuth();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (id) {
      fetchProduct();
      fetchRelatedProducts();
      checkWishlistStatus();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const response = await fetch(`${API_URL}/api/products/${id}`);
      if (!response.ok) {
        throw new Error('Product not found');
      }
      const data = await response.json();
      setProduct(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedProducts = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const response = await fetch(`${API_URL}/api/products`);
      if (response.ok) {
        const data = await response.json();
        // Get random 4 products excluding current one
        const filtered = data.filter((p: Product) => p.id !== id);
        const shuffled = filtered.sort(() => 0.5 - Math.random());
        setRelatedProducts(shuffled.slice(0, 4));
      }
    } catch (err) {
      console.error('Failed to fetch related products:', err);
    }
  };

  const checkWishlistStatus = () => {
    if (typeof window !== 'undefined') {
      const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      setIsWishlisted(wishlist.includes(id));
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    
    setAddingToCart(true);
    try {
      await addToCart({
        id: product.id,
        title: product.title,
        price: product.price,
        imageUrl: product.imageUrl
      }, quantity);
      
      // Show success message or redirect
      alert('Product added to cart successfully!');
    } catch (err) {
      alert('Failed to add product to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const toggleWishlist = () => {
    if (typeof window !== 'undefined') {
      const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      let newWishlist;
      
      if (isWishlisted) {
        newWishlist = wishlist.filter((productId: string) => productId !== id);
      } else {
        newWishlist = [...wishlist, id];
      }
      
      localStorage.setItem('wishlist', JSON.stringify(newWishlist));
      setIsWishlisted(!isWishlisted);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="container">
          <div className="loading">Loading product...</div>
        </div>
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <Header />
        <div className="container">
          <div className="error">
            <h2>Product Not Found</h2>
            <p>{error || 'The product you are looking for does not exist.'}</p>
            <Button onClick={() => router.push('/products')}>
              Back to Products
            </Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="container">
        <nav className="breadcrumb">
          <span onClick={() => router.push('/')}>Home</span>
          <span> / </span>
          <span onClick={() => router.push('/products')}>Products</span>
          <span> / </span>
          <span>{product.title}</span>
        </nav>

        <div className="product-detail">
          <div className="product-image">
            {product.imageUrl ? (
              <img src={product.imageUrl} alt={product.title} />
            ) : (
              <div className="placeholder-image">
                <span>📦</span>
                <p>No image available</p>
              </div>
            )}
          </div>

          <div className="product-info">
            <h1>{product.title}</h1>
            <div className="price">${product.price.toFixed(2)}</div>
            
            <div className="product-description">
              <h3>Description</h3>
              <p>{product.description}</p>
            </div>

            <div className="product-actions">
              <div className="quantity-selector">
                <label>Quantity:</label>
                <div className="quantity-controls">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span>{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)}>
                    +
                  </button>
                </div>
              </div>

              <div className="action-buttons">
                <Button
                  variant="primary"
                  size="large"
                  onClick={handleAddToCart}
                  disabled={addingToCart}
                >
                  {addingToCart ? 'Adding...' : `Add to Cart - $${(product.price * quantity).toFixed(2)}`}
                </Button>
                
                <button 
                  className={`wishlist-btn ${isWishlisted ? 'wishlisted' : ''}`}
                  onClick={toggleWishlist}
                  title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                >
                  {isWishlisted ? '❤️' : '🤍'}
                </button>
              </div>
            </div>

            <div className="product-features">
              <h3>Features</h3>
              <ul>
                <li>✅ Free shipping on orders over $50</li>
                <li>✅ 30-day return guarantee</li>
                <li>✅ 1-year warranty included</li>
                <li>✅ 24/7 customer support</li>
              </ul>
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="related-products">
            <h2>Related Products</h2>
            <div className="related-grid">
              {relatedProducts.map((relatedProduct) => (
                <div 
                  key={relatedProduct.id} 
                  className="related-item"
                  onClick={() => router.push(`/product/${relatedProduct.id}`)}
                >
                  {relatedProduct.imageUrl ? (
                    <img src={relatedProduct.imageUrl} alt={relatedProduct.title} />
                  ) : (
                    <div className="placeholder-small">📦</div>
                  )}
                  <h4>{relatedProduct.title}</h4>
                  <p className="related-price">${relatedProduct.price.toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .loading, .error {
          text-align: center;
          padding: 4rem 2rem;
        }

        .error h2 {
          color: #e74c3c;
          margin-bottom: 1rem;
        }

        .breadcrumb {
          margin-bottom: 2rem;
          font-size: 0.9rem;
          color: #7f8c8d;
        }

        .breadcrumb span {
          cursor: pointer;
        }

        .breadcrumb span:hover:not(:last-child) {
          color: #2c3e50;
          text-decoration: underline;
        }

        .breadcrumb span:last-child {
          color: #2c3e50;
          font-weight: 600;
        }

        .product-detail {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          margin-bottom: 4rem;
        }

        .product-image {
          position: relative;
        }

        .product-image img {
          width: 100%;
          height: 500px;
          object-fit: cover;
          border-radius: 12px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }

        .placeholder-image {
          width: 100%;
          height: 500px;
          background: #f8f9fa;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border: 2px dashed #dee2e6;
        }

        .placeholder-image span {
          font-size: 4rem;
          margin-bottom: 1rem;
        }

        .placeholder-image p {
          color: #6c757d;
          font-style: italic;
        }

        .product-info h1 {
          font-size: 2.5rem;
          color: #2c3e50;
          margin-bottom: 1rem;
        }

        .price {
          font-size: 2rem;
          color: #e74c3c;
          font-weight: 700;
          margin-bottom: 2rem;
        }

        .product-description,
        .product-features {
          margin-bottom: 2rem;
        }

        .product-description h3,
        .product-features h3 {
          color: #2c3e50;
          margin-bottom: 1rem;
          font-size: 1.25rem;
        }

        .product-description p {
          color: #5a6c7d;
          line-height: 1.8;
          font-size: 1.1rem;
        }

        .product-features ul {
          list-style: none;
          padding: 0;
        }

        .product-features li {
          color: #5a6c7d;
          margin-bottom: 0.5rem;
          font-size: 1rem;
        }

        .quantity-selector {
          margin-bottom: 2rem;
        }

        .quantity-selector label {
          display: block;
          margin-bottom: 0.5rem;
          color: #2c3e50;
          font-weight: 600;
        }

        .quantity-controls {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .quantity-controls button {
          width: 40px;
          height: 40px;
          border: 2px solid #e9ecef;
          background: white;
          border-radius: 8px;
          cursor: pointer;
          font-size: 1.2rem;
          font-weight: 600;
          transition: all 0.2s ease;
        }

        .quantity-controls button:hover:not(:disabled) {
          border-color: #667eea;
          background: #667eea;
          color: white;
        }

        .quantity-controls button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .quantity-controls span {
          font-size: 1.2rem;
          font-weight: 600;
          color: #2c3e50;
          min-width: 30px;
          text-align: center;
        }

        .action-buttons {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .wishlist-btn {
          width: 50px;
          height: 50px;
          border: 2px solid #e9ecef;
          background: white;
          border-radius: 50%;
          cursor: pointer;
          font-size: 1.5rem;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .wishlist-btn:hover {
          border-color: #e74c3c;
          transform: scale(1.1);
        }

        .wishlist-btn.wishlisted {
          border-color: #e74c3c;
          background: #fef2f2;
        }

        .related-products {
          margin-top: 4rem;
        }

        .related-products h2 {
          font-size: 2rem;
          color: #2c3e50;
          margin-bottom: 2rem;
          text-align: center;
        }

        .related-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 2rem;
        }

        .related-item {
          cursor: pointer;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          background: white;
        }

        .related-item:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }

        .related-item img {
          width: 100%;
          height: 200px;
          object-fit: cover;
        }

        .placeholder-small {
          width: 100%;
          height: 200px;
          background: #f8f9fa;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 3rem;
          border-bottom: 1px solid #e9ecef;
        }

        .related-item h4 {
          padding: 1rem 1rem 0.5rem;
          color: #2c3e50;
          font-size: 1rem;
          margin: 0;
        }

        .related-price {
          padding: 0 1rem 1rem;
          color: #e74c3c;
          font-weight: 600;
          margin: 0;
        }

        @media (max-width: 768px) {
          .container {
            padding: 1rem;
          }

          .product-detail {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .product-info h1 {
            font-size: 2rem;
          }

          .price {
            font-size: 1.75rem;
          }

          .action-buttons {
            flex-direction: column;
            align-items: stretch;
          }

          .wishlist-btn {
            align-self: center;
          }

          .related-grid {
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          }
        }
      `}</style>
    </>
  );
}