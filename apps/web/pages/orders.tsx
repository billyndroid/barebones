import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { Header } from '../components/Header';

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: {
    id: string;
    title: string;
    imageUrl?: string;
  };
}

interface Order {
  id: string;
  total: number;
  status: string;
  createdAt: string;
  orderItems: OrderItem[];
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, token, isAuthenticated } = useAuth();
  const { showError } = useToast();

  useEffect(() => {
    if (isAuthenticated && token) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, token]);

  const fetchOrders = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const response = await fetch(`${API_URL}/api/orders`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      showError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

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
    switch (status.toLowerCase()) {
      case 'pending': return '#f39c12';
      case 'confirmed': return '#3498db';
      case 'shipped': return '#9b59b6';
      case 'delivered': return '#27ae60';
      case 'cancelled': return '#e74c3c';
      case 'completed': return '#27ae60';
      default: return '#95a5a6';
    }
  };

  if (!isAuthenticated) {
    return (
      <>
        <Header />
        <div className="container">
          <div className="auth-required">
            <h2>Authentication Required</h2>
            <p>Please log in to view your order history.</p>
          </div>
        </div>

        <style jsx>{`
          .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
            min-height: 400px;
          }

          .auth-required {
            text-align: center;
            padding: 4rem 2rem;
            background: #f8f9fa;
            border-radius: 8px;
          }

          .auth-required h2 {
            color: #2c3e50;
            margin-bottom: 1rem;
          }

          .auth-required p {
            color: #7f8c8d;
            font-size: 1.1rem;
          }
        `}</style>
      </>
    );
  }

  if (loading) {
    return (
      <>
        <Header />
        <div className="container">
          <div className="loading">Loading your orders...</div>
        </div>

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
            padding: 4rem 0;
          }
        `}</style>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="container">
        <div className="page-header">
          <h1>Your Orders</h1>
          <p>Track and manage your order history</p>
        </div>

        {orders.length === 0 ? (
          <div className="empty-orders">
            <h3>No orders yet</h3>
            <p>When you place orders, they'll appear here.</p>
            <a href="/" className="shop-now-btn">Start Shopping</a>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <div className="order-info">
                    <h3>Order #{order.id.slice(-8)}</h3>
                    <p className="order-date">{formatDate(order.createdAt)}</p>
                  </div>
                  <div className="order-status">
                    <span 
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(order.status) }}
                    >
                      {order.status}
                    </span>
                    <p className="order-total">{formatPrice(order.total)}</p>
                  </div>
                </div>

                <div className="order-items">
                  {order.orderItems.map((item) => (
                    <div key={item.id} className="order-item">
                      <div className="item-image">
                        {item.product.imageUrl ? (
                          <img src={item.product.imageUrl} alt={item.product.title} />
                        ) : (
                          <div className="placeholder">No Image</div>
                        )}
                      </div>
                      <div className="item-details">
                        <h4>{item.product.title}</h4>
                        <p>Quantity: {item.quantity}</p>
                        <p className="item-price">{formatPrice(item.price)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
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

        .page-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .page-header h1 {
          font-size: 2.5rem;
          color: #2c3e50;
          margin-bottom: 0.5rem;
        }

        .page-header p {
          font-size: 1.1rem;
          color: #7f8c8d;
        }

        .empty-orders {
          text-align: center;
          padding: 4rem 2rem;
          background: #f8f9fa;
          border-radius: 8px;
        }

        .empty-orders h3 {
          color: #2c3e50;
          margin-bottom: 1rem;
        }

        .empty-orders p {
          color: #7f8c8d;
          margin-bottom: 2rem;
        }

        .shop-now-btn {
          background: #3498db;
          color: white;
          text-decoration: none;
          padding: 0.75rem 1.5rem;
          border-radius: 6px;
          display: inline-block;
          transition: background-color 0.2s ease;
        }

        .shop-now-btn:hover {
          background: #2980b9;
        }

        .orders-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .order-card {
          background: white;
          border: 1px solid #eee;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        .order-header {
          background: #f8f9fa;
          padding: 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-bottom: 1px solid #eee;
        }

        .order-info h3 {
          margin: 0 0 0.5rem 0;
          color: #2c3e50;
          font-size: 1.25rem;
        }

        .order-date {
          margin: 0;
          color: #7f8c8d;
          font-size: 0.9rem;
        }

        .order-status {
          text-align: right;
        }

        .status-badge {
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
          display: inline-block;
          margin-bottom: 0.5rem;
        }

        .order-total {
          margin: 0;
          font-size: 1.25rem;
          font-weight: 700;
          color: #2c3e50;
        }

        .order-items {
          padding: 1.5rem;
        }

        .order-item {
          display: flex;
          gap: 1rem;
          padding: 1rem 0;
          border-bottom: 1px solid #f0f0f0;
        }

        .order-item:last-child {
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

        .item-details h4 {
          margin: 0 0 0.5rem 0;
          color: #2c3e50;
          font-size: 1rem;
        }

        .item-details p {
          margin: 0.25rem 0;
          color: #7f8c8d;
          font-size: 0.9rem;
        }

        .item-price {
          font-weight: 600;
          color: #e74c3c !important;
        }

        @media (max-width: 768px) {
          .container {
            padding: 1rem;
          }

          .page-header h1 {
            font-size: 2rem;
          }

          .order-header {
            flex-direction: column;
            gap: 1rem;
          }

          .order-status {
            text-align: left;
          }

          .order-item {
            flex-direction: column;
            align-items: flex-start;
          }

          .item-image {
            width: 80px;
            height: 80px;
          }
        }
      `}</style>
    </>
  );
}