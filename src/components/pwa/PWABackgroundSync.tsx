import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { RotateCw as Sync, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface SyncItem {
  id: string;
  type: string;
  data: any;
  timestamp: number;
  status: 'pending' | 'syncing' | 'completed' | 'failed';
  retryCount: number;
}

const PWABackgroundSync: React.FC = () => {
  const [syncQueue, setSyncQueue] = useState<SyncItem[]>([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    loadSyncQueue();
    
    const handleOnline = () => {
      setIsOnline(true);
      processSyncQueue();
    };
    
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Process queue when component mounts if online
    if (navigator.onLine) {
      processSyncQueue();
    }
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const loadSyncQueue = () => {
    try {
      const stored = localStorage.getItem('oneai-sync-queue');
      if (stored) {
        setSyncQueue(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading sync queue:', error);
    }
  };

  const saveSyncQueue = (queue: SyncItem[]) => {
    try {
      localStorage.setItem('oneai-sync-queue', JSON.stringify(queue));
      setSyncQueue(queue);
    } catch (error) {
      console.error('Error saving sync queue:', error);
    }
  };

  const addToSyncQueue = (type: string, data: any) => {
    const newItem: SyncItem = {
      id: `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      data,
      timestamp: Date.now(),
      status: 'pending',
      retryCount: 0,
    };
    
    const updatedQueue = [...syncQueue, newItem];
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
        
        // Process the sync item based on type
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
    
    saveSyncQueue(updatedQueue);
    setIsSyncing(false);
    
    // Show sync completion toast
    const completedCount = updatedQueue.filter(item => item.status === 'completed').length;
    if (completedCount > 0) {
      toast.success(`Synced ${completedCount} items successfully`);
      
      // Clean up completed items after a delay
      setTimeout(() => {
        const cleanedQueue = updatedQueue.filter(item => item.status !== 'completed');
        saveSyncQueue(cleanedQueue);
      }, 5000);
    }
  };

  const processSyncItem = async (item: SyncItem): Promise<void> => {
    switch (item.type) {
      case 'note-save':
        // Simulate note saving
        await new Promise(resolve => setTimeout(resolve, 1000));
        break;
      case 'note-delete':
        // Simulate note deletion
        await new Promise(resolve => setTimeout(resolve, 500));
        break;
      case 'settings-update':
        // Simulate settings update
        await new Promise(resolve => setTimeout(resolve, 300));
        break;
      default:
        throw new Error(`Unknown sync type: ${item.type}`);
    }
  };

  const clearCompletedItems = () => {
    const filtered = syncQueue.filter(item => item.status !== 'completed');
    saveSyncQueue(filtered);
  };

  const retryFailedItems = () => {
    const updatedQueue = syncQueue.map(item => 
      item.status === 'failed' ? { ...item, status: 'pending' as const, retryCount: 0 } : item
    );
    saveSyncQueue(updatedQueue);
    
    if (isOnline) {
      processSyncQueue();
    }
  };

  const getStatusIcon = (status: SyncItem['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'syncing':
        return <Sync className="h-4 w-4 animate-spin" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: SyncItem['status']) => {
    switch (status) {
      case 'pending':
        return 'secondary';
      case 'syncing':
        return 'default';
      case 'completed':
        return 'default';
      case 'failed':
        return 'destructive';
    }
  };

  // Expose addToSyncQueue globally for other components
  useEffect(() => {
    (window as any).addToSyncQueue = addToSyncQueue;
  }, [syncQueue]);

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sync className="h-5 w-5" />
          Background Sync
        </CardTitle>
        <CardDescription>
          Manage offline data synchronization
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Status</span>
          <Badge variant={isOnline ? 'default' : 'secondary'}>
            {isOnline ? 'Online' : 'Offline'}
          </Badge>
        </div>

        {/* Queue Stats */}
        <div className="grid grid-cols-3 gap-2 text-sm">
          <div className="text-center">
            <p className="font-medium">{syncQueue.filter(item => item.status === 'pending').length}</p>
            <p className="text-muted-foreground">Pending</p>
          </div>
          <div className="text-center">
            <p className="font-medium">{syncQueue.filter(item => item.status === 'completed').length}</p>
            <p className="text-muted-foreground">Completed</p>
          </div>
          <div className="text-center">
            <p className="font-medium">{syncQueue.filter(item => item.status === 'failed').length}</p>
            <p className="text-muted-foreground">Failed</p>
          </div>
        </div>

        {/* Queue Items */}
        {syncQueue.length > 0 && (
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {syncQueue.slice(-5).map((item) => (
              <div key={item.id} className="flex items-center gap-2 p-2 bg-muted/30 rounded">
                {getStatusIcon(item.status)}
                <span className="text-sm flex-1">{item.type}</span>
                <Badge variant={getStatusColor(item.status)} className="text-xs">
                  {item.status}
                </Badge>
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={processSyncQueue}
            disabled={!isOnline || isSyncing}
            className="flex-1"
          >
            <Sync className="h-4 w-4 mr-2" />
            {isSyncing ? 'Syncing...' : 'Sync Now'}
          </Button>
          {syncQueue.some(item => item.status === 'failed') && (
            <Button
              variant="outline"
              size="sm"
              onClick={retryFailedItems}
              className="flex-1"
            >
              Retry Failed
            </Button>
          )}
        </div>

        {syncQueue.some(item => item.status === 'completed') && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearCompletedItems}
            className="w-full"
          >
            Clear Completed
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default PWABackgroundSync;
