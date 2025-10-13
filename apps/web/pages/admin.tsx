import { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { Button } from '../components/UIComponents';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl?: string;
  shopifyId: string;
}

interface Order {
  id: string;
  userId: string;
  status: string;
  total: number;
  createdAt: string;
}

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  totalUsers: number;
}

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalUsers: 0
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders'>('overview');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      
      // Fetch products
      const productsResponse = await fetch(`${API_URL}/api/products`);
      if (productsResponse.ok) {
        const productsData = await productsResponse.json();
        setProducts(productsData);
        setStats(prev => ({ ...prev, totalProducts: productsData.length }));
      }

      // Mock orders data (since we don't have orders API yet)
      const mockOrders: Order[] = [
        {
          id: '1',
          userId: 'user1',
          status: 'COMPLETED',
          total: 299.99,
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          userId: 'user2',
          status: 'PENDING',
          total: 129.99,
          createdAt: new Date().toISOString()
        }
      ];
      setOrders(mockOrders);
      setStats(prev => ({
        ...prev,
        totalOrders: mockOrders.length,
        totalRevenue: mockOrders.reduce((sum, order) => sum + order.total, 0),
        totalUsers: 25 // Mock user count
      }));

    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const response = await fetch(`${API_URL}/api/products/${productId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setProducts(prev => prev.filter(p => p.id !== productId));
        alert('Product deleted successfully');
      } else {
        alert('Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error deleting product');
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="container">
          <div className="loading">Loading dashboard...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="container">
        <div className="page-header">
          <h1>Admin Dashboard</h1>
          <p>Manage your store from one central location</p>
        </div>

        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            📊 Overview
          </button>
          <button 
            className={`tab ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            📦 Products
          </button>
          <button 
            className={`tab ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            🛒 Orders
          </button>
        </div>

        {activeTab === 'overview' && (
          <div className="overview-content">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">📦</div>
                <div className="stat-info">
                  <h3>{stats.totalProducts}</h3>
                  <p>Total Products</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🛒</div>
                <div className="stat-info">
                  <h3>{stats.totalOrders}</h3>
                  <p>Total Orders</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">💰</div>
                <div className="stat-info">
                  <h3>${stats.totalRevenue.toFixed(2)}</h3>
                  <p>Total Revenue</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">👥</div>
                <div className="stat-info">
                  <h3>{stats.totalUsers}</h3>
                  <p>Total Users</p>
                </div>
              </div>
            </div>

            <div className="quick-actions">
              <h2>Quick Actions</h2>
              <div className="actions-grid">
                <div className="action-card" onClick={() => setActiveTab('products')}>
                  <h3>📝 Manage Products</h3>
                  <p>Add, edit, or remove products from your catalog</p>
                </div>
                <div className="action-card" onClick={() => setActiveTab('orders')}>
                  <h3>📋 View Orders</h3>
                  <p>Process and manage customer orders</p>
                </div>
                <div className="action-card">
                  <h3>📈 Analytics</h3>
                  <p>View detailed sales and performance metrics</p>
                </div>
                <div className="action-card">
                  <h3>⚙️ Settings</h3>
                  <p>Configure store settings and preferences</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="products-content">
            <div className="section-header">
              <h2>Product Management</h2>
              <Button variant="primary">+ Add New Product</Button>
            </div>
            
            <div className="products-table">
              <div className="table-header">
                <span>Product</span>
                <span>Price</span>
                <span>Status</span>
                <span>Actions</span>
              </div>
              {products.map((product) => (
                <div key={product.id} className="table-row">
                  <div className="product-info">
                    {product.imageUrl ? (
                      <img src={product.imageUrl} alt={product.title} className="product-thumbnail" />
                    ) : (
                      <div className="placeholder-thumbnail">📦</div>
                    )}
                    <div>
                      <h4>{product.title}</h4>
                      <p>{product.description?.substring(0, 60)}...</p>
                    </div>
                  </div>
                  <span className="price">${product.price.toFixed(2)}</span>
                  <span className="status active">Active</span>
                  <div className="actions">
                    <button className="edit-btn">Edit</button>
                    <button 
                      className="delete-btn"
                      onClick={() => deleteProduct(product.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="orders-content">
            <div className="section-header">
              <h2>Order Management</h2>
              <select className="filter-select">
                <option value="">All Orders</option>
                <option value="PENDING">Pending</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
            
            <div className="orders-table">
              <div className="table-header">
                <span>Order ID</span>
                <span>Customer</span>
                <span>Total</span>
                <span>Status</span>
                <span>Date</span>
                <span>Actions</span>
              </div>
              {orders.map((order) => (
                <div key={order.id} className="table-row">
                  <span className="order-id">#{order.id}</span>
                  <span>Customer {order.userId}</span>
                  <span className="price">${order.total.toFixed(2)}</span>
                  <span className={`status ${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                  <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                  <div className="actions">
                    <button className="view-btn">View</button>
                    <button className="edit-btn">Update</button>
                  </div>
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
          color: #7f8c8d;
          font-size: 1.1rem;
        }

        .tabs {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 3rem;
          border-bottom: 2px solid #e9ecef;
        }

        .tab {
          padding: 1rem 2rem;
          border: none;
          background: none;
          cursor: pointer;
          font-size: 1rem;
          font-weight: 500;
          color: #7f8c8d;
          border-bottom: 3px solid transparent;
          transition: all 0.2s ease;
        }

        .tab:hover {
          color: #2c3e50;
          background: #f8f9fa;
        }

        .tab.active {
          color: #667eea;
          border-bottom-color: #667eea;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .stat-card {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          border: 1px solid #e9ecef;
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .stat-icon {
          font-size: 3rem;
          opacity: 0.8;
        }

        .stat-info h3 {
          font-size: 2rem;
          color: #2c3e50;
          margin: 0 0 0.5rem 0;
        }

        .stat-info p {
          color: #7f8c8d;
          margin: 0;
          font-size: 0.9rem;
        }

        .quick-actions h2 {
          color: #2c3e50;
          margin-bottom: 2rem;
          font-size: 1.5rem;
        }

        .actions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
        }

        .action-card {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          border: 1px solid #e9ecef;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .action-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }

        .action-card h3 {
          color: #2c3e50;
          margin-bottom: 1rem;
          font-size: 1.1rem;
        }

        .action-card p {
          color: #7f8c8d;
          line-height: 1.6;
          margin: 0;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .section-header h2 {
          color: #2c3e50;
          font-size: 1.5rem;
        }

        .filter-select {
          padding: 0.5rem 1rem;
          border: 1px solid #e9ecef;
          border-radius: 6px;
          background: white;
          color: #2c3e50;
        }

        .products-table,
        .orders-table {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          border: 1px solid #e9ecef;
        }

        .table-header,
        .table-row {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          align-items: center;
          padding: 1rem 1.5rem;
          border-bottom: 1px solid #e9ecef;
        }

        .orders-table .table-header,
        .orders-table .table-row {
          grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
        }

        .table-header {
          background: #f8f9fa;
          font-weight: 600;
          color: #2c3e50;
          font-size: 0.9rem;
        }

        .table-row:last-child {
          border-bottom: none;
        }

        .product-info {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .product-thumbnail {
          width: 50px;
          height: 50px;
          object-fit: cover;
          border-radius: 6px;
        }

        .placeholder-thumbnail {
          width: 50px;
          height: 50px;
          background: #f8f9fa;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
        }

        .product-info h4 {
          margin: 0 0 0.25rem 0;
          color: #2c3e50;
          font-size: 0.9rem;
        }

        .product-info p {
          margin: 0;
          color: #7f8c8d;
          font-size: 0.8rem;
        }

        .price {
          font-weight: 600;
          color: #e74c3c;
        }

        .status {
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
        }

        .status.active {
          background: #d4edda;
          color: #155724;
        }

        .status.pending {
          background: #fff3cd;
          color: #856404;
        }

        .status.completed {
          background: #d4edda;
          color: #155724;
        }

        .actions {
          display: flex;
          gap: 0.5rem;
        }

        .edit-btn,
        .delete-btn,
        .view-btn {
          padding: 0.25rem 0.75rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.8rem;
          font-weight: 500;
        }

        .edit-btn,
        .view-btn {
          background: #e3f2fd;
          color: #1976d2;
        }

        .edit-btn:hover,
        .view-btn:hover {
          background: #bbdefb;
        }

        .delete-btn {
          background: #ffebee;
          color: #d32f2f;
        }

        .delete-btn:hover {
          background: #ffcdd2;
        }

        .order-id {
          font-family: monospace;
          color: #2c3e50;
          font-weight: 600;
        }

        @media (max-width: 768px) {
          .container {
            padding: 1rem;
          }

          .page-header h1 {
            font-size: 2.5rem;
          }

          .tabs {
            flex-direction: column;
          }

          .section-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .actions-grid {
            grid-template-columns: 1fr;
          }

          .table-header,
          .table-row {
            grid-template-columns: 1fr;
            gap: 0.5rem;
          }

          .orders-table .table-header,
          .orders-table .table-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}