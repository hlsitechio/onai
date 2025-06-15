
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { usePWA } from './PWAProvider';
import PWAInstallationAnalytics from './PWAInstallationAnalytics';
import BackgroundSyncUI from './BackgroundSyncUI';
import EnhancedShareIntegration from './EnhancedShareIntegration';
import PWAPushNotifications from './PWAPushNotifications';
import { PWAStatusDashboard } from './PWAStatusDashboard';
import { 
  Settings, 
  BarChart3, 
  RefreshCw, 
  Share, 
  Bell, 
  Smartphone,
  Database,
  Wifi
} from 'lucide-react';

const PWADashboard: React.FC = () => {
  const { 
    isOnline, 
    isInstalled, 
    enhancedFeatures, 
    metrics, 
    offlineStorage 
  } = usePWA();
  
  const [activeTab, setActiveTab] = useState('overview');

  const getFeatureStatus = (feature: keyof typeof enhancedFeatures) => {
    return enhancedFeatures[feature] ? 'Available' : 'Not Available';
  };

  const getFeatureVariant = (feature: keyof typeof enhancedFeatures) => {
    return enhancedFeatures[feature] ? 'default' : 'secondary';
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">PWA Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor and control your Progressive Web App features
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">
            <Settings className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="sync">
            <RefreshCw className="h-4 w-4 mr-2" />
            Sync
          </TabsTrigger>
          <TabsTrigger value="share">
            <Share className="h-4 w-4 mr-2" />
            Share
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="status">
            <Smartphone className="h-4 w-4 mr-2" />
            Status
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
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
                  <Smartphone className="h-5 w-5" />
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

          {/* Feature Availability */}
          <Card>
            <CardHeader>
              <CardTitle>Feature Availability</CardTitle>
              <CardDescription>
                Overview of PWA features supported by this browser
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Background Sync</span>
                    <Badge variant={getFeatureVariant('backgroundSync')}>
                      {getFeatureStatus('backgroundSync')}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Push Notifications</span>
                    <Badge variant={getFeatureVariant('pushNotifications')}>
                      {getFeatureStatus('pushNotifications')}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Offline Storage</span>
                    <Badge variant={getFeatureVariant('offlineStorage')}>
                      {getFeatureStatus('offlineStorage')}
                    </Badge>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Installation Analytics</span>
                    <Badge variant={getFeatureVariant('installationAnalytics')}>
                      {getFeatureStatus('installationAnalytics')}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Enhanced Share</span>
                    <Badge variant={getFeatureVariant('enhancedShare')}>
                      {getFeatureStatus('enhancedShare')}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common PWA management tasks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 flex-wrap">
                <Button variant="outline" size="sm">
                  Clear Cache
                </Button>
                <Button variant="outline" size="sm">
                  Force Sync
                </Button>
                <Button variant="outline" size="sm">
                  Export Data
                </Button>
                <Button variant="outline" size="sm">
                  Reset Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <PWAInstallationAnalytics />
        </TabsContent>

        <TabsContent value="sync">
          <BackgroundSyncUI />
        </TabsContent>

        <TabsContent value="share">
          <EnhancedShareIntegration />
        </TabsContent>

        <TabsContent value="notifications">
          <PWAPushNotifications />
        </TabsContent>

        <TabsContent value="status">
          <PWAStatusDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PWADashboard;
