
import React, { Suspense, lazy } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface LazyLoaderProps {
  component: () => Promise<{ default: React.ComponentType<any> }>;
  fallback?: React.ReactNode;
  props?: any;
}

const LazyLoader: React.FC<LazyLoaderProps> = ({ 
  component, 
  fallback,
  props = {} 
}) => {
  const LazyComponent = lazy(component);
  
  const defaultFallback = (
    <div className="space-y-4 p-4">
      <Skeleton className="h-8 w-64 bg-white/10" />
      <Skeleton className="h-32 w-full bg-white/10" />
      <Skeleton className="h-4 w-48 bg-white/10" />
    </div>
  );
  
  return (
    <Suspense fallback={fallback || defaultFallback}>
      <LazyComponent {...props} />
    </Suspense>
  );
};

export default LazyLoader;
