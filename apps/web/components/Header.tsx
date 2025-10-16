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
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 6.5C14.8 6.1 14.6 5.7 14.3 5.4L15.4 1L13.4 0.2L12.4 4.1C12.3 4.1 12.2 4.1 12.1 4.1C11.9 4.1 11.8 4.1 11.6 4.1L10.6 0.2L8.6 1L9.7 5.4C9.4 5.7 9.2 6.1 9 6.5L3 7V9H9C9 10.66 10.34 12 12 12C13.66 12 15 10.66 15 9H21ZM6 9V7L12 6.5C12.17 6.5 12.33 6.58 12.43 6.73C12.53 6.88 12.5 7.05 12.35 7.2L6 9ZM18 9L11.65 7.2C11.5 7.05 11.47 6.88 11.57 6.73C11.67 6.58 11.83 6.5 12 6.5L18 7V9Z"/>
                  </svg>
                  {user?.name || user?.email}
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
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7 18C5.9 18 5.01 18.9 5.01 20S5.9 22 7 22 9 21.1 9 20 8.1 18 7 18ZM1 2V4H3L6.6 11.59L5.25 14.04C5.09 14.32 5 14.65 5 15C5 16.1 5.9 17 7 17H19V15H7.42C7.28 15 7.17 14.89 7.17 14.75L7.2 14.63L8.1 13H15.55C16.3 13 16.96 12.59 17.3 11.97L20.88 5H5.21L4.27 3H1ZM17 18C15.9 18 15.01 18.9 15.01 20S15.9 22 17 22 19 21.1 19 20 18.1 18 17 18Z"/>
                </svg>
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
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
          position: sticky;
          top: 0;
          z-index: 100;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
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
          font-family: 'Poppins', sans-serif;
          font-size: 1.8rem;
          font-weight: 700;
          background: linear-gradient(135deg, #F0386B 0%, #FE654F 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .logo h1:hover {
          transform: scale(1.05);
          filter: drop-shadow(0 4px 8px rgba(240, 56, 107, 0.3));
        }

        .nav {
          display: flex;
          gap: 2.5rem;
        }

        .nav a {
          text-decoration: none;
          color: #3F334D;
          font-weight: 500;
          font-family: 'Inter', sans-serif;
          position: relative;
          transition: all 0.3s ease;
          padding: 0.5rem 0;
        }

        .nav a::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, #F0386B, #FE654F);
          transition: width 0.3s ease;
        }

        .nav a:hover {
          color: #F0386B;
        }

        .nav a:hover::after {
          width: 100%;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .login-button {
          background: linear-gradient(135deg, #F0386B 0%, #FE654F 100%);
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 12px;
          cursor: pointer;
          font-weight: 500;
          font-family: 'Inter', sans-serif;
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          box-shadow: 0 4px 14px rgba(240, 56, 107, 0.4);
          position: relative;
          overflow: hidden;
        }

        .login-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s ease;
        }

        .login-button:hover::before {
          left: 100%;
        }

        .login-button:hover {
          background: linear-gradient(135deg, #e02d5f 0%, #fe4a3b 100%);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(240, 56, 107, 0.6);
        }

        .user-menu {
          position: relative;
        }

        .user-button {
          background: rgba(240, 56, 107, 0.1);
          border: 2px solid rgba(240, 56, 107, 0.2);
          cursor: pointer;
          padding: 0.75rem 1rem;
          border-radius: 12px;
          transition: all 0.3s ease;
          color: #F0386B;
          font-weight: 500;
          font-family: 'Inter', sans-serif;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }

        .user-button:hover {
          background: #F0386B;
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(240, 56, 107, 0.4);
        }

        .user-dropdown {
          position: absolute;
          top: 100%;
          right: 0;
          margin-top: 0.5rem;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 16px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          min-width: 200px;
          z-index: 1000;
          overflow: hidden;
          transform: translateY(-10px);
          opacity: 0;
          animation: dropdownSlide 0.3s ease forwards;
        }

        .user-dropdown a,
        .user-dropdown .logout-btn {
          display: block;
          width: 100%;
          padding: 1rem 1.5rem;
          text-decoration: none;
          color: #3F334D;
          border: none;
          background: none;
          cursor: pointer;
          text-align: left;
          transition: all 0.2s ease;
          font-weight: 500;
          border-bottom: 1px solid rgba(0, 0, 0, 0.05);
        }

        .user-dropdown a:last-child,
        .user-dropdown .logout-btn {
          border-bottom: none;
        }

        .user-dropdown a:hover,
        .user-dropdown .logout-btn:hover {
          background: rgba(240, 56, 107, 0.1);
          color: #F0386B;
        }

        .logout-btn {
          color: #ef4444 !important;
        }

        .logout-btn:hover {
          background: rgba(239, 68, 68, 0.1) !important;
          color: #dc2626 !important;
        }

        .cart-button {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          cursor: pointer;
          padding: 0.75rem 1rem;
          border-radius: 12px;
          transition: all 0.3s ease;
          background: rgba(240, 56, 107, 0.1);
          border: 2px solid rgba(240, 56, 107, 0.2);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }

        .cart-button:hover {
          background: #F0386B;
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(240, 56, 107, 0.4);
        }

        .cart-icon {
          position: relative;
          font-size: 1.25rem;
          transition: transform 0.3s ease;
        }

        .cart-button:hover .cart-icon {
          transform: scale(1.1);
        }

        .cart-badge {
          position: absolute;
          top: -8px;
          right: -8px;
          background: linear-gradient(135deg, #F0386B 0%, #FE654F 100%);
          color: white;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 600;
          border: 2px solid white;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          animation: pulse 2s infinite;
        }

        .cart-text {
          font-weight: 500;
          color: #F0386B;
          transition: color 0.3s ease;
        }

        .cart-button:hover .cart-text {
          color: white;
        }

        @keyframes dropdownSlide {
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }

        @media (max-width: 768px) {
          .container {
            padding: 1rem;
          }

          .nav {
            display: none;
          }

          .logo h1 {
            font-size: 1.5rem;
          }

          .cart-text {
            display: none;
          }

          .header-actions {
            gap: 1rem;
          }

          .user-button {
            padding: 0.5rem 0.75rem;
            font-size: 0.9rem;
          }

          .login-button {
            padding: 0.5rem 1rem;
            font-size: 0.9rem;
          }

          .user-dropdown {
            right: auto;
            left: 0;
            min-width: 180px;
          }
        }
      `}</style>
    </>
  );
}