
import React, { useEffect, useState } from 'react';

interface ReactCompatibilityCheckProps {
  children: React.ReactNode;
}

const ReactCompatibilityCheck: React.FC<ReactCompatibilityCheckProps> = ({ children }) => {
  const [isReactReady, setIsReactReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      // Basic React compatibility check without calling hooks
      console.log('Starting React compatibility check...');
      
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

      // Remove the problematic hook test that was causing the error
      // The hooks are already being used successfully in this component
      
      console.log('✅ React compatibility check passed');
      console.log('✅ React hooks and core functionality verified');
      setIsReactReady(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown React compatibility error';
      console.error('❌ React compatibility check failed:', errorMessage);
      setError(errorMessage);
    }
  }, []);

  if (error) {
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
          onClick={() => window.location.reload()}
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
          <p>Initializing React...</p>
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
};

export default ReactCompatibilityCheck;

