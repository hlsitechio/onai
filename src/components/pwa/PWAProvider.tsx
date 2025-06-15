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

// Default context value to prevent undefined errors
const defaultContextValue: PWAContextType = {
  isOnline: true,
  isInstalled: false,
  enhancedFeatures: {
    backgroundSync: false,
    pushNotifications: false,
    offlineStorage: false,
    installationAnalytics: false,
    enhancedShare: false,
  },
};

const PWAContext = createContext<PWAContextType>(defaultContextValue);

interface PWAProviderProps {
  children: ReactNode;
}

export const PWAProvider: React.FC<PWAProviderProps> = ({ children }) => {
  const [isOnline, setIsOnline] = useState(() => {
    try {
      return navigator.onLine;
    } catch {
      return true; // Default to online if navigator is not available
    }
  });
  
  const [isInstalled, setIsInstalled] = useState(false);
  const [enhancedFeatures, setEnhancedFeatures] = useState(defaultContextValue.enhancedFeatures);

  useEffect(() => {
    const checkFeatures = () => {
      try {
        const features = {
          backgroundSync: 'serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype,
          pushNotifications: 'serviceWorker' in navigator && 'Notification' in window,
          offlineStorage: 'caches' in window && 'indexedDB' in window,
          installationAnalytics: 'serviceWorker' in navigator,
          enhancedShare: 'share' in navigator || 'canShare' in navigator,
        };
        setEnhancedFeatures(features);
      } catch (error) {
        console.warn('Error checking PWA features:', error);
        // Keep default false values
        setEnhancedFeatures(defaultContextValue.enhancedFeatures);
      }
    };

    const checkInstallationStatus = () => {
      try {
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                            (window.navigator as any).standalone ||
                            document.referrer.includes('android-app://');
        setIsInstalled(isStandalone);
      } catch (error) {
        console.warn('Error checking installation status:', error);
        setIsInstalled(false);
      }
    };

    const handleOnline = () => {
      try {
        setIsOnline(true);
      } catch (error) {
        console.warn('Error handling online event:', error);
      }
    };
    
    const handleOffline = () => {
      try {
        setIsOnline(false);
      } catch (error) {
        console.warn('Error handling offline event:', error);
      }
    };

    // Add event listeners with error handling
    try {
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
    } catch (error) {
      console.warn('Error adding event listeners:', error);
    }

    checkFeatures();
    checkInstallationStatus();

    return () => {
      try {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      } catch (error) {
        console.warn('Error removing event listeners:', error);
      }
    };
  }, []);

  // Ensure value is always defined
  const value: PWAContextType = {
    isOnline: Boolean(isOnline),
    isInstalled: Boolean(isInstalled),
    enhancedFeatures: enhancedFeatures || defaultContextValue.enhancedFeatures,
  };

  return (
    <PWAContext.Provider value={value}>
      {children}
    </PWAContext.Provider>
  );
};

export const usePWA = (): PWAContextType => {
  const context = useContext(PWAContext);
  // Always return a valid context, even if provider is missing
  return context || defaultContextValue;
};
