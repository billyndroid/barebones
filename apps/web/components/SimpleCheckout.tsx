import React, { useState } from 'react';

interface SimpleCheckoutProps {
  items: Array<{ id: string; quantity: number; price: number }>;
  onSuccess: () => void;
  onCancel: () => void;
}

export function SimpleCheckout({ items, onSuccess, onCancel }: SimpleCheckoutProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsProcessing(true);

    try {
      // For now, simulate the existing checkout flow
      // This will be replaced with real Stripe integration
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      
      const checkoutData = {
        items: items,
        customerInfo: {
          email: 'demo@example.com',
          name: 'Demo User'
        }
      };

      const response = await fetch(`${API_URL}/api/checkout/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(checkoutData)
      });

      if (!response.ok) {
        throw new Error('Checkout failed');
      }

      const result = await response.json();
      
      // Complete the order
      const completeResponse = await fetch(`${API_URL}/api/checkout/complete/${result.orderId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ paymentMethod: 'demo' })
      });

      if (completeResponse.ok) {
        onSuccess();
      } else {
        throw new Error('Failed to complete order');
      }
    } catch (error) {
      console.error('Checkout failed:', error);
      alert('Checkout failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <div className="checkout-container">
        <form onSubmit={handleSubmit} className="checkout-form">
          <h3>Checkout</h3>
          
          <div className="items-summary">
            <h4>Order Summary</h4>
            {items.map((item, index) => (
              <div key={index} className="item-row">
                <span>Item {index + 1}</span>
                <span>{item.quantity}x {formatPrice(item.price)}</span>
              </div>
            ))}
            <div className="total-row">
              <strong>Total: {formatPrice(total)}</strong>
            </div>
          </div>

          <div className="customer-info">
            <h4>Customer Information</h4>
            <div className="form-group">
              <label>Email</label>
              <input type="email" defaultValue="demo@example.com" disabled />
            </div>
            <div className="form-group">
              <label>Name</label>
              <input type="text" defaultValue="Demo User" disabled />
            </div>
          </div>

          <div className="payment-note">
            <p><strong>Note:</strong> This is a demo checkout. No real payment will be processed.</p>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onCancel} disabled={isProcessing}>
              Cancel
            </button>
            <button type="submit" disabled={isProcessing}>
              {isProcessing ? 'Processing...' : `Place Order ${formatPrice(total)}`}
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .checkout-container {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .checkout-form {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          max-width: 500px;
          width: 90%;
          max-height: 90vh;
          overflow-y: auto;
        }

        .checkout-form h3 {
          margin: 0 0 1.5rem 0;
          color: #2c3e50;
          font-size: 1.5rem;
        }

        .items-summary, .customer-info {
          margin-bottom: 1.5rem;
          padding: 1rem;
          background: #f8f9fa;
          border-radius: 8px;
        }

        .items-summary h4, .customer-info h4 {
          margin: 0 0 1rem 0;
          color: #2c3e50;
        }

        .item-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5rem;
        }

        .total-row {
          display: flex;
          justify-content: space-between;
          padding-top: 0.5rem;
          border-top: 1px solid #dee2e6;
          margin-top: 0.5rem;
          font-size: 1.1rem;
        }

        .form-group {
          margin-bottom: 1rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: #2c3e50;
        }

        .form-group input {
          width: 100%;
          padding: 0.75rem;
          border: 2px solid #e1e5e9;
          border-radius: 6px;
          font-size: 1rem;
          background: #f8f9fa;
        }

        .payment-note {
          padding: 1rem;
          background: #fff3cd;
          border: 1px solid #ffeaa7;
          border-radius: 8px;
          margin-bottom: 1.5rem;
        }

        .payment-note p {
          margin: 0;
          color: #856404;
        }

        .form-actions {
          display: flex;
          gap: 1rem;
        }

        .form-actions button {
          flex: 1;
          padding: 0.875rem 1.5rem;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .form-actions button[type="button"] {
          background: #ecf0f1;
          color: #2c3e50;
        }

        .form-actions button[type="button"]:hover:not(:disabled) {
          background: #bdc3c7;
        }

        .form-actions button[type="submit"] {
          background: #27ae60;
          color: white;
        }

        .form-actions button[type="submit"]:hover:not(:disabled) {
          background: #219a52;
        }

        .form-actions button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .checkout-form {
            margin: 1rem;
            padding: 1.5rem;
          }

          .form-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </>
  );
}