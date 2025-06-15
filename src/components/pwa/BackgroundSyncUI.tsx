
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { usePWASync } from './hooks/usePWASync';
import { toast } from 'sonner';
import { 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  Wifi,
  WifiOff 
} from 'lucide-react';

interface SyncOperation {
  id: string;
  type: string;
  status: 'pending' | 'syncing' | 'completed' | 'failed';
  progress: number;
  message: string;
  timestamp: number;
  retryCount: number;
}

const BackgroundSyncUI: React.FC = () => {
  const { syncQueue, isSyncing, addToSyncQueue, clearCompletedItems } = usePWASync();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncOperations, setSyncOperations] = useState<SyncOperation[]>([]);
  const [autoSync, setAutoSync] = useState(true);

  useEffect(() => {
    const handleOnlineStatus = () => {
      setIsOnline(navigator.onLine);
      if (navigator.onLine && autoSync) {
        toast.success('Connection restored - syncing data...');
        triggerSync();
      } else if (!navigator.onLine) {
        toast.warning('Working offline - changes will sync when online');
      }
    };

    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);

    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, [autoSync]);

  const triggerSync = async () => {
    if (!isOnline) {
      toast.error('Cannot sync while offline');
      return;
    }

    const operation: SyncOperation = {
      id: Date.now().toString(),
      type: 'manual_sync',
      status: 'syncing',
      progress: 0,
      message: 'Starting sync...',
      timestamp: Date.now(),
      retryCount: 0
    };

    setSyncOperations(prev => [...prev, operation]);

    try {
      // Simulate sync progress
      for (let progress = 0; progress <= 100; progress += 20) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setSyncOperations(prev => 
          prev.map(op => 
            op.id === operation.id 
              ? { ...op, progress, message: `Syncing... ${progress}%` }
              : op
          )
        );
      }

      setSyncOperations(prev => 
        prev.map(op => 
          op.id === operation.id 
            ? { ...op, status: 'completed', message: 'Sync completed successfully' }
            : op
        )
      );

      toast.success('Sync completed successfully');
    } catch (error) {
      setSyncOperations(prev => 
        prev.map(op => 
          op.id === operation.id 
            ? { ...op, status: 'failed', message: 'Sync failed' }
            : op
        )
      );

      toast.error('Sync failed');
    }
  };

  const retryFailedOperations = () => {
    const failedOps = syncOperations.filter(op => op.status === 'failed');
    failedOps.forEach(op => {
      setSyncOperations(prev => 
        prev.map(operation => 
          operation.id === op.id 
            ? { ...operation, status: 'pending', retryCount: operation.retryCount + 1 }
            : operation
        )
      );
    });
    
    if (failedOps.length > 0) {
      toast.info(`Retrying ${failedOps.length} failed operations`);
    }
  };

  const clearCompleted = () => {
    setSyncOperations(prev => prev.filter(op => op.status !== 'completed'));
    clearCompletedItems();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'syncing':
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: 'default',
      failed: 'destructive',
      syncing: 'secondary',
      pending: 'outline'
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'outline'}>
        {status}
      </Badge>
    );
  };

  const pendingCount = syncOperations.filter(op => op.status === 'pending').length;
  const failedCount = syncOperations.filter(op => op.status === 'failed').length;
  const completedCount = syncOperations.filter(op => op.status === 'completed').length;

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {isOnline ? (
            <Wifi className="h-5 w-5 text-green-500" />
          ) : (
            <WifiOff className="h-5 w-5 text-red-500" />
          )}
          Background Sync
          {isSyncing && <RefreshCw className="h-4 w-4 animate-spin" />}
        </CardTitle>
        <CardDescription>
          Monitor and control background synchronization
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Sync Status Overview */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
            <div className="text-sm text-muted-foreground">Pending</div>
          </div>
          
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">{failedCount}</div>
            <div className="text-sm text-muted-foreground">Failed</div>
          </div>
          
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{completedCount}</div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-2 flex-wrap">
          <Button 
            onClick={triggerSync} 
            disabled={!isOnline || isSyncing}
            size="sm"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            {isSyncing ? 'Syncing...' : 'Sync Now'}
          </Button>
          
          {failedCount > 0 && (
            <Button onClick={retryFailedOperations} variant="outline" size="sm">
              Retry Failed ({failedCount})
            </Button>
          )}
          
          {completedCount > 0 && (
            <Button onClick={clearCompleted} variant="outline" size="sm">
              Clear Completed
            </Button>
          )}
        </div>

        {/* Sync Operations List */}
        {syncOperations.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium">Recent Operations</h4>
            <ScrollArea className="h-64 w-full border rounded-md p-4">
              <div className="space-y-3">
                {syncOperations.slice(-10).reverse().map((operation) => (
                  <div key={operation.id} className="flex items-center gap-3 p-2 bg-muted/30 rounded">
                    {getStatusIcon(operation.status)}
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium truncate">
                          {operation.type.replace('_', ' ').toUpperCase()}
                        </span>
                        {getStatusBadge(operation.status)}
                      </div>
                      
                      <div className="text-xs text-muted-foreground mt-1">
                        {operation.message}
                      </div>
                      
                      {operation.status === 'syncing' && (
                        <Progress value={operation.progress} className="h-1 mt-2" />
                      )}
                      
                      {operation.retryCount > 0 && (
                        <div className="text-xs text-orange-500 mt-1">
                          Retry #{operation.retryCount}
                        </div>
                      )}
                    </div>
                    
                    <div className="text-xs text-muted-foreground">
                      {new Date(operation.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}

        {/* Connection Status */}
        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
          <span className="text-sm font-medium">Connection Status</span>
          <div className="flex items-center gap-2">
            {isOnline ? (
              <>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm text-green-600">Online</span>
              </>
            ) : (
              <>
                <div className="w-2 h-2 bg-red-500 rounded-full" />
                <span className="text-sm text-red-600">Offline</span>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BackgroundSyncUI;
