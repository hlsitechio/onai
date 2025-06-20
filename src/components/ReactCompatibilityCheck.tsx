
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface ReactCompatibilityCheckProps {
  children: React.ReactNode;
}

interface ReactCompatibilityCheckState {
  hasError: boolean;
  error: string | null;
}

class ReactCompatibilityCheck extends Component<ReactCompatibilityCheckProps, ReactCompatibilityCheckState> {
  constructor(props: ReactCompatibilityCheckProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ReactCompatibilityCheckState> {
    return { hasError: true, error: error.message };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('React error caught:', error, errorInfo);
  }

  handleRefresh = () => {
    window.location.reload();
  };

  render() {
    const { children } = this.props;
    const { hasError, error } = this.state;

    if (hasError) {
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
          <h2>Application Error</h2>
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

    return <>{children}</>;
  }
}

export default ReactCompatibilityCheck;
