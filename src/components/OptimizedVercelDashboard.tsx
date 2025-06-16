
import React from 'react';
import LazyLoader from '@/components/LazyLoader';
import { lazyComponents } from '@/utils/bundleOptimization';

const OptimizedVercelDashboard: React.FC = () => {
  return (
    <LazyLoader
      component={lazyComponents.VercelDashboard}
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-[#050510] to-[#0a0518] flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-8 h-8 border-2 border-noteflow-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-white">Loading Vercel Dashboard...</p>
          </div>
        </div>
      }
    />
  );
};

export default OptimizedVercelDashboard;
