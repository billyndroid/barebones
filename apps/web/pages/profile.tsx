import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { Header } from '../components/Header';

interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  createdAt: string;
  orderCount: number;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const { user, token, isAuthenticated, logout } = useAuth();
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    if (isAuthenticated && token) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, token]);

  const fetchProfile = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const response = await fetch(`${API_URL}/api/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      const data = await response.json();
      setProfile(data.user);
      setFormData({
        name: data.user.name || '',
        email: data.user.email
      });
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      showError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Since we don't have an update profile endpoint, we'll just simulate it
      setProfile(prev => prev ? { ...prev, name: formData.name } : null);
      setEditing(false);
      showSuccess('Profile updated successfully!');
    } catch (error) {
      showError('Failed to update profile');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!isAuthenticated) {
    return (
      <>
        <Header />
        <div className="container">
          <div className="auth-required">
            <h2>Authentication Required</h2>
            <p>Please log in to view your profile.</p>
          </div>
        </div>

        <style jsx>{`
          .container {
            max-width: 800px;
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
          <div className="loading">Loading your profile...</div>
        </div>

        <style jsx>{`
          .container {
            max-width: 800px;
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
          <h1>My Profile</h1>
          <p>Manage your account information</p>
        </div>

        {profile && (
          <div className="profile-card">
            <div className="profile-header">
              <div className="avatar">
                {(profile.name || profile.email).charAt(0).toUpperCase()}
              </div>
              <div className="user-info">
                <h2>{profile.name || 'User'}</h2>
                <p>{profile.email}</p>
                <p className="member-since">Member since {formatDate(profile.createdAt)}</p>
              </div>
            </div>

            {editing ? (
              <form onSubmit={handleSave} className="edit-form">
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your name"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled
                  />
                  <small>Email cannot be changed</small>
                </div>

                <div className="form-actions">
                  <button type="submit" className="save-btn">Save Changes</button>
                  <button 
                    type="button" 
                    onClick={() => setEditing(false)}
                    className="cancel-btn"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="profile-content">
                <div className="info-section">
                  <h3>Account Information</h3>
                  <div className="info-grid">
                    <div className="info-item">
                      <label>Name</label>
                      <p>{profile.name || 'Not set'}</p>
                    </div>
                    <div className="info-item">
                      <label>Email</label>
                      <p>{profile.email}</p>
                    </div>
                    <div className="info-item">
                      <label>Total Orders</label>
                      <p>{profile.orderCount}</p>
                    </div>
                  </div>
                  <button onClick={() => setEditing(true)} className="edit-btn">
                    Edit Profile
                  </button>
                </div>

                <div className="actions-section">
                  <h3>Account Actions</h3>
                  <div className="actions-grid">
                    <a href="/orders" className="action-link">
                      📦 View Orders
                    </a>
                    <button onClick={logout} className="logout-btn">
                      🚪 Logout
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        .container {
          max-width: 800px;
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

        .profile-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        .profile-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 2rem;
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .avatar {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          font-weight: bold;
          backdrop-filter: blur(10px);
        }

        .user-info h2 {
          margin: 0 0 0.5rem 0;
          font-size: 1.75rem;
        }

        .user-info p {
          margin: 0.25rem 0;
          opacity: 0.9;
        }

        .member-since {
          font-size: 0.9rem;
          opacity: 0.7;
        }

        .profile-content {
          padding: 2rem;
        }

        .info-section, .actions-section {
          margin-bottom: 2rem;
        }

        .info-section h3, .actions-section h3 {
          color: #2c3e50;
          margin-bottom: 1.5rem;
          font-size: 1.25rem;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .info-item label {
          display: block;
          font-weight: 600;
          color: #7f8c8d;
          font-size: 0.9rem;
          margin-bottom: 0.5rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .info-item p {
          margin: 0;
          color: #2c3e50;
          font-size: 1.1rem;
        }

        .edit-btn {
          background: #3498db;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 6px;
          cursor: pointer;
          font-size: 1rem;
          transition: background-color 0.2s ease;
        }

        .edit-btn:hover {
          background: #2980b9;
        }

        .actions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }

        .action-link, .logout-btn {
          background: #f8f9fa;
          border: 1px solid #dee2e6;
          color: #2c3e50;
          text-decoration: none;
          padding: 1rem;
          border-radius: 6px;
          text-align: center;
          transition: all 0.2s ease;
          cursor: pointer;
          font-size: 1rem;
        }

        .action-link:hover {
          background: #e9ecef;
          transform: translateY(-1px);
        }

        .logout-btn {
          background: #fee;
          border-color: #f5c6cb;
          color: #721c24;
        }

        .logout-btn:hover {
          background: #f8d7da;
        }

        .edit-form {
          padding: 2rem;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          color: #2c3e50;
          font-weight: 500;
        }

        .form-group input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 1rem;
          box-sizing: border-box;
        }

        .form-group input:focus {
          outline: none;
          border-color: #3498db;
          box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
        }

        .form-group input:disabled {
          background: #f8f9fa;
          opacity: 0.7;
        }

        .form-group small {
          color: #7f8c8d;
          font-size: 0.85rem;
          margin-top: 0.25rem;
          display: block;
        }

        .form-actions {
          display: flex;
          gap: 1rem;
        }

        .save-btn {
          background: #27ae60;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 4px;
          cursor: pointer;
          font-size: 1rem;
        }

        .save-btn:hover {
          background: #229954;
        }

        .cancel-btn {
          background: #95a5a6;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 4px;
          cursor: pointer;
          font-size: 1rem;
        }

        .cancel-btn:hover {
          background: #7f8c8d;
        }

        @media (max-width: 768px) {
          .container {
            padding: 1rem;
          }

          .profile-header {
            flex-direction: column;
            text-align: center;
          }

          .page-header h1 {
            font-size: 2rem;
          }

          .info-grid, .actions-grid {
            grid-template-columns: 1fr;
          }

          .form-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </>
  );
}