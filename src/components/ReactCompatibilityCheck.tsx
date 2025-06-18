
import React from 'react';

interface ReactCompatibilityCheckProps {
  children: React.ReactNode;
}

const ReactCompatibilityCheck: React.FC<ReactCompatibilityCheckProps> = ({ children }) => {
  // Verify React hooks are available
  React.useEffect(() => {
    const checks = [
      { name: 'React', value: React },
      { name: 'React.useState', value: React.useState },
      { name: 'React.useRef', value: React.useRef },
      { name: 'React.useContext', value: React.useContext },
      { name: 'React.useEffect', value: React.useEffect },
    ];

    for (const check of checks) {
      if (!check.value) {
        console.error(`React compatibility check failed: ${check.name} is not available`);
        throw new Error(`React compatibility check failed: ${check.name} is not available`);
      }
    }

    console.log('React compatibility check passed');
  }, []);

  return <>{children}</>;
};

export default ReactCompatibilityCheck;
