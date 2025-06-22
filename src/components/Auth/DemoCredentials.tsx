
import React from 'react';

const DemoCredentials: React.FC = () => {
  return (
    <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
      <p className="text-sm text-blue-800 dark:text-blue-200 font-medium mb-2">
        Demo Credentials
      </p>
      <p className="text-xs text-blue-600 dark:text-blue-300">
        Email: demo@example.com<br />
        Password: password
      </p>
    </div>
  );
};

export default DemoCredentials;
