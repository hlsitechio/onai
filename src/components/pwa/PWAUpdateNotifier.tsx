
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Download, RefreshCw } from 'lucide-react';

interface ServiceWorkerUpdateState {
  updateAvailable: boolean;
  registration: ServiceWorkerRegistration | null;
}

const PWAUpdateNotifier: React.FC = () => {
  const [updateState, setUpdateState] = useState<ServiceWorkerUpdateState>({
    updateAvailable: false,
    registration: null,
  });

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    const handleServiceWorkerUpdate = (registration: ServiceWorkerRegistration) => {
      const newWorker = registration.installing;
      
      if (newWorker) {
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            setUpdateState({
              updateAvailable: true,
              registration,
            });

            // Show persistent toast notification
            toast.info('New version available!', {
              description: 'Click to update and get the latest features.',
              duration: Infinity,
              action: {
                label: 'Update Now',
                onClick: () => handleUpdate(registration),
              },
            });
          }
        });
      }
    };

    // Check for existing registration
    navigator.serviceWorker.getRegistration().then(registration => {
      if (registration) {
        // Check for updates immediately
        registration.update();
        
        // Listen for updates
        registration.addEventListener('updatefound', () => {
          handleServiceWorkerUpdate(registration);
        });

        // Periodic update checks
        setInterval(() => {
          registration.update();
        }, 60000); // Check every minute
      }
    });

    // Listen for messages from service worker
    navigator.serviceWorker.addEventListener('message', (event) => {
      if (event.data?.type === 'UPDATE_AVAILABLE') {
        setUpdateState({
          updateAvailable: true,
          registration: event.data.registration,
        });
      }
    });

  }, []);

  const handleUpdate = (registration: ServiceWorkerRegistration) => {
    if (registration?.waiting) {
      // Tell the waiting service worker to skip waiting
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      
      // Reload the page to activate the new service worker
      window.location.reload();
    }
  };

  const handleDismiss = () => {
    setUpdateState(prev => ({ ...prev, updateAvailable: false }));
    toast.dismiss();
  };

  if (!updateState.updateAvailable) return null;

  return (
    <div className="fixed top-4 right-4 z-50 bg-background border rounded-lg shadow-lg p-4 max-w-sm">
      <div className="flex items-start gap-3">
        <Download className="h-5 w-5 text-blue-500 mt-0.5" />
        <div className="flex-1">
          <h4 className="font-semibold text-sm">Update Available</h4>
          <p className="text-xs text-muted-foreground mt-1">
            A new version of OneAI Notes is ready. Update now to get the latest features and improvements.
          </p>
          <div className="flex gap-2 mt-3">
            <Button 
              size="sm" 
              onClick={() => handleUpdate(updateState.registration!)}
              className="h-8 px-3 text-xs"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Update Now
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={handleDismiss}
              className="h-8 px-3 text-xs"
            >
              Later
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PWAUpdateNotifier;
