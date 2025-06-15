
import React, { createContext, useContext, useEffect, useState } from 'react';
import { usePWAStatus } from '@/hooks/usePWAStatus';
import { usePWAMetrics } from '@/hooks/usePWAMetrics';
import { useToast } from '@/hooks/use-toast';
import { offlineStorage } from './utils/OfflineStorage';

interface PWAContextType {
  isOnline: boolean;
  isInstalled: boolean;
  updateAvailable: boolean;
  canInstall: boolean;
  installApp: () => Promise<void>;
  requestUpdate: () => void;
  syncStatus: {
    pending: number;
    syncing: boolean;
  };
  metrics: any;
  sendMetricsToAnalytics: () => void;
  offlineStorage: typeof offlineStorage;
  enhancedFeatures: {
    backgroundSync: boolean;
    pushNotifications: boolean;
    offlineStorage: boolean;
    installationAnalytics: boolean;
    enhancedShare: boolean;
  };
}

const PWAContext = createContext<PWAContextType | null>(null);

export const usePWA = () => {
  const context = useContext(PWAContext);
  if (!context) {
    throw new Error('usePWA must be used within PWAProvider');
  }
  return context;
};

interface PWAProviderProps {
  children: React.ReactNode;
}

export const PWAProvider: React.FC<PWAProviderProps> = ({ children }) => {
  const { toast } = useToast();
  const pwaStatus = usePWAStatus();
  const { metrics, sendMetricsToAnalytics } = usePWAMetrics();
  const [syncStatus, setSyncStatus] = useState({
    pending: 0,
    syncing: false,
  });

  // Enhanced features availability
  const [enhancedFeatures] = useState({
    backgroundSync: 'serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype,
    pushNotifications: 'PushManager' in window && 'Notification' in window,
    offlineStorage: 'indexedDB' in window,
    installationAnalytics: 'localStorage' in window,
    enhancedShare: 'share' in navigator || 'clipboard' in navigator,
  });

  useEffect(() => {
    // Initialize offline storage
    offlineStorage.initialize().catch(error => {
      console.error('Failed to initialize offline storage:', error);
    });

    // Listen for service worker messages
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        const { type, data } = event.data;
        
        switch (type) {
          case 'SYNC_COMPLETED':
            setSyncStatus(prev => ({ ...prev, syncing: false }));
            toast({
              title: 'Sync Complete',
              description: `${data.count} notes synced successfully.`,
            });
            break;
            
          case 'CONNECTIVITY_RESTORED':
            toast({
              title: 'Connection Restored',
              description: 'Your notes are being synced.',
            });
            break;

          case 'CACHE_ERROR':
            console.warn('Service worker cache error:', data);
            break;

          case 'NETWORK_ERROR':
            toast({
              title: 'Network Issue',
              description: 'Some features may be limited while offline.',
              variant: 'destructive',
            });
            break;

          case 'STORAGE_QUOTA_EXCEEDED':
            toast({
              title: 'Storage Full',
              description: 'Please clear some data to continue.',
              variant: 'destructive',
            });
            break;

          case 'BACKGROUND_SYNC_REGISTERED':
            setSyncStatus(prev => ({ ...prev, pending: prev.pending + 1 }));
            break;

          case 'BACKGROUND_SYNC_COMPLETED':
            setSyncStatus(prev => ({ 
              ...prev, 
              pending: Math.max(0, prev.pending - 1),
              syncing: false 
            }));
            break;
            
          default:
            break;
        }
      });
    }

    // Handle app shortcuts from manifest
    const handleShortcuts = () => {
      const urlParams = new URLSearchParams(window.location.search);
      
      if (urlParams.get('new') === 'true') {
        // Handle new note shortcut
        const event = new CustomEvent('pwa:new-note');
        window.dispatchEvent(event);
      }
      
      if (urlParams.get('ai') === 'true') {
        // Handle AI assistant shortcut
        const event = new CustomEvent('pwa:open-ai');
        window.dispatchEvent(event);
      }

      if (urlParams.get('share') === 'true') {
        // Handle share shortcut
        const event = new CustomEvent('pwa:open-share');
        window.dispatchEvent(event);
      }
    };

    handleShortcuts();

    // Send metrics to analytics periodically
    const metricsInterval = setInterval(() => {
      if (Object.keys(metrics).length > 0) {
        sendMetricsToAnalytics();
      }
    }, 60000); // Every minute

    // Monitor storage usage
    const storageInterval = setInterval(async () => {
      try {
        const usage = await offlineStorage.getStorageUsage();
        if (usage.quota > 0 && usage.used / usage.quota > 0.9) {
          toast({
            title: 'Storage Almost Full',
            description: 'Consider clearing old data to free up space.',
            variant: 'destructive',
          });
        }
      } catch (error) {
        console.warn('Failed to check storage usage:', error);
      }
    }, 300000); // Every 5 minutes

    return () => {
      clearInterval(metricsInterval);
      clearInterval(storageInterval);
    };
  }, [toast, metrics, sendMetricsToAnalytics]);

  const contextValue: PWAContextType = {
    isOnline: pwaStatus.isOnline,
    isInstalled: pwaStatus.isInstalled,
    updateAvailable: pwaStatus.updateAvailable,
    canInstall: pwaStatus.canInstall,
    installApp: pwaStatus.installApp,
    requestUpdate: pwaStatus.requestUpdate,
    syncStatus,
    metrics,
    sendMetricsToAnalytics,
    offlineStorage,
    enhancedFeatures,
  };

  return (
    <PWAContext.Provider value={contextValue}>
      {children}
    </PWAContext.Provider>
  );
};
