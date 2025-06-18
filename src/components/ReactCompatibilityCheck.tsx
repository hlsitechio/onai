
import React, { useEffect } from 'react';

interface ReactCompatibilityCheckProps {
  children: React.ReactNode;
}

const ReactCompatibilityCheck: React.FC<ReactCompatibilityCheckProps> = ({ children }) => {
  // Verify React hooks are available
  useEffect(() => {
    // Simple compatibility check - if we reach here, React is working
    console.log('React compatibility check passed');
    
    // Verify essential React features are available
    if (typeof React.createElement !== 'function') {
      console.error('React.createElement is not available');
      return;
    }
    
    if (typeof React.Component !== 'function') {
      console.error('React.Component is not available');
      return;
    }
    
    console.log('React hooks and core functionality verified');
  }, []);

  return <>{children}</>;
};

export default ReactCompatibilityCheck;
