
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { usePWAStatus } from '@/hooks/usePWAStatus';
import { usePWASync } from './hooks/usePWASync';
import { Wifi, WifiOff, Download, RefreshCw, Smartphone } from 'lucide-react';

// Create a simple ConnectionStatus component inline to avoid import issues
const ConnectionStatus: React.FC<{ isOnline: boolean }> = ({ isOnline }) => (
  <div className="flex items-center gap-2 text-sm">
    {isOnline ? (
      <>
        <Wifi className="h-4 w-4 text-green-500" />
        <span className="text-green-600">Online</span>
      </>
    ) : (
      <>
        <WifiOff className="h-4 w-4 text-orange-500" />
        <span className="text-orange-600">Offline</span>
      </>
    )}
  </div>
);

// Create a simple QueueStats component inline to avoid import issues
const QueueStats: React.FC<{ syncQueue: any[] }> = ({ syncQueue }) => {
  const pending = syncQueue.filter(item => item.status === 'pending').length;
  const completed = syncQueue.filter(item => item.status === 'completed').length;
  const failed = syncQueue.filter(item => item.status === 'failed').length;

  return (
    <div className="grid grid-cols-3 gap-2 text-sm">
      <div>
        <span className="text-muted-foreground">Pending</span>
        <p className="font-medium">{pending}</p>
      </div>
      <div>
        <span className="text-muted-foreground">Completed</span>
        <p className="font-medium">{completed}</p>
      </div>
      <div>
        <span className="text-muted-foreground">Failed</span>
        <p className="font-medium">{failed}</p>
      </div>
    </div>
  );
};

export const PWAStatusDashboard: React.FC = () => {
  const pwaNative = usePWAStatus();
  const syncData = usePWASync();
  
  // Provide default values to prevent undefined errors
  const { 
    isOnline = navigator.onLine, 
    isInstalled = false, 
    updateAvailable = false, 
    canInstall = false, 
    installApp = () => Promise.resolve(), 
    requestUpdate = () => {}
  } = pwaNative || {};
  
  const { 
    syncQueue = [], 
    isSyncing = false, 
    clearCompletedItems = () => {}
  } = syncData || {};

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          {isOnline ? (
            <Wifi className="h-5 w-5 text-green-500" />
          ) : (
            <WifiOff className="h-5 w-5 text-red-500" />
          )}
          PWA Status
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <ConnectionStatus isOnline={isOnline} />
        
        <Separator />
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Installation</span>
            <Badge variant={isInstalled ? 'default' : 'secondary'}>
              {isInstalled ? 'Installed' : 'Not Installed'}
            </Badge>
          </div>
          
          {canInstall && !isInstalled && (
            <Button 
              onClick={installApp} 
              size="sm" 
              className="w-full"
              variant="outline"
            >
              <Smartphone className="h-4 w-4 mr-2" />
              Install App
            </Button>
          )}
          
          {updateAvailable && (
            <Button 
              onClick={requestUpdate} 
              size="sm" 
              className="w-full"
              variant="outline"
            >
              <Download className="h-4 w-4 mr-2" />
              Update Available
            </Button>
          )}
        </div>
        
        <Separator />
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Sync Status</span>
            {isSyncing && (
              <RefreshCw className="h-4 w-4 animate-spin text-blue-500" />
            )}
          </div>
          
          <QueueStats syncQueue={syncQueue} />
          
          {syncQueue.filter(item => item.status === 'completed').length > 0 && (
            <Button 
              onClick={clearCompletedItems} 
              size="sm" 
              variant="ghost" 
              className="w-full"
            >
              Clear Completed
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
