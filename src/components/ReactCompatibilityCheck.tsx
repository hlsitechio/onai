
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface ReactCompatibilityCheckProps {
  children: React.ReactNode;
}

interface ReactCompatibilityCheckState {
  isReactReady: boolean;
  error: string | null;
  hasError: boolean;
}

class ReactCompatibilityCheck extends Component<ReactCompatibilityCheckProps, ReactCompatibilityCheckState> {
  constructor(props: ReactCompatibilityCheckProps) {
    super(props);
    this.state = {
      isReactReady: false,
      error: null,
      hasError: false
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ReactCompatibilityCheckState> {
    return { hasError: true, error: error.message };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Silently handle errors - they'll be sent to Sentry via our error reporting
  }

  componentDidMount() {
    this.performCompatibilityCheck();
  }

  performCompatibilityCheck = () => {
    try {
      // Silently check React availability without console spam
      if (typeof React !== 'object' || !React) {
        throw new Error('React is not available');
      }

      if (typeof React.createElement !== 'function') {
        throw new Error('React.createElement is not available');
      }
      
      if (typeof React.Component !== 'function') {
        throw new Error('React.Component is not available');
      }

      if (typeof React.useState !== 'function') {
        throw new Error('React.useState is not available');
      }

      if (typeof React.useEffect !== 'function') {
        throw new Error('React.useEffect is not available');
      }

      if (typeof React.useContext !== 'function') {
        throw new Error('React.useContext is not available');
      }

      // React is ready - no console spam
      this.setState({ isReactReady: true, error: null });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown React compatibility error';
      this.setState({ error: errorMessage, isReactReady: false });
    }
  };

  handleRefresh = () => {
    window.location.reload();
  };

  render() {
    const { children } = this.props;
    const { isReactReady, error, hasError } = this.state;

    if (hasError || error) {
      return (
        <div style={{
          padding: '20px',
          margin: '20px',
          backgroundColor: '#1a1a1a',
          color: '#ff6b6b',
          fontFamily: 'monospace',
          border: '1px solid #ff6b6b',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h2>React Compatibility Error</h2>
          <p>{error}</p>
          <p>Please refresh the page to retry.</p>
          <button
            onClick={this.handleRefresh}
            style={{
              marginTop: '10px',
              padding: '8px 16px',
              backgroundColor: '#ff6b6b',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Refresh Page
          </button>
        </div>
      );
    }

    if (!isReactReady) {
      return (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          backgroundColor: '#0a0a0a',
          color: '#fff',
          fontFamily: 'monospace'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '4px solid #333',
              borderTop: '4px solid #60a5fa',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 16px'
            }} />
            <p>Initializing...</p>
          </div>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      );
    }

    return <>{children}</>;
  }
}

export default ReactCompatibilityCheck;
