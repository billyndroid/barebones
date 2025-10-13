import { useState } from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  text?: string;
}

export function LoadingSpinner({ 
  size = 'medium', 
  color = '#3498db',
  text 
}: LoadingSpinnerProps) {
  const sizeMap = {
    small: '20px',
    medium: '40px',
    large: '60px'
  };

  return (
    <div className="loading-container">
      <div className="spinner"></div>
      {text && <p className="loading-text">{text}</p>}
      
      <style jsx>{`
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1rem;
        }

        .spinner {
          width: ${sizeMap[size]};
          height: ${sizeMap[size]};
          border: 3px solid #f3f3f3;
          border-top: 3px solid ${color};
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .loading-text {
          color: #7f8c8d;
          font-size: 0.9rem;
          margin: 0;
          text-align: center;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  type = 'button',
  className = ''
}: ButtonProps) {
  const variantStyles = {
    primary: {
      background: '#3498db',
      color: 'white',
      border: '2px solid #3498db',
      hoverBg: '#2980b9',
      hoverBorder: '#2980b9'
    },
    secondary: {
      background: '#95a5a6',
      color: 'white',
      border: '2px solid #95a5a6',
      hoverBg: '#7f8c8d',
      hoverBorder: '#7f8c8d'
    },
    success: {
      background: '#27ae60',
      color: 'white',
      border: '2px solid #27ae60',
      hoverBg: '#229954',
      hoverBorder: '#229954'
    },
    danger: {
      background: '#e74c3c',
      color: 'white',
      border: '2px solid #e74c3c',
      hoverBg: '#c0392b',
      hoverBorder: '#c0392b'
    },
    outline: {
      background: 'transparent',
      color: '#3498db',
      border: '2px solid #3498db',
      hoverBg: '#3498db',
      hoverBorder: '#3498db'
    }
  };

  const sizeStyles = {
    small: {
      padding: '0.5rem 1rem',
      fontSize: '0.85rem',
      borderRadius: '4px'
    },
    medium: {
      padding: '0.75rem 1.5rem',
      fontSize: '0.9rem',
      borderRadius: '6px'
    },
    large: {
      padding: '1rem 2rem',
      fontSize: '1rem',
      borderRadius: '8px'
    }
  };

  const currentVariant = variantStyles[variant];
  const currentSize = sizeStyles[size];

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`custom-button ${className}`}
    >
      {loading && <LoadingSpinner size="small" color="currentColor" />}
      <span className={loading ? 'button-content loading' : 'button-content'}>
        {children}
      </span>

      <style jsx>{`
        .custom-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          background: ${currentVariant.background};
          color: ${currentVariant.color};
          border: ${currentVariant.border};
          padding: ${currentSize.padding};
          border-radius: ${currentSize.borderRadius};
          font-size: ${currentSize.fontSize};
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          outline: none;
          font-family: inherit;
          text-decoration: none;
          user-select: none;
          width: ${fullWidth ? '100%' : 'auto'};
        }

        .custom-button:hover:not(:disabled) {
          background: ${variant === 'outline' ? currentVariant.hoverBg : currentVariant.hoverBg};
          border-color: ${currentVariant.hoverBorder};
          color: ${variant === 'outline' ? 'white' : currentVariant.color};
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .custom-button:active:not(:disabled) {
          transform: translateY(0);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .custom-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .button-content {
          transition: opacity 0.2s ease;
        }

        .button-content.loading {
          opacity: 0.7;
        }

        .custom-button:focus {
          box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
        }
      `}</style>
    </button>
  );
}

interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  error?: string;
  disabled?: boolean;
  required?: boolean;
  fullWidth?: boolean;
  className?: string;
}

export function Input({
  label,
  placeholder,
  value,
  onChange,
  type = 'text',
  error,
  disabled = false,
  required = false,
  fullWidth = false,
  className = ''
}: InputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <div className={`input-container ${className}`}>
      {label && (
        <label className="input-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        disabled={disabled}
        required={required}
        className={`input-field ${error ? 'error' : ''} ${focused ? 'focused' : ''}`}
      />
      {error && <span className="error-message">{error}</span>}

      <style jsx>{`
        .input-container {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          width: ${fullWidth ? '100%' : 'auto'};
        }

        .input-label {
          font-size: 0.9rem;
          font-weight: 500;
          color: #2c3e50;
        }

        .required {
          color: #e74c3c;
          margin-left: 0.25rem;
        }

        .input-field {
          padding: 0.75rem 1rem;
          border: 2px solid #e1e8ed;
          border-radius: 6px;
          font-size: 0.95rem;
          outline: none;
          transition: all 0.2s ease;
          background: white;
          font-family: inherit;
        }

        .input-field:focus,
        .input-field.focused {
          border-color: #3498db;
          box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
        }

        .input-field.error {
          border-color: #e74c3c;
        }

        .input-field.error:focus {
          border-color: #e74c3c;
          box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.1);
        }

        .input-field:disabled {
          background: #f8f9fa;
          color: #6c757d;
          cursor: not-allowed;
        }

        .error-message {
          font-size: 0.85rem;
          color: #e74c3c;
          margin-top: 0.25rem;
        }
      `}</style>
    </div>
  );
}