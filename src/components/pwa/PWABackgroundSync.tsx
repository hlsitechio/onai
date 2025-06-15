
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { RotateCw as Sync } from 'lucide-react';
import { SyncItem } from './types/SyncTypes';
import { createSyncItem, saveSyncQueue, loadSyncQueue, processSyncItem } from './utils/SyncUtils';
import ConnectionStatus from './components/ConnectionStatus';
import QueueStats from './components/QueueStats';
import QueueList from './components/QueueList';
import SyncActions from './components/SyncActions';

const PWABackgroundSync: React.FC = () => {
  const [syncQueue, setSyncQueue] = useState<SyncItem[]>([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    // Load initial sync queue
    const initialQueue = loadSyncQueue();
    setSyncQueue(initialQueue);
    
    const handleOnline = () => {
      setIsOnline(true);
      processSyncQueue();
    };
    
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Process queue when component mounts if online
    if (navigator.onLine && initialQueue.length > 0) {
      processSyncQueue();
    }
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const addToSyncQueue = (type: string, data: any) => {
    const newItem = createSyncItem(type, data);
    const updatedQueue = [...syncQueue, newItem];
    
    setSyncQueue(updatedQueue);
    saveSyncQueue(updatedQueue);
    
    // Try to sync immediately if online
    if (isOnline) {
      processSyncQueue();
    }
  };

  const processSyncQueue = async () => {
    if (isSyncing || !isOnline) return;
    
    setIsSyncing(true);
    const pendingItems = syncQueue.filter(item => item.status === 'pending' || item.status === 'failed');
    
    if (pendingItems.length === 0) {
      setIsSyncing(false);
      return;
    }

    const updatedQueue = [...syncQueue];
    
    for (const item of pendingItems) {
      try {
        // Update status to syncing
        const itemIndex = updatedQueue.findIndex(q => q.id === item.id);
        if (itemIndex !== -1) {
          updatedQueue[itemIndex].status = 'syncing';
          setSyncQueue([...updatedQueue]);
        }
        
        // Process the sync item
        await processSyncItem(item);
        
        // Mark as completed
        if (itemIndex !== -1) {
          updatedQueue[itemIndex].status = 'completed';
        }
        
      } catch (error) {
        console.error('Sync failed for item:', item.id, error);
        
        const itemIndex = updatedQueue.findIndex(q => q.id === item.id);
        if (itemIndex !== -1) {
          updatedQueue[itemIndex].status = 'failed';
          updatedQueue[itemIndex].retryCount += 1;
          
          // Remove from queue if too many retries
          if (updatedQueue[itemIndex].retryCount >= 3) {
            updatedQueue.splice(itemIndex, 1);
            toast.error(`Failed to sync ${item.type} after 3 attempts`);
          }
        }
      }
    }
    
    setSyncQueue(updatedQueue);
    saveSyncQueue(updatedQueue);
    setIsSyncing(false);
    
    // Show sync completion toast
    const completedCount = updatedQueue.filter(item => item.status === 'completed').length;
    if (completedCount > 0) {
      toast.success(`Synced ${completedCount} items successfully`);
      
      // Clean up completed items after a delay
      setTimeout(() => {
        const cleanedQueue = updatedQueue.filter(item => item.status !== 'completed');
        setSyncQueue(cleanedQueue);
        saveSyncQueue(cleanedQueue);
      }, 5000);
    }
  };

  const clearCompletedItems = () => {
    const filtered = syncQueue.filter(item => item.status !== 'completed');
    setSyncQueue(filtered);
    saveSyncQueue(filtered);
  };

  const retryFailedItems = () => {
    const updatedQueue = syncQueue.map(item => 
      item.status === 'failed' ? { ...item, status: 'pending' as const, retryCount: 0 } : item
    );
    setSyncQueue(updatedQueue);
    saveSyncQueue(updatedQueue);
    
    if (isOnline) {
      processSyncQueue();
    }
  };

  // Expose addToSyncQueue globally for other components
  useEffect(() => {
    (window as any).addToSyncQueue = addToSyncQueue;
  }, [syncQueue]);

  const hasFailedItems = syncQueue.some(item => item.status === 'failed');
  const hasCompletedItems = syncQueue.some(item => item.status === 'completed');

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sync className="h-5 w-5" />
          Background Sync
        </CardTitle>
        <CardDescription>
          Manage data synchronization
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ConnectionStatus isOnline={isOnline} />
        
        <QueueStats syncQueue={syncQueue} />
        
        <QueueList syncQueue={syncQueue} />

        <SyncActions
          isOnline={isOnline}
          isSyncing={isSyncing}
          hasFailedItems={hasFailedItems}
          hasCompletedItems={hasCompletedItems}
          onSyncNow={processSyncQueue}
          onRetryFailed={retryFailedItems}
          onClearCompleted={clearCompletedItems}
        />
      </CardContent>
    </Card>
  );
};

export default PWABackgroundSync;
