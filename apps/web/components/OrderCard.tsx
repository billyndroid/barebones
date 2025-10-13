import { useState } from 'react';
import { Button } from './UIComponents';

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  items: OrderItem[];
}

interface OrderItem {
  id: string;
  title: string;
  quantity: number;
  price: number;
  imageUrl?: string;
}

interface OrderCardProps {
  order: Order;
  onViewDetails?: (orderId: string) => void;
  onTrackOrder?: (orderId: string) => void;
}

export function OrderCard({ order, onViewDetails, onTrackOrder }: OrderCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return '#f39c12';
      case 'processing':
        return '#3498db';
      case 'shipped':
        return '#9b59b6';
      case 'delivered':
        return '#27ae60';
      case 'cancelled':
        return '#e74c3c';
      default:
        return '#95a5a6';
    }
  };

  const getStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className="order-card">
      <div className="order-header">
        <div className="order-info">
          <h3 className="order-number">Order #{order.orderNumber}</h3>
          <p className="order-date">Placed on {formatDate(order.date)}</p>
        </div>
        
        <div className="order-status-section">
          <span className="order-status" style={{ backgroundColor: getStatusColor(order.status) }}>
            {getStatusText(order.status)}
          </span>
          <span className="order-total">{formatPrice(order.total)}</span>
        </div>
      </div>

      <div className="order-summary">
        <div className="items-preview">
          {order.items.slice(0, 3).map((item, index) => (
            <div key={item.id} className="item-preview">
              {item.imageUrl ? (
                <img src={item.imageUrl} alt={item.title} className="item-image" />
              ) : (
                <div className="item-placeholder">
                  <span>{item.title.charAt(0)}</span>
                </div>
              )}
            </div>
          ))}
          {order.items.length > 3 && (
            <div className="more-items">
              +{order.items.length - 3}
            </div>
          )}
        </div>
        
        <div className="order-actions">
          <Button
            variant="outline"
            size="small"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Hide Details' : 'View Details'}
          </Button>
          
          {onTrackOrder && order.status !== 'delivered' && order.status !== 'cancelled' && (
            <Button
              variant="primary"
              size="small"
              onClick={() => onTrackOrder(order.id)}
            >
              Track Order
            </Button>
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="order-details">
          <div className="items-list">
            <h4>Items ({order.items.length})</h4>
            {order.items.map((item) => (
              <div key={item.id} className="order-item">
                <div className="item-info">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.title} className="item-detail-image" />
                  ) : (
                    <div className="item-detail-placeholder">
                      <span>{item.title.charAt(0)}</span>
                    </div>
                  )}
                  <div className="item-details">
                    <h5 className="item-title">{item.title}</h5>
                    <p className="item-quantity">Quantity: {item.quantity}</p>
                  </div>
                </div>
                <div className="item-price">
                  {formatPrice(item.price * item.quantity)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <style jsx>{`
        .order-card {
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          padding: 1.5rem;
          margin-bottom: 1rem;
          transition: box-shadow 0.2s ease;
        }

        .order-card:hover {
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
        }

        .order-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #e1e8ed;
        }

        .order-info h3 {
          margin: 0 0 0.5rem 0;
          color: #2c3e50;
          font-size: 1.1rem;
        }

        .order-info p {
          margin: 0;
          color: #7f8c8d;
          font-size: 0.9rem;
        }

        .order-status-section {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.5rem;
        }

        .order-status {
          padding: 0.4rem 0.8rem;
          border-radius: 12px;
          color: white;
          font-size: 0.8rem;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .order-total {
          font-size: 1.2rem;
          font-weight: 700;
          color: #2c3e50;
        }

        .order-summary {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
        }

        .items-preview {
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }

        .item-preview {
          width: 40px;
          height: 40px;
          border-radius: 6px;
          overflow: hidden;
          background: #f8f9fa;
        }

        .item-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .item-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #e9ecef;
          color: #6c757d;
          font-weight: 600;
          font-size: 0.8rem;
        }

        .more-items {
          background: #6c757d;
          color: white;
          width: 40px;
          height: 40px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .order-actions {
          display: flex;
          gap: 0.75rem;
        }

        .order-details {
          margin-top: 1.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid #e1e8ed;
        }

        .items-list h4 {
          margin: 0 0 1rem 0;
          color: #2c3e50;
          font-size: 1rem;
        }

        .order-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 0;
          border-bottom: 1px solid #f8f9fa;
        }

        .order-item:last-child {
          border-bottom: none;
        }

        .item-info {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .item-detail-image {
          width: 50px;
          height: 50px;
          object-fit: cover;
          border-radius: 6px;
        }

        .item-detail-placeholder {
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #e9ecef;
          color: #6c757d;
          font-weight: 600;
          border-radius: 6px;
        }

        .item-details h5 {
          margin: 0 0 0.25rem 0;
          color: #2c3e50;
          font-size: 0.95rem;
        }

        .item-details p {
          margin: 0;
          color: #7f8c8d;
          font-size: 0.85rem;
        }

        .item-price {
          font-weight: 600;
          color: #2c3e50;
        }

        @media (max-width: 768px) {
          .order-card {
            padding: 1rem;
          }

          .order-header {
            flex-direction: column;
            gap: 1rem;
            align-items: stretch;
          }

          .order-status-section {
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
          }

          .order-summary {
            flex-direction: column;
            gap: 1rem;
            align-items: stretch;
          }

          .order-actions {
            justify-content: center;
          }

          .order-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }

          .item-price {
            align-self: flex-end;
          }
        }
      `}</style>
    </div>
  );
}