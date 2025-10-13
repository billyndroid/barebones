import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { Header } from '../components/Header';
import { OrderCard } from '../components/OrderCard';
import { Button } from '../components/UIComponents';

interface OrderItem {
  id: string;
  title: string;
  quantity: number;
  price: number;
  imageUrl?: string;
}

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  items: OrderItem[];
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, token, isAuthenticated } = useAuth();
  const { showError, showInfo } = useToast();

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

      const rawData = await response.json();
      
      // Transform the data to match OrderCard interface
      const transformedOrders = rawData.map((order: any) => ({
        id: order.id,
        orderNumber: order.id.slice(-8),
        date: order.createdAt,
        status: order.status.toLowerCase(),
        total: order.total,
        items: order.orderItems?.map((item: any) => ({
          id: item.id,
          title: item.product.title,
          quantity: item.quantity,
          price: item.price,
          imageUrl: item.product.imageUrl
        })) || []
      }));
      
      setOrders(transformedOrders);
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

  const handleViewDetails = (orderId: string) => {
    // Navigate to order details page or show details modal
    console.log('Viewing details for order:', orderId);
    showInfo('Order details functionality coming soon!');
  };

  const handleTrackOrder = (orderId: string) => {
    // Navigate to order tracking page or show tracking info
    console.log('Tracking order:', orderId);
    showInfo('Order tracking functionality coming soon!');
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
            <Button 
              variant="primary"
              onClick={() => window.location.href = '/products'}
            >
              Start Shopping
            </Button>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <OrderCard 
                key={order.id} 
                order={order}
                onViewDetails={handleViewDetails}
                onTrackOrder={handleTrackOrder}
              />
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

        .orders-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        @media (max-width: 768px) {
          .container {
            padding: 1rem;
          }

          .page-header h1 {
            font-size: 2rem;
          }
        }
      `}</style>
    </>
  );
}