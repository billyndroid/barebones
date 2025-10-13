import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="error-boundary">
          <div className="error-content">
            <h2>Oops! Something went wrong</h2>
            <p>We're sorry for the inconvenience. The application encountered an unexpected error.</p>
            
            <details className="error-details">
              <summary>Error details</summary>
              <pre>{this.state.error?.toString()}</pre>
            </details>
            
            <button 
              onClick={() => this.setState({ hasError: false, error: undefined })}
              className="retry-button"
            >
              Try Again
            </button>
            
            <button 
              onClick={() => window.location.reload()}
              className="reload-button"
            >
              Reload Page
            </button>
          </div>

          <style jsx>{`
            .error-boundary {
              min-height: 400px;
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 2rem;
              background: #f8f9fa;
            }

            .error-content {
              max-width: 500px;
              text-align: center;
              background: white;
              padding: 2rem;
              border-radius: 8px;
              box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            }

            .error-content h2 {
              color: #e74c3c;
              margin-bottom: 1rem;
              font-size: 1.5rem;
            }

            .error-content p {
              color: #7f8c8d;
              margin-bottom: 1.5rem;
              line-height: 1.5;
            }

            .error-details {
              margin: 1.5rem 0;
              text-align: left;
            }

            .error-details summary {
              cursor: pointer;
              color: #3498db;
              margin-bottom: 0.5rem;
            }

            .error-details pre {
              background: #f8f9fa;
              padding: 1rem;
              border-radius: 4px;
              overflow-x: auto;
              font-size: 0.85rem;
              color: #e74c3c;
            }

            .retry-button,
            .reload-button {
              background: #3498db;
              color: white;
              border: none;
              padding: 0.75rem 1.5rem;
              border-radius: 4px;
              cursor: pointer;
              margin: 0 0.5rem;
              font-size: 1rem;
              transition: background-color 0.2s ease;
            }

            .retry-button:hover,
            .reload-button:hover {
              background: #2980b9;
            }

            .reload-button {
              background: #95a5a6;
            }

            .reload-button:hover {
              background: #7f8c8d;
            }

            @media (max-width: 768px) {
              .error-boundary {
                padding: 1rem;
              }

              .error-content {
                padding: 1.5rem;
              }

              .retry-button,
              .reload-button {
                display: block;
                width: 100%;
                margin: 0.5rem 0;
              }
            }
          `}</style>
        </div>
      );
    }

    return this.props.children;
  }
}