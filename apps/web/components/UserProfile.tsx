import { useState, useEffect } from 'react';
import { Button, Input } from './UIComponents';

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

interface UserProfileProps {
  user: User;
  onUpdate: (updatedUser: Partial<User>) => Promise<void>;
  loading?: boolean;
}

export function UserProfile({ user, onUpdate, loading = false }: UserProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    email: user.email,
    phone: user.phone || '',
    street: user.address?.street || '',
    city: user.address?.city || '',
    state: user.address?.state || '',
    zipCode: user.address?.zipCode || '',
    country: user.address?.country || ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setFormData({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email,
      phone: user.phone || '',
      street: user.address?.street || '',
      city: user.address?.city || '',
      state: user.address?.state || '',
      zipCode: user.address?.zipCode || '',
      country: user.address?.country || ''
    });
  }, [user]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData.phone && !/^[\d\s\-\+\(\)]+$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSaving(true);
    try {
      const updatedUser: Partial<User> = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone || undefined,
        address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country
        }
      };

      await onUpdate(updatedUser);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email,
      phone: user.phone || '',
      street: user.address?.street || '',
      city: user.address?.city || '',
      state: user.address?.state || '',
      zipCode: user.address?.zipCode || '',
      country: user.address?.country || ''
    });
    setErrors({});
    setIsEditing(false);
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="loading-spinner"></div>
        <p>Loading profile...</p>
        
        <style jsx>{`
          .profile-loading {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 4rem 2rem;
          }

          .loading-spinner {
            width: 40px;
            height: 40px;
            border: 3px solid #f3f3f3;
            border-top: 3px solid #3498db;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 1rem;
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="user-profile">
      <div className="profile-header">
        <div className="profile-info">
          <h2>My Profile</h2>
          <p>Manage your account information and preferences</p>
        </div>
        {!isEditing && (
          <Button variant="outline" onClick={() => setIsEditing(true)}>
            Edit Profile
          </Button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="profile-form">
        <div className="form-section">
          <h3>Personal Information</h3>
          <div className="form-grid">
            <Input
              label="First Name"
              value={formData.firstName}
              onChange={(value) => updateFormData('firstName', value)}
              error={errors.firstName}
              disabled={!isEditing}
              required
              fullWidth
            />
            <Input
              label="Last Name"
              value={formData.lastName}
              onChange={(value) => updateFormData('lastName', value)}
              error={errors.lastName}
              disabled={!isEditing}
              required
              fullWidth
            />
          </div>
          <Input
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={(value) => updateFormData('email', value)}
            error={errors.email}
            disabled={!isEditing}
            required
            fullWidth
          />
          <Input
            label="Phone Number"
            type="tel"
            value={formData.phone}
            onChange={(value) => updateFormData('phone', value)}
            error={errors.phone}
            disabled={!isEditing}
            placeholder="(555) 123-4567"
            fullWidth
          />
        </div>

        <div className="form-section">
          <h3>Address</h3>
          <Input
            label="Street Address"
            value={formData.street}
            onChange={(value) => updateFormData('street', value)}
            disabled={!isEditing}
            placeholder="123 Main Street"
            fullWidth
          />
          <div className="form-grid">
            <Input
              label="City"
              value={formData.city}
              onChange={(value) => updateFormData('city', value)}
              disabled={!isEditing}
              fullWidth
            />
            <Input
              label="State"
              value={formData.state}
              onChange={(value) => updateFormData('state', value)}
              disabled={!isEditing}
              fullWidth
            />
          </div>
          <div className="form-grid">
            <Input
              label="ZIP Code"
              value={formData.zipCode}
              onChange={(value) => updateFormData('zipCode', value)}
              disabled={!isEditing}
              fullWidth
            />
            <Input
              label="Country"
              value={formData.country}
              onChange={(value) => updateFormData('country', value)}
              disabled={!isEditing}
              placeholder="United States"
              fullWidth
            />
          </div>
        </div>

        {isEditing && (
          <div className="form-actions">
            <Button
              type="button"
              variant="secondary"
              onClick={handleCancel}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={saving}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        )}
      </form>

      <style jsx>{`
        .user-profile {
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        .profile-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 2rem;
          background: #f8f9fa;
          border-bottom: 1px solid #e1e8ed;
        }

        .profile-info h2 {
          margin: 0 0 0.5rem 0;
          color: #2c3e50;
        }

        .profile-info p {
          margin: 0;
          color: #7f8c8d;
        }

        .profile-form {
          padding: 2rem;
        }

        .form-section {
          margin-bottom: 2rem;
        }

        .form-section:last-of-type {
          margin-bottom: 0;
        }

        .form-section h3 {
          margin: 0 0 1.5rem 0;
          color: #2c3e50;
          font-size: 1.1rem;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid #e1e8ed;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid #e1e8ed;
        }

        @media (max-width: 768px) {
          .profile-header {
            flex-direction: column;
            gap: 1rem;
            align-items: stretch;
          }

          .profile-form {
            padding: 1.5rem;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }

          .form-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}