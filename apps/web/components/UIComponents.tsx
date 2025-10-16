import { useState } from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  text?: string;
}

export function LoadingSpinner({ 
  size = 'medium', 
  color = '#F0386B',
  text 
}: LoadingSpinnerProps) {
  const sizeMap = {
    small: '20px',
    medium: '40px',
    large: '60px'
  };

  return (
    <div className="loading-container">
      <div className="spinner-modern">
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
      </div>
      {text && <p className="loading-text">{text}</p>}
      
      <style jsx>{`
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1.5rem;
          padding: 2rem;
        }

        .spinner-modern {
          position: relative;
          width: ${sizeMap[size]};
          height: ${sizeMap[size]};
        }

        .spinner-ring {
          position: absolute;
          border: 2px solid transparent;
          border-radius: 50%;
          animation: modernSpin 1.5s linear infinite;
        }

        .spinner-ring:nth-child(1) {
          width: 100%;
          height: 100%;
          border-top: 2px solid ${color};
          animation-delay: 0s;
        }

        .spinner-ring:nth-child(2) {
          width: 80%;
          height: 80%;
          top: 10%;
          left: 10%;
          border-right: 2px solid rgba(254, 101, 79, 0.6);
          animation-delay: -0.4s;
          animation-direction: reverse;
        }

        .spinner-ring:nth-child(3) {
          width: 60%;
          height: 60%;
          top: 20%;
          left: 20%;
          border-bottom: 2px solid rgba(248, 192, 200, 0.8);
          animation-delay: -0.8s;
        }

        .loading-text {
          color: #3F334D;
          font-size: 0.95rem;
          margin: 0;
          text-align: center;
          font-weight: 500;
          font-family: 'Inter', sans-serif;
          animation: textPulse 2s ease-in-out infinite;
        }

        @keyframes modernSpin {
          0% { 
            transform: rotate(0deg);
            filter: hue-rotate(0deg);
          }
          100% { 
            transform: rotate(360deg);
            filter: hue-rotate(360deg);
          }
        }

        @keyframes textPulse {
          0%, 100% {
            opacity: 0.7;
          }
          50% {
            opacity: 1;
          }
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
      background: 'linear-gradient(135deg, #F0386B 0%, #FE654F 100%)',
      color: 'white',
      border: 'none',
      hoverBg: 'linear-gradient(135deg, #e02d5f 0%, #fe4a3b 100%)',
      shadow: '0 4px 14px rgba(240, 56, 107, 0.4)',
      hoverShadow: '0 8px 25px rgba(240, 56, 107, 0.6)'
    },
    secondary: {
      background: 'linear-gradient(135deg, #FE654F 0%, #F8C0C8 100%)',
      color: 'white',
      border: 'none',
      hoverBg: 'linear-gradient(135deg, #fe4a3b 0%, #f5adb9 100%)',
      shadow: '0 4px 14px rgba(254, 101, 79, 0.4)',
      hoverShadow: '0 8px 25px rgba(254, 101, 79, 0.6)'
    },
    success: {
      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      color: 'white',
      border: 'none',
      hoverBg: 'linear-gradient(135deg, #047857 0%, #065f46 100%)',
      shadow: '0 4px 14px rgba(16, 185, 129, 0.3)',
      hoverShadow: '0 8px 25px rgba(16, 185, 129, 0.4)'
    },
    danger: {
      background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
      color: 'white',
      border: 'none',
      hoverBg: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
      shadow: '0 4px 14px rgba(239, 68, 68, 0.3)',
      hoverShadow: '0 8px 25px rgba(239, 68, 68, 0.4)'
    },
    outline: {
      background: 'rgba(255, 255, 255, 0.1)',
      color: '#F0386B',
      border: '2px solid #F0386B',
      hoverBg: '#F0386B',
      shadow: 'none',
      hoverShadow: '0 8px 25px rgba(240, 56, 107, 0.4)'
    }
  };

  const sizeStyles = {
    small: {
      padding: '0.5rem 1rem',
      fontSize: '0.875rem',
      borderRadius: '8px'
    },
    medium: {
      padding: '0.75rem 1.5rem',
      fontSize: '1rem',
      borderRadius: '12px'
    },
    large: {
      padding: '1rem 2rem',
      fontSize: '1.125rem',
      borderRadius: '16px'
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
      <div className="button-shine"></div>

      <style jsx>{`
        .custom-button {
          position: relative;
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
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          outline: none;
          font-family: 'Inter', sans-serif;
          text-decoration: none;
          user-select: none;
          width: ${fullWidth ? '100%' : 'auto'};
          overflow: hidden;
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          box-shadow: ${currentVariant.shadow};
        }

        .button-shine {
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.2),
            transparent
          );
          transition: left 0.5s ease;
          z-index: 1;
        }

        .custom-button:hover .button-shine {
          left: 100%;
        }

        .custom-button:hover:not(:disabled) {
          background: ${currentVariant.hoverBg};
          color: ${variant === 'outline' ? 'white' : currentVariant.color};
          transform: translateY(-2px);
          box-shadow: ${currentVariant.hoverShadow};
        }

        .custom-button:active:not(:disabled) {
          transform: translateY(0);
        }

        .custom-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .button-content {
          position: relative;
          z-index: 2;
          transition: all 0.2s ease;
        }

        .button-content.loading {
          opacity: 0.7;
        }

        .custom-button:focus {
          box-shadow: ${currentVariant.hoverShadow}, 0 0 0 3px rgba(240, 56, 107, 0.2);
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
          gap: 0.75rem;
          width: ${fullWidth ? '100%' : 'auto'};
        }

        .input-label {
          font-size: 0.95rem;
          font-weight: 600;
          color: #3F334D;
          font-family: 'Inter', sans-serif;
        }

        .required {
          color: #ef4444;
          margin-left: 0.25rem;
        }

        .input-field {
          padding: 1rem 1.25rem;
          border: 2px solid rgba(226, 232, 240, 0.8);
          border-radius: 12px;
          font-size: 1rem;
          outline: none;
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          font-family: 'Inter', sans-serif;
          color: #3F334D;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        }

        .input-field::placeholder {
          color: #94a3b8;
          font-weight: 400;
        }

        .input-field:focus,
        .input-field.focused {
          border-color: #F0386B;
          background: rgba(255, 255, 255, 0.95);
          box-shadow: 0 0 0 3px rgba(240, 56, 107, 0.2), 0 4px 12px rgba(240, 56, 107, 0.1);
          transform: translateY(-1px);
        }

        .input-field.error {
          border-color: #ef4444;
          background: rgba(254, 242, 242, 0.8);
        }

        .input-field.error:focus {
          border-color: #ef4444;
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1), 0 4px 12px rgba(239, 68, 68, 0.1);
        }

        .input-field:disabled {
          background: rgba(248, 250, 252, 0.8);
          color: #94a3b8;
          cursor: not-allowed;
          border-color: rgba(203, 213, 225, 0.8);
        }

        .error-message {
          font-size: 0.875rem;
          color: #ef4444;
          margin-top: 0.25rem;
          font-weight: 500;
          font-family: 'Inter', sans-serif;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .error-message::before {
          content: '';
          background-image: url('data:image/svg+xml;utf8,<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L22 20H2L12 2Z" stroke="%23ef4444" stroke-width="2" fill="none"/><path d="M12 9V13" stroke="%23ef4444" stroke-width="2"/><circle cx="12" cy="17" r="1" fill="%23ef4444"/></svg>');
          width: 16px;
          height: 16px;
          background-size: contain;
          background-repeat: no-repeat;
          display: inline-block;
        }
      `}</style>
    </div>
  );
}