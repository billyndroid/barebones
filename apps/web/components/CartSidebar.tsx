import { useCart } from '../contexts/CartContext';
import { useToast } from '../contexts/ToastContext';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';
import { SimpleCheckout } from './SimpleCheckout';

export function CartSidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { state, updateQuantity, removeItem, clearCart } = useCart();
  const { showSuccess, showError } = useToast();
  const { user, token } = useAuth();
  const [showCheckout, setShowCheckout] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const handleCheckout = () => {
    setShowCheckout(true);
  };

  const handleCheckoutSuccess = () => {
    showSuccess('Order completed successfully!');
    clearCart();
    setShowCheckout(false);
    onClose();
  };

  const handleCheckoutCancel = () => {
    setShowCheckout(false);
  };

  return (
    <>
      <div className={`cart-overlay ${isOpen ? 'open' : ''}`} onClick={onClose} />
      <div className={`cart-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <h2>Shopping Cart ({state.itemCount})</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="cart-content">
          {state.items.length === 0 ? (
            <div className="empty-cart">
              <p>Your cart is empty</p>
              <button className="continue-shopping" onClick={onClose}>
                Continue Shopping
              </button>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {state.items.map((item) => (
                  <div key={item.id} className="cart-item">
                    <div className="item-image">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.title} />
                      ) : (
                        <div className="placeholder">No Image</div>
                      )}
                    </div>
                    
                    <div className="item-details">
                      <h4>{item.title}</h4>
                      <p className="item-price">{formatPrice(item.price)}</p>
                      
                      <div className="quantity-controls">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                          +
                        </button>
                      </div>
                    </div>
                    
                    <div className="item-actions">
                      <p className="item-total">{formatPrice(item.price * item.quantity)}</p>
                      <button 
                        className="remove-btn" 
                        onClick={() => removeItem(item.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="cart-footer">
                <div className="cart-total">
                  <strong>Total: {formatPrice(state.total)}</strong>
                </div>
                
                <div className="cart-actions">
                  <button 
                    className="clear-cart" 
                    onClick={clearCart}
                  >
                    Clear Cart
                  </button>
                  <button 
                    className="checkout-btn" 
                    onClick={handleCheckout}
                  >
                    Checkout
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        <style jsx>{`
          .cart-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            z-index: 999;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
          }

          .cart-overlay.open {
            opacity: 1;
            visibility: visible;
          }

          .cart-sidebar {
            position: fixed;
            top: 0;
            right: 0;
            height: 100vh;
            width: 400px;
            max-width: 90vw;
            background: white;
            z-index: 1000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            display: flex;
            flex-direction: column;
            box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
          }

          .cart-sidebar.open {
            transform: translateX(0);
          }

          .cart-header {
            padding: 1.5rem;
            border-bottom: 1px solid #eee;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .cart-header h2 {
            margin: 0;
            font-size: 1.25rem;
            color: #2c3e50;
          }

          .close-btn {
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: #7f8c8d;
            padding: 0;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .close-btn:hover {
            color: #2c3e50;
          }

          .cart-content {
            flex: 1;
            display: flex;
            flex-direction: column;
            overflow: hidden;
          }

          .empty-cart {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 2rem;
            text-align: center;
          }

          .empty-cart p {
            color: #7f8c8d;
            font-size: 1.1rem;
            margin-bottom: 1.5rem;
          }

          .continue-shopping {
            background: #3498db;
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 6px;
            cursor: pointer;
            font-size: 1rem;
          }

          .continue-shopping:hover {
            background: #2980b9;
          }

          .cart-items {
            flex: 1;
            overflow-y: auto;
            padding: 1rem;
          }

          .cart-item {
            display: flex;
            gap: 1rem;
            padding: 1rem 0;
            border-bottom: 1px solid #eee;
          }

          .cart-item:last-child {
            border-bottom: none;
          }

          .item-image {
            width: 60px;
            height: 60px;
            flex-shrink: 0;
          }

          .item-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 4px;
          }

          .placeholder {
            width: 100%;
            height: 100%;
            background: #f8f9fa;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.7rem;
            color: #6c757d;
            border-radius: 4px;
          }

          .item-details {
            flex: 1;
          }

          .item-details h4 {
            margin: 0 0 0.5rem 0;
            font-size: 0.9rem;
            line-height: 1.3;
          }

          .item-price {
            color: #e74c3c;
            font-weight: 600;
            margin: 0 0 0.75rem 0;
          }

          .quantity-controls {
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }

          .quantity-controls button {
            background: #ecf0f1;
            border: none;
            width: 24px;
            height: 24px;
            border-radius: 4px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.9rem;
          }

          .quantity-controls button:hover:not(:disabled) {
            background: #bdc3c7;
          }

          .quantity-controls button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }

          .quantity-controls span {
            min-width: 20px;
            text-align: center;
            font-size: 0.9rem;
          }

          .item-actions {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            gap: 0.5rem;
          }

          .item-total {
            font-weight: 600;
            margin: 0;
          }

          .remove-btn {
            background: none;
            border: none;
            color: #e74c3c;
            cursor: pointer;
            font-size: 0.8rem;
            text-decoration: underline;
          }

          .remove-btn:hover {
            color: #c0392b;
          }

          .cart-footer {
            border-top: 1px solid #eee;
            padding: 1.5rem;
          }

          .cart-total {
            text-align: center;
            margin-bottom: 1rem;
            font-size: 1.1rem;
          }

          .cart-actions {
            display: flex;
            gap: 1rem;
          }

          .clear-cart, .checkout-btn {
            flex: 1;
            padding: 0.75rem;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 1rem;
          }

          .clear-cart {
            background: #ecf0f1;
            color: #2c3e50;
          }

          .clear-cart:hover:not(:disabled) {
            background: #bdc3c7;
          }

          .checkout-btn {
            background: #27ae60;
            color: white;
          }

          .checkout-btn:hover:not(:disabled) {
            background: #229954;
          }

          .checkout-btn:disabled, .clear-cart:disabled {
            opacity: 0.7;
            cursor: not-allowed;
          }

          @media (max-width: 768px) {
            .cart-sidebar {
              width: 100vw;
            }
          }
        `}</style>
      </div>

      {showCheckout && (
        <SimpleCheckout
          items={state.items.map(item => ({
            id: item.id,
            quantity: item.quantity,
            price: item.price
          }))}
          onSuccess={handleCheckoutSuccess}
          onCancel={handleCheckoutCancel}
        />
      )}
    </>
  );
}