
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface PWAContextType {
  isOnline: boolean;
  isInstalled: boolean;
  enhancedFeatures: {
    backgroundSync: boolean;
    pushNotifications: boolean;
    offlineStorage: boolean;
    installationAnalytics: boolean;
    enhancedShare: boolean;
  };
}

const PWAContext = createContext<PWAContextType | undefined>(undefined);

interface PWAProviderProps {
  children: ReactNode;
}

export const PWAProvider: React.FC<PWAProviderProps> = ({ children }) => {
  // Always call hooks at the top level
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isInstalled, setIsInstalled] = useState(false);
  const [enhancedFeatures, setEnhancedFeatures] = useState({
    backgroundSync: false,
    pushNotifications: false,
    offlineStorage: false,
    installationAnalytics: false,
    enhancedShare: false,
  });

  useEffect(() => {
    // Check for enhanced features
    const checkFeatures = () => {
      const features = {
        backgroundSync: 'serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype,
        pushNotifications: 'serviceWorker' in navigator && 'Notification' in window,
        offlineStorage: 'caches' in window && 'indexedDB' in window,
        installationAnalytics: 'serviceWorker' in navigator,
        enhancedShare: 'share' in navigator || 'canShare' in navigator,
      };
      setEnhancedFeatures(features);
    };

    // Check installation status
    const checkInstallationStatus = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                          (window.navigator as any).standalone ||
                          document.referrer.includes('android-app://');
      setIsInstalled(isStandalone);
    };

    // Set up online/offline listeners
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial checks
    checkFeatures();
    checkInstallationStatus();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const value: PWAContextType = {
    isOnline,
    isInstalled,
    enhancedFeatures,
  };

  return (
    <PWAContext.Provider value={value}>
      {children}
    </PWAContext.Provider>
  );
};

export const usePWA = (): PWAContextType => {
  const context = useContext(PWAContext);
  if (context === undefined) {
    throw new Error('usePWA must be used within a PWAProvider');
  }
  return context;
};
