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
                <div className="stat-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
                    <path d="M9.09 9C9.32 8.38 9.84 8 10.5 8H13.5C14.16 8 14.68 8.38 14.91 9" stroke="currentColor" strokeWidth="2"/>
                    <path d="M9.09 15C9.32 15.62 9.84 16 10.5 16H13.5C14.16 16 14.68 15.62 14.91 15" stroke="currentColor" strokeWidth="2"/>
                    <path d="M12 6V8" stroke="currentColor" strokeWidth="2"/>
                    <path d="M12 16V18" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </div>
                <div className="stat-info">
                  <h3>${stats.totalRevenue.toFixed(2)}</h3>
                  <p>Total Revenue</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" fill="none"/>
                    <path d="M1 21V19C1 15.134 4.134 12 8 12H10C13.866 12 17 15.134 17 19V21" stroke="currentColor" strokeWidth="2" fill="none"/>
                    <circle cx="17" cy="7" r="3" stroke="currentColor" strokeWidth="2" fill="none"/>
                    <path d="M23 21V19C23 16.239 20.761 14 18 14C17.115 14 16.302 14.248 15.618 14.673" stroke="currentColor" strokeWidth="2" fill="none"/>
                  </svg>
                </div>
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
                  <h3>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{marginRight: '8px'}}>
                      <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" fill="none"/>
                      <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" fill="none"/>
                      <path d="M16 13H8" stroke="currentColor" strokeWidth="2"/>
                      <path d="M16 17H8" stroke="currentColor" strokeWidth="2"/>
                      <path d="M10 9H8" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    Manage Products
                  </h3>
                  <p>Add, edit, or remove products from your catalog</p>
                </div>
                <div className="action-card" onClick={() => setActiveTab('orders')}>
                  <h3>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{marginRight: '8px'}}>
                      <rect x="8" y="2" width="8" height="4" rx="1" stroke="currentColor" strokeWidth="2" fill="none"/>
                      <path d="M16 4H18C18.5304 4 19.0391 4.21071 19.4142 4.58579C19.7893 4.96086 20 5.46957 20 6V20C20 20.5304 19.7893 21.0391 19.4142 21.4142C19.0391 21.7893 18.5304 22 18 22H6C5.46957 22 4.96086 21.7893 4.58579 21.4142C4.21071 21.0391 4 20.5304 4 20V6C4 5.46957 4.21071 4.96086 4.58579 4.58579C4.96086 4.21071 5.46957 4 6 4H8" stroke="currentColor" strokeWidth="2" fill="none"/>
                    </svg>
                    View Orders
                  </h3>
                  <p>Process and manage customer orders</p>
                </div>
                <div className="action-card">
                  <h3>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{marginRight: '8px'}}>
                      <path d="M3 3V21H21" stroke="currentColor" strokeWidth="2" fill="none"/>
                      <path d="M9 9L12 6L16 10L22 4" stroke="currentColor" strokeWidth="2" fill="none"/>
                    </svg>
                    Analytics
                  </h3>
                  <p>View detailed sales and performance metrics</p>
                </div>
                <div className="action-card">
                  <h3>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{marginRight: '8px'}}>
                      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" fill="none"/>
                      <path d="M19.4 15C19.2669 15.3016 19.2272 15.6362 19.286 15.9606C19.3448 16.285 19.4995 16.5843 19.73 16.82L19.79 16.88C19.976 17.0657 20.1235 17.2863 20.2241 17.5291C20.3248 17.7718 20.3766 18.0322 20.3766 18.295C20.3766 18.5578 20.3248 18.8182 20.2241 19.0609C20.1235 19.3037 19.976 19.5243 19.79 19.71C19.6043 19.896 19.3837 20.0435 19.1409 20.1441C18.8982 20.2448 18.6378 20.2966 18.375 20.2966C18.1122 20.2966 17.8518 20.2448 17.6091 20.1441C17.3663 20.0435 17.1457 19.896 16.96 19.71L16.9 19.65C16.6643 19.4195 16.365 19.2648 16.0406 19.206C15.7162 19.1472 15.3816 19.1869 15.08 19.32C14.7842 19.4468 14.532 19.6572 14.3543 19.9255C14.1766 20.1938 14.0813 20.5082 14.08 20.83V21C14.08 21.5304 13.8693 22.0391 13.4942 22.4142C13.1191 22.7893 12.6104 23 12.08 23C11.5496 23 11.0409 22.7893 10.6658 22.4142C10.2907 22.0391 10.08 21.5304 10.08 21V20.91C10.0723 20.579 9.96512 20.258 9.77251 19.9887C9.5799 19.7194 9.31074 19.5143 9 19.4C8.69838 19.2669 8.36381 19.2272 8.03941 19.286C7.71502 19.3448 7.41568 19.4995 7.18 19.73L7.12 19.79C6.93425 19.976 6.71368 20.1235 6.47088 20.2241C6.22808 20.3248 5.96783 20.3766 5.705 20.3766C5.44217 20.3766 5.18192 20.3248 4.93912 20.2241C4.69632 20.1235 4.47575 19.976 4.29 19.79C4.10405 19.6043 3.95653 19.3837 3.85588 19.1409C3.75523 18.8982 3.70343 18.6378 3.70343 18.375C3.70343 18.1122 3.75523 17.8518 3.85588 17.6091C3.95653 17.3663 4.10405 17.1457 4.29 16.96L4.35 16.9C4.58054 16.6643 4.73519 16.365 4.794 16.0406C4.85282 15.7162 4.81312 15.3816 4.68 15.08C4.55324 14.7842 4.34276 14.532 4.07447 14.3543C3.80618 14.1766 3.49179 14.0813 3.17 14.08H3C2.46957 14.08 1.96086 13.8693 1.58579 13.4942C1.21071 13.1191 1 12.6104 1 12.08C1 11.5496 1.21071 11.0409 1.58579 10.6658C1.96086 10.2907 2.46957 10.08 3 10.08H3.09C3.42099 10.0723 3.742 9.96512 4.0113 9.77251C4.28059 9.5799 4.48572 9.31074 4.6 9C4.73312 8.69838 4.77282 8.36381 4.714 8.03941C4.65519 7.71502 4.50054 7.41568 4.27 7.18L4.21 7.12C4.02405 6.93425 3.87653 6.71368 3.77588 6.47088C3.67523 6.22808 3.62343 5.96783 3.62343 5.705C3.62343 5.44217 3.67523 5.18192 3.77588 4.93912C3.87653 4.69632 4.02405 4.47575 4.21 4.29C4.39575 4.10405 4.61632 3.95653 4.85912 3.85588C5.10192 3.75523 5.36217 3.70343 5.625 3.70343C5.88783 3.70343 6.14808 3.75523 6.39088 3.85588C6.63368 3.95653 6.85425 4.10405 7.04 4.29L7.1 4.35C7.33568 4.58054 7.63502 4.73519 7.95941 4.794C8.28381 4.85282 8.61838 4.81312 8.92 4.68H9C9.29577 4.55324 9.54802 4.34276 9.72569 4.07447C9.90337 3.80618 9.99872 3.49179 10 3.17V3C10 2.46957 10.2107 1.96086 10.5858 1.58579C10.9609 1.21071 11.4696 1 12 1C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V3.09C14.0013 3.41179 14.0966 3.72618 14.2743 3.99447C14.452 4.26276 14.7042 4.47324 15 4.6C15.3016 4.73312 15.6362 4.77282 15.9606 4.714C16.285 4.65519 16.5843 4.50054 16.82 4.27L16.88 4.21C17.0657 4.02405 17.2863 3.87653 17.5291 3.77588C17.7718 3.67523 18.0322 3.62343 18.295 3.62343C18.5578 3.62343 18.8182 3.67523 19.0609 3.77588C19.3037 3.87653 19.5243 4.02405 19.71 4.21C19.896 4.39575 20.0435 4.61632 20.1441 4.85912C20.2448 5.10192 20.2966 5.36217 20.2966 5.625C20.2966 5.88783 20.2448 6.14808 20.1441 6.39088C20.0435 6.63368 19.896 6.85425 19.71 7.04L19.65 7.1C19.4195 7.33568 19.2648 7.63502 19.206 7.95941C19.1472 8.28381 19.1869 8.61838 19.32 8.92V9C19.4468 9.29577 19.6572 9.54802 19.9255 9.72569C20.1938 9.90337 20.5082 9.99872 20.83 10H21C21.5304 10 22.0391 10.2107 22.4142 10.5858C22.7893 10.9609 23 11.4696 23 12C23 12.5304 22.7893 13.0391 22.4142 13.4142C22.0391 13.7893 21.5304 14 21 14H20.91C20.5882 14.0013 20.2738 14.0966 20.0055 14.2743C19.7372 14.452 19.5268 14.7042 19.4 15Z" stroke="currentColor" strokeWidth="2" fill="none"/>
                    </svg>
                    Settings
                  </h3>
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
                      <div className="placeholder-thumbnail">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M21 7V17C21 17.5304 20.7893 18.0391 20.4142 18.4142C20.0391 18.7893 19.5304 19 19 19H5C4.46957 19 3.96086 18.7893 3.58579 18.4142C3.21071 18.0391 3 17.5304 3 17V7L12 2L21 7Z" stroke="currentColor" strokeWidth="2" fill="none"/>
                          <path d="M3 7L12 12L21 7" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                      </div>
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