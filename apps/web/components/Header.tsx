import { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { CartSidebar } from './CartSidebar';
import { AuthModal } from './AuthModal';

export function Header() {
  const { state } = useCart();
  const { user, logout, isAuthenticated } = useAuth();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <>
      <header className="header">
        <div className="container">
          <div className="logo">
            <h1>Barebones Store</h1>
          </div>
          
          <nav className="nav">
            <a href="/">Home</a>
            <a href="/products">Products</a>
            <a href="/categories">Categories</a>
            <a href="/about">About</a>
            <a href="/contact">Contact</a>
          </nav>
          
          <div className="header-actions">
            {isAuthenticated ? (
              <div className="user-menu">
                <button 
                  className="user-button"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  👤 {user?.name || user?.email}
                </button>
                {showUserMenu && (
                  <div className="user-dropdown">
                    <a href="/profile">Profile</a>
                    <a href="/orders">Orders</a>
                    <a href="/wishlist">Wishlist</a>
                    <button onClick={logout} className="logout-btn">Logout</button>
                  </div>
                )}
              </div>
            ) : (
              <button 
                className="login-button"
                onClick={() => setIsAuthOpen(true)}
              >
                Login
              </button>
            )}
            
            <div className="cart-button" onClick={() => setIsCartOpen(true)}>
              <div className="cart-icon">
                🛒
                {state.itemCount > 0 && (
                  <span className="cart-badge">{state.itemCount}</span>
                )}
              </div>
              <span className="cart-text">Cart</span>
            </div>
          </div>
        </div>
      </header>

      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

      <style jsx>{`
        .header {
          background: white;
          border-bottom: 1px solid #eee;
          position: sticky;
          top: 0;
          z-index: 100;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 1rem 2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .logo h1 {
          margin: 0;
          font-size: 1.5rem;
          color: #2c3e50;
          font-weight: 700;
        }

        .nav {
          display: flex;
          gap: 2rem;
        }

        .nav a {
          text-decoration: none;
          color: #2c3e50;
          font-weight: 500;
          transition: color 0.2s ease;
        }

        .nav a:hover {
          color: #3498db;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .login-button {
          background: #3498db;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
          transition: background-color 0.2s ease;
        }

        .login-button:hover {
          background: #2980b9;
        }

        .user-menu {
          position: relative;
        }

        .user-button {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          transition: background-color 0.2s ease;
          color: #2c3e50;
          font-weight: 500;
        }

        .user-button:hover {
          background: #f8f9fa;
        }

        .user-dropdown {
          position: absolute;
          top: 100%;
          right: 0;
          background: white;
          border: 1px solid #eee;
          border-radius: 4px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          min-width: 150px;
          z-index: 1000;
        }

        .user-dropdown a,
        .user-dropdown .logout-btn {
          display: block;
          width: 100%;
          padding: 0.75rem 1rem;
          text-decoration: none;
          color: #2c3e50;
          border: none;
          background: none;
          cursor: pointer;
          text-align: left;
          transition: background-color 0.2s ease;
        }

        .user-dropdown a:hover,
        .user-dropdown .logout-btn:hover {
          background: #f8f9fa;
        }

        .logout-btn {
          border-top: 1px solid #eee;
          color: #e74c3c;
        }

        .cart-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          transition: background-color 0.2s ease;
        }

        .cart-button:hover {
          background: #f8f9fa;
        }

        .cart-icon {
          position: relative;
          font-size: 1.25rem;
        }

        .cart-badge {
          position: absolute;
          top: -8px;
          right: -8px;
          background: #e74c3c;
          color: white;
          border-radius: 50%;
          width: 18px;
          height: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.7rem;
          font-weight: 600;
        }

        .cart-text {
          font-weight: 500;
          color: #2c3e50;
        }

        @media (max-width: 768px) {
          .container {
            padding: 1rem;
          }

          .nav {
            display: none;
          }

          .logo h1 {
            font-size: 1.25rem;
          }

          .cart-text {
            display: none;
          }

          .header-actions {
            gap: 0.5rem;
          }

          .user-button {
            padding: 0.25rem 0.5rem;
            font-size: 0.9rem;
          }

          .login-button {
            padding: 0.5rem 0.75rem;
            font-size: 0.9rem;
          }
        }
      `}</style>
    </>
  );
}