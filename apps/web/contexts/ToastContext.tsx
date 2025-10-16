import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

interface ToastContextType {
  showToast: (message: string, type?: Toast['type'], duration?: number) => void;
  showSuccess: (message: string, duration?: number) => void;
  showError: (message: string, duration?: number) => void;
  showInfo: (message: string, duration?: number) => void;
  showWarning: (message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const showToast = useCallback((
    message: string, 
    type: Toast['type'] = 'info', 
    duration: number = 5000
  ) => {
    const id = Math.random().toString(36).substr(2, 9);
    const toast: Toast = { id, message, type, duration };
    
    setToasts(prev => [...prev, toast]);

    if (duration > 0) {
      setTimeout(() => removeToast(id), duration);
    }
  }, [removeToast]);

  const showSuccess = useCallback((message: string, duration?: number) => {
    showToast(message, 'success', duration);
  }, [showToast]);

  const showError = useCallback((message: string, duration?: number) => {
    showToast(message, 'error', duration);
  }, [showToast]);

  const showInfo = useCallback((message: string, duration?: number) => {
    showToast(message, 'info', duration);
  }, [showToast]);

  const showWarning = useCallback((message: string, duration?: number) => {
    showToast(message, 'warning', duration);
  }, [showToast]);

  const value: ToastContextType = {
    showToast,
    showSuccess,
    showError,
    showInfo,
    showWarning,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

function ToastContainer({ toasts, onRemove }: { toasts: Toast[]; onRemove: (id: string) => void }) {
  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
      
      <style jsx>{`
        .toast-container {
          position: fixed;
          top: 1rem;
          right: 1rem;
          z-index: 10000;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          max-width: 400px;
        }

        @media (max-width: 768px) {
          .toast-container {
            left: 1rem;
            right: 1rem;
            max-width: none;
          }
        }
      `}</style>
    </div>
  );
}

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
  const getToastStyles = (type: Toast['type']) => {
    switch (type) {
      case 'success':
        return { bg: '#d4edda', border: '#c3e6cb', text: '#155724' };
      case 'error':
        return { bg: '#f8d7da', border: '#f5c6cb', text: '#721c24' };
      case 'warning':
        return { bg: '#fff3cd', border: '#ffeaa7', text: '#856404' };
      case 'info':
      default:
        return { bg: '#d1ecf1', border: '#bee5eb', text: '#0c5460' };
    }
  };

  const styles = getToastStyles(toast.type);

  const getIcon = (type: Toast['type']) => {
    switch (type) {
      case 'success': 
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 6L9 17L4 12" stroke="#22c55e" strokeWidth="2" fill="none"/>
          </svg>
        );
      case 'error': 
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="#ef4444" strokeWidth="2" fill="none"/>
            <path d="M15 9L9 15" stroke="#ef4444" strokeWidth="2"/>
            <path d="M9 9L15 15" stroke="#ef4444" strokeWidth="2"/>
          </svg>
        );
      case 'warning': 
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L22 20H2L12 2Z" stroke="#f59e0b" strokeWidth="2" fill="none"/>
            <path d="M12 9V13" stroke="#f59e0b" strokeWidth="2"/>
            <circle cx="12" cy="17" r="1" fill="#f59e0b"/>
          </svg>
        );
      case 'info':
      default: 
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="#3b82f6" strokeWidth="2" fill="none"/>
            <path d="M12 16V12" stroke="#3b82f6" strokeWidth="2"/>
            <circle cx="12" cy="8" r="1" fill="#3b82f6"/>
          </svg>
        );
    }
  };

  return (
    <div className="toast-item">
      <div className="toast-content">
        <span className="toast-icon">{getIcon(toast.type)}</span>
        <span className="toast-message">{toast.message}</span>
      </div>
      <button className="toast-close" onClick={() => onRemove(toast.id)}>
        ×
      </button>

      <style jsx>{`
        .toast-item {
          background: ${styles.bg};
          border: 1px solid ${styles.border};
          color: ${styles.text};
          border-radius: 8px;
          padding: 1rem;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 1rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          animation: slideIn 0.3s ease-out;
          min-width: 300px;
        }

        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .toast-content {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex: 1;
        }

        .toast-icon {
          font-size: 1.25rem;
          flex-shrink: 0;
        }

        .toast-message {
          font-size: 0.9rem;
          line-height: 1.4;
        }

        .toast-close {
          background: none;
          border: none;
          color: ${styles.text};
          cursor: pointer;
          font-size: 1.25rem;
          font-weight: bold;
          padding: 0;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0.7;
          flex-shrink: 0;
        }

        .toast-close:hover {
          opacity: 1;
        }

        @media (max-width: 768px) {
          .toast-item {
            min-width: auto;
          }
        }
      `}</style>
    </div>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}