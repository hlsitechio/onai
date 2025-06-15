
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface PWAStatus {
  isOnline: boolean;
  isInstalled: boolean;
  isStandalone: boolean;
  updateAvailable: boolean;
  canInstall: boolean;
}

export function usePWAStatus() {
  const [status, setStatus] = useState<PWAStatus>({
    isOnline: navigator.onLine,
    isInstalled: false,
    isStandalone: false,
    updateAvailable: false,
    canInstall: false,
  });
  
  const { toast } = useToast();

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
      setStatus(prev => ({ ...prev, isOnline: navigator.onLine }));
      
      if (navigator.onLine) {
        toast({
          title: "Connection Restored",
          description: "You're back online! Syncing your notes...",
        });
      } else {
        toast({
          title: "Working Offline",
          description: "Your notes will sync when connection returns.",
          variant: "destructive",
        });
      }
    };

    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);

    // Service worker update detection
    const handleServiceWorkerUpdate = () => {
      setStatus(prev => ({ ...prev, updateAvailable: true }));
      
      toast({
        title: "Update Available",
        description: "A new version is ready. Refresh to update.",
        action: (
          <button 
            onClick={() => window.location.reload()}
            className="bg-noteflow-500 text-white px-3 py-1 rounded text-sm"
          >
            Refresh
          </button>
        ),
      });
    };

    // Install prompt detection
    const handleInstallPrompt = () => {
      setStatus(prev => ({ ...prev, canInstall: true }));
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
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    }

    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
      window.removeEventListener('beforeinstallprompt', handleInstallPrompt);
    };
  }, [toast]);

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
    // This would be called from the install prompt component
    return Promise.resolve();
  };

  return {
    ...status,
    requestUpdate,
    installApp,
  };
}
