
import { useEffect, useState } from 'react';

interface PerformanceMetrics {
  loadTime: number;
  isSlowConnection: boolean;
  memoryUsage?: number;
  cacheEfficiency: number;
}

export function usePWAPerformance() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    loadTime: 0,
    isSlowConnection: false,
    cacheEfficiency: 0,
  });

  useEffect(() => {
    // Measure initial load performance
    const measureLoadTime = () => {
      if ('performance' in window) {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        setMetrics(prev => ({ ...prev, loadTime }));
      }
    };

    // Detect slow connections
    const detectConnection = () => {
      if ('connection' in navigator) {
        const connection = (navigator as any).connection;
        const isSlowConnection = connection?.effectiveType === 'slow-2g' || 
                               connection?.effectiveType === '2g' ||
                               connection?.downlink < 1.5;
        
        setMetrics(prev => ({ ...prev, isSlowConnection }));
      }
    };

    // Memory usage (if available)
    const measureMemory = () => {
      if ('memory' in performance) {
        const memoryInfo = (performance as any).memory;
        const memoryUsage = memoryInfo.usedJSHeapSize / memoryInfo.totalJSHeapSize;
        setMetrics(prev => ({ ...prev, memoryUsage }));
      }
    };

    // Cache efficiency
    const measureCacheEfficiency = async () => {
      if ('caches' in window) {
        try {
          const cacheNames = await caches.keys();
          let totalCached = 0;
          
          for (const cacheName of cacheNames) {
            const cache = await caches.open(cacheName);
            const keys = await cache.keys();
            totalCached += keys.length;
          }
          
          // Simple efficiency metric based on cached resources
          const efficiency = Math.min(totalCached / 50, 1); // Assuming 50 resources as baseline
          setMetrics(prev => ({ ...prev, cacheEfficiency: efficiency }));
        } catch (error) {
          console.error('Error measuring cache efficiency:', error);
        }
      }
    };

    // Run measurements
    measureLoadTime();
    detectConnection();
    measureMemory();
    measureCacheEfficiency();

    // Set up periodic memory monitoring
    const memoryInterval = setInterval(measureMemory, 30000); // Every 30 seconds

    return () => {
      clearInterval(memoryInterval);
    };
  }, []);

  const optimizeForSlowConnection = () => {
    if (metrics.isSlowConnection) {
      // Reduce image quality, defer non-critical resources
      document.documentElement.classList.add('slow-connection');
    }
  };

  return {
    metrics,
    optimizeForSlowConnection,
  };
}
