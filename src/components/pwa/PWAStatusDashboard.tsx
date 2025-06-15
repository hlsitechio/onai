
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { usePWA } from './PWAProvider';
import { usePWASync } from './hooks/usePWASync';
import ConnectionStatus from './components/ConnectionStatus';
import QueueStats from './components/QueueStats';
import { Wifi, WifiOff, Download, RefreshCw, Smartphone } from 'lucide-react';

export const PWAStatusDashboard: React.FC = () => {
  const { 
    isOnline, 
    isInstalled, 
    updateAvailable, 
    canInstall, 
    installApp, 
    requestUpdate 
  } = usePWA();
  
  const { syncQueue, isSyncing, clearCompletedItems } = usePWASync();

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
