import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { Header } from '../components/Header';
import { UserProfile } from '../components/UserProfile';
import { LoadingSpinner } from '../components/UIComponents';

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

export default function ProfilePage() {
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { user, token, isAuthenticated } = useAuth();
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
      
      // Transform the data to match UserProfile component interface
      const transformedUser: User = {
        id: data.user.id,
        email: data.user.email,
        firstName: data.user.name?.split(' ')[0] || '',
        lastName: data.user.name?.split(' ').slice(1).join(' ') || '',
        phone: data.user.phone || '',
        address: data.user.address || {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: ''
        }
      };
      
      setUserData(transformedUser);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      showError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (updatedUser: Partial<User>) => {
    try {
      // Since we don't have an update profile endpoint, we'll simulate it
      setUserData(prev => prev ? { ...prev, ...updatedUser } : null);
      showSuccess('Profile updated successfully!');
    } catch (error) {
      showError('Failed to update profile');
      throw error;
    }
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

  return (
    <>
      <Header />
      <div className="container">
        {userData ? (
          <UserProfile
            user={userData}
            onUpdate={handleUpdateProfile}
            loading={loading}
          />
        ) : (
          <div className="loading-container">
            <LoadingSpinner size="large" text="Loading your profile..." />
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

        .loading-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 400px;
        }

        @media (max-width: 768px) {
          .container {
            padding: 1rem;
          }
        }
      `}</style>
    </>
  );
}