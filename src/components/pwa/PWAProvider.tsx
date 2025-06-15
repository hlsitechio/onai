
import React, { createContext, useContext, useEffect, useState } from 'react';
import { usePWAStatus } from '@/hooks/usePWAStatus';
import { useToast } from '@/hooks/use-toast';

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
  const [syncStatus, setSyncStatus] = useState({
    pending: 0,
    syncing: false,
  });

  useEffect(() => {
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
    };

    handleShortcuts();
  }, [toast]);

  const contextValue: PWAContextType = {
    isOnline: pwaStatus.isOnline,
    isInstalled: pwaStatus.isInstalled,
    updateAvailable: pwaStatus.updateAvailable,
    canInstall: pwaStatus.canInstall,
    installApp: pwaStatus.installApp,
    requestUpdate: pwaStatus.requestUpdate,
    syncStatus,
  };

  return (
    <PWAContext.Provider value={contextValue}>
      {children}
    </PWAContext.Provider>
  );
};
