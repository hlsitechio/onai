
import React from 'react';
import { useAppInitialization } from '@/hooks/useAppInitialization';
import { Loader2 } from 'lucide-react';

interface AppInitializerProps {
  children: React.ReactNode;
}

const AppInitializer: React.FC<AppInitializerProps> = ({ children }) => {
  const { isInitialized, isLoading, hasError } = useAppInitialization();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-white mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">OneAI Notes</h2>
          <p className="text-purple-200">Initializing your workspace...</p>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-red-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Initialization Failed</h2>
          <p className="text-red-200 mb-6">
            There was an error starting the application. Please refresh the page or try again later.
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-white text-red-900 px-6 py-2 rounded-lg font-semibold hover:bg-red-50 transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  if (!isInitialized) {
    return null;
  }

  return <>{children}</>;
};

export default AppInitializer;
