
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { Trash2, Download, HardDrive, Wifi, WifiOff } from 'lucide-react';

interface CacheStats {
  totalSize: number;
  cacheNames: string[];
  isOnline: boolean;
  storageQuota?: number;
  storageUsage?: number;
}

const PWACacheManager: React.FC = () => {
  const [cacheStats, setCacheStats] = useState<CacheStats>({
    totalSize: 0,
    cacheNames: [],
    isOnline: navigator.onLine,
  });
  const [isClearing, setIsClearing] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    loadCacheStats();
    
    // Listen for online/offline events
    const handleOnline = () => setCacheStats(prev => ({ ...prev, isOnline: true }));
    const handleOffline = () => setCacheStats(prev => ({ ...prev, isOnline: false }));
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const loadCacheStats = async () => {
    try {
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        let totalSize = 0;

        // Calculate total cache size
        for (const cacheName of cacheNames) {
          const cache = await caches.open(cacheName);
          const keys = await cache.keys();
          
          for (const request of keys) {
            const response = await cache.match(request);
            if (response) {
              const blob = await response.blob();
              totalSize += blob.size;
            }
          }
        }

        // Get storage quota if available
        let storageQuota, storageUsage;
        if ('storage' in navigator && 'estimate' in navigator.storage) {
          const estimate = await navigator.storage.estimate();
          storageQuota = estimate.quota;
          storageUsage = estimate.usage;
        }

        setCacheStats({
          totalSize,
          cacheNames,
          isOnline: navigator.onLine,
          storageQuota,
          storageUsage,
        });
      }
    } catch (error) {
      console.error('Error loading cache stats:', error);
      toast.error('Failed to load cache statistics');
    }
  };

  const clearAllCaches = async () => {
    setIsClearing(true);
    try {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map(name => caches.delete(name)));
      
      toast.success('All caches cleared successfully');
      await loadCacheStats();
    } catch (error) {
      console.error('Error clearing caches:', error);
      toast.error('Failed to clear caches');
    } finally {
      setIsClearing(false);
    }
  };

  const refreshCaches = async () => {
    setIsRefreshing(true);
    try {
      // Force update service worker
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration) {
          await registration.update();
        }
      }
      
      // Reload critical resources
      await fetch('/', { cache: 'reload' });
      
      toast.success('Caches refreshed successfully');
      await loadCacheStats();
    } catch (error) {
      console.error('Error refreshing caches:', error);
      toast.error('Failed to refresh caches');
    } finally {
      setIsRefreshing(false);
    }
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const storagePercentage = cacheStats.storageQuota && cacheStats.storageUsage
    ? (cacheStats.storageUsage / cacheStats.storageQuota) * 100
    : 0;

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HardDrive className="h-5 w-5" />
          Cache Management
        </CardTitle>
        <CardDescription>
          Manage offline storage and cached data
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Connection Status */}
        <div className="flex items-center gap-2 text-sm">
          {cacheStats.isOnline ? (
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

        {/* Storage Usage */}
        {cacheStats.storageQuota && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Storage Used</span>
              <span>{formatBytes(cacheStats.storageUsage || 0)} / {formatBytes(cacheStats.storageQuota)}</span>
            </div>
            <Progress value={storagePercentage} className="h-2" />
          </div>
        )}

        {/* Cache Stats */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Cache Size</span>
            <p className="font-medium">{formatBytes(cacheStats.totalSize)}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Cache Count</span>
            <p className="font-medium">{cacheStats.cacheNames.length}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={refreshCaches}
            disabled={isRefreshing}
            className="flex-1"
          >
            <Download className="h-4 w-4 mr-2" />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={clearAllCaches}
            disabled={isClearing}
            className="flex-1"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {isClearing ? 'Clearing...' : 'Clear All'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PWACacheManager;
