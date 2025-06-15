
import { useEffect, useState } from 'react';

interface PWAMetrics {
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
  timeToInteractive: number;
  cacheHitRate: number;
  offlineCapability: boolean;
  installationRate: number;
}

export function usePWAMetrics() {
  const [metrics, setMetrics] = useState<Partial<PWAMetrics>>({});

  useEffect(() => {
    const collectWebVitals = () => {
      // First Contentful Paint
      const fcpEntry = performance.getEntriesByType('paint')
        .find(entry => entry.name === 'first-contentful-paint');
      
      if (fcpEntry) {
        setMetrics(prev => ({ ...prev, firstContentfulPaint: fcpEntry.startTime }));
      }

      // Largest Contentful Paint
      if ('PerformanceObserver' in window) {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          setMetrics(prev => ({ ...prev, largestContentfulPaint: lastEntry.startTime }));
        });
        
        try {
          lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        } catch (error) {
          console.warn('LCP observation not supported:', error);
        }

        // Cumulative Layout Shift
        const clsObserver = new PerformanceObserver((list) => {
          let clsValue = 0;
          for (const entry of list.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              clsValue += (entry as any).value;
            }
          }
          setMetrics(prev => ({ ...prev, cumulativeLayoutShift: clsValue }));
        });
        
        try {
          clsObserver.observe({ entryTypes: ['layout-shift'] });
        } catch (error) {
          console.warn('CLS observation not supported:', error);
        }

        // First Input Delay
        const fidObserver = new PerformanceObserver((list) => {
          const firstInput = list.getEntries()[0];
          if (firstInput) {
            const fid = (firstInput as any).processingStart - firstInput.startTime;
            setMetrics(prev => ({ ...prev, firstInputDelay: fid }));
          }
        });
        
        try {
          fidObserver.observe({ entryTypes: ['first-input'] });
        } catch (error) {
          console.warn('FID observation not supported:', error);
        }
      }
    };

    const measureCacheEfficiency = async () => {
      if ('caches' in window && 'serviceWorker' in navigator) {
        try {
          const cacheNames = await caches.keys();
          let totalRequests = 0;
          let cachedRequests = 0;

          for (const cacheName of cacheNames) {
            const cache = await caches.open(cacheName);
            const keys = await cache.keys();
            cachedRequests += keys.length;
          }

          // Estimate total requests from performance entries
          const navigationEntries = performance.getEntriesByType('navigation');
          const resourceEntries = performance.getEntriesByType('resource');
          totalRequests = navigationEntries.length + resourceEntries.length;

          const cacheHitRate = totalRequests > 0 ? (cachedRequests / totalRequests) * 100 : 0;
          setMetrics(prev => ({ ...prev, cacheHitRate }));
        } catch (error) {
          console.warn('Cache efficiency measurement failed:', error);
        }
      }
    };

    const checkOfflineCapability = () => {
      const hasServiceWorker = 'serviceWorker' in navigator;
      const hasCacheAPI = 'caches' in window;
      const hasIndexedDB = 'indexedDB' in window;
      
      const offlineCapability = hasServiceWorker && hasCacheAPI && hasIndexedDB;
      setMetrics(prev => ({ ...prev, offlineCapability }));
    };

    const measureTimeToInteractive = () => {
      // Simple TTI approximation
      window.addEventListener('load', () => {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        setMetrics(prev => ({ ...prev, timeToInteractive: loadTime }));
      });
    };

    const trackInstallation = () => {
      // Track installation events
      let installPromptShown = false;
      let installCompleted = false;

      window.addEventListener('beforeinstallprompt', () => {
        installPromptShown = true;
      });

      window.addEventListener('appinstalled', () => {
        installCompleted = true;
        const installationRate = installCompleted && installPromptShown ? 100 : 0;
        setMetrics(prev => ({ ...prev, installationRate }));
      });
    };

    // Initialize all measurements
    collectWebVitals();
    measureCacheEfficiency();
    checkOfflineCapability();
    measureTimeToInteractive();
    trackInstallation();

    // Set up periodic monitoring
    const metricsInterval = setInterval(() => {
      measureCacheEfficiency();
    }, 30000); // Every 30 seconds

    return () => {
      clearInterval(metricsInterval);
    };
  }, []);

  const sendMetricsToAnalytics = () => {
    // Send metrics to analytics service
    if (window.gtag) {
      Object.entries(metrics).forEach(([key, value]) => {
        window.gtag('event', 'pwa_metric', {
          metric_name: key,
          metric_value: value,
          custom_parameter: 'pwa_performance'
        });
      });
    }

    // Also log to console for debugging
    console.log('PWA Metrics:', metrics);
  };

  return {
    metrics,
    sendMetricsToAnalytics,
  };
}
