
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { usePWAPerformance } from './usePWAPerformance';

interface PWAStatus {
  isOnline: boolean;
  isInstalled: boolean;
  isStandalone: boolean;
  updateAvailable: boolean;
  canInstall: boolean;
  performance: any;
}

export function usePWAStatus() {
  const [status, setStatus] = useState<PWAStatus>({
    isOnline: navigator.onLine,
    isInstalled: false,
    isStandalone: false,
    updateAvailable: false,
    canInstall: false,
    performance: null,
  });
  
  const { metrics, preloadCriticalResources, optimizeForSlowConnection } = usePWAPerformance();

  useEffect(() => {
    // Update performance in status
    setStatus(prev => ({ ...prev, performance: metrics }));
  }, [metrics]);

  useEffect(() => {
    // Check installation status
    const checkInstallStatus = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                          (window.navigator as any).standalone ||
                          document.referrer.includes('android-app://');
      
      setStatus(prev => ({
        ...prev,
        isStandalone,
        isInstalled: isStandalone,
      }));
    };

    checkInstallStatus();

    // Online/offline listeners
    const handleOnlineStatus = () => {
      const isOnline = navigator.onLine;
      setStatus(prev => ({ ...prev, isOnline }));
      
      if (isOnline) {
        toast.success('Connection Restored', {
          description: 'You\'re back online! Syncing your notes...',
        });
        
        // Trigger background sync if available
        if ('addToSyncQueue' in window) {
          (window as any).addToSyncQueue('connectivity-restored', { timestamp: Date.now() });
        }
      } else {
        toast.warning('Working Offline', {
          description: 'Your notes will sync when connection returns.',
        });
      }
    };

    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);

    // Service worker update detection
    const handleServiceWorkerUpdate = () => {
      setStatus(prev => ({ ...prev, updateAvailable: true }));
    };

    // Install prompt detection
    const handleInstallPrompt = (e: Event) => {
      e.preventDefault();
      setStatus(prev => ({ ...prev, canInstall: true }));
      
      // Store the event for later use
      (window as any).deferredPrompt = e;
      
      toast.info('App Installation Available', {
        description: 'Install OneAI Notes for the best experience.',
        action: {
          label: 'Install',
          onClick: () => installApp(),
        },
      });
    };

    window.addEventListener('beforeinstallprompt', handleInstallPrompt);
    
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered:', registration);
          
          // Check for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  handleServiceWorkerUpdate();
                }
              });
            }
          });
          
          // Periodic update checks
          setInterval(() => {
            registration.update();
          }, 60000); // Check every minute
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    }

    // Performance optimizations
    if (metrics.isSlowConnection) {
      optimizeForSlowConnection();
    }

    // Preload critical resources
    preloadCriticalResources([
      '/lovable-uploads/8a54ca4d-f005-4821-b9d8-3fd2958d340b.png',
      '/manifest.json',
    ]);

    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
      window.removeEventListener('beforeinstallprompt', handleInstallPrompt);
    };
  }, [metrics, optimizeForSlowConnection, preloadCriticalResources]);

  const requestUpdate = () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then((registration) => {
        if (registration) {
          registration.update();
        }
      });
    }
  };

  const installApp = async () => {
    const deferredPrompt = (window as any).deferredPrompt;
    
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        toast.success('App Installed Successfully');
        setStatus(prev => ({ ...prev, canInstall: false, isInstalled: true }));
      } else {
        toast.info('Installation Cancelled');
      }
      
      (window as any).deferredPrompt = null;
    }
    
    return Promise.resolve();
  };

  return {
    ...status,
    requestUpdate,
    installApp,
  };
}
