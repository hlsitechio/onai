
import { useState, useEffect, useCallback } from 'react';
import { createSyncItem, saveSyncQueue, loadSyncQueue, processSyncItem } from '../utils/SyncUtils';
import { SyncItem } from '../types/SyncTypes';

export function usePWASync() {
  const [syncQueue, setSyncQueue] = useState<SyncItem[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    // Load existing sync queue on mount
    const savedQueue = loadSyncQueue();
    setSyncQueue(savedQueue);
    
    // Process pending items if online
    if (navigator.onLine && savedQueue.length > 0) {
      processPendingItems(savedQueue);
    }
  }, []);

  const addToSyncQueue = useCallback((type: string, data: any) => {
    const syncItem = createSyncItem(type, data);
    
    setSyncQueue(prev => {
      const newQueue = [...prev, syncItem];
      saveSyncQueue(newQueue);
      return newQueue;
    });

    // Try to process immediately if online
    if (navigator.onLine) {
      processSyncItem(syncItem).then(() => {
        markItemAsCompleted(syncItem.id);
      }).catch(() => {
        markItemAsFailed(syncItem.id);
      });
    } else {
      // Register background sync
      if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
        navigator.serviceWorker.ready.then((registration) => {
          registration.sync.register('sync-notes');
        });
      }
    }
  }, []);

  const processPendingItems = useCallback(async (queue: SyncItem[]) => {
    if (isSyncing) return;
    
    setIsSyncing(true);
    const pendingItems = queue.filter(item => item.status === 'pending');
    
    for (const item of pendingItems) {
      try {
        await processSyncItem(item);
        markItemAsCompleted(item.id);
      } catch (error) {
        markItemAsFailed(item.id);
      }
    }
    
    setIsSyncing(false);
  }, [isSyncing]);

  const markItemAsCompleted = useCallback((itemId: string) => {
    setSyncQueue(prev => {
      const newQueue = prev.map(item => 
        item.id === itemId 
          ? { ...item, status: 'completed' as const }
          : item
      );
      saveSyncQueue(newQueue);
      return newQueue;
    });
  }, []);

  const markItemAsFailed = useCallback((itemId: string) => {
    setSyncQueue(prev => {
      const newQueue = prev.map(item => 
        item.id === itemId 
          ? { ...item, status: 'failed' as const, retryCount: item.retryCount + 1 }
          : item
      );
      saveSyncQueue(newQueue);
      return newQueue;
    });
  }, []);

  const clearCompletedItems = useCallback(() => {
    setSyncQueue(prev => {
      const newQueue = prev.filter(item => item.status !== 'completed');
      saveSyncQueue(newQueue);
      return newQueue;
    });
  }, []);

  // Listen for online events to process pending items
  useEffect(() => {
    const handleOnline = () => {
      if (syncQueue.length > 0) {
        processPendingItems(syncQueue);
      }
    };

    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, [syncQueue, processPendingItems]);

  return {
    syncQueue,
    isSyncing,
    addToSyncQueue,
    clearCompletedItems,
    processPendingItems: () => processPendingItems(syncQueue),
  };
}
