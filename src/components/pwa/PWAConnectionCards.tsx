
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wifi, Database } from 'lucide-react';
import { usePWA } from './PWAProvider';

const PWAConnectionCards: React.FC = () => {
  const { isOnline, isInstalled, enhancedFeatures } = usePWA();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Connection Status */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Wifi className="h-5 w-5" />
            Connection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Badge variant={isOnline ? 'default' : 'destructive'}>
            {isOnline ? 'Online' : 'Offline'}
          </Badge>
        </CardContent>
      </Card>

      {/* Installation Status */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Database className="h-5 w-5" />
            Installation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Badge variant={isInstalled ? 'default' : 'secondary'}>
            {isInstalled ? 'Installed' : 'Not Installed'}
          </Badge>
        </CardContent>
      </Card>

      {/* Storage Status */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Database className="h-5 w-5" />
            Storage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Badge variant={enhancedFeatures.offlineStorage ? 'default' : 'secondary'}>
            {enhancedFeatures.offlineStorage ? 'Available' : 'Limited'}
          </Badge>
        </CardContent>
      </Card>
    </div>
  );
};

export default PWAConnectionCards;
