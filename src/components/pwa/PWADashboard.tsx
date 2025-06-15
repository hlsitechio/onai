
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PWAOverviewTab from './PWAOverviewTab';
import BackgroundSyncUI from './BackgroundSyncUI';
import EnhancedShareIntegration from './EnhancedShareIntegration';
import PWAPushNotifications from './PWAPushNotifications';
import ErrorBoundary from '@/components/ErrorBoundary';
import { 
  Settings, 
  RefreshCw, 
  Share, 
  Bell
} from 'lucide-react';

const PWADashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <ErrorBoundary>
      <div className="w-full max-w-6xl mx-auto p-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">PWA Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor and control your Progressive Web App features
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">
              <Settings className="h-4 w-4 mr-2" />
              Overview
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
          </TabsList>

          <TabsContent value="overview">
            <ErrorBoundary fallback={<div className="p-4 text-center text-gray-500">Overview not available</div>}>
              <PWAOverviewTab />
            </ErrorBoundary>
          </TabsContent>

          <TabsContent value="sync">
            <ErrorBoundary fallback={<div className="p-4 text-center text-gray-500">Sync features not available</div>}>
              <BackgroundSyncUI />
            </ErrorBoundary>
          </TabsContent>

          <TabsContent value="share">
            <ErrorBoundary fallback={<div className="p-4 text-center text-gray-500">Share features not available</div>}>
              <EnhancedShareIntegration />
            </ErrorBoundary>
          </TabsContent>

          <TabsContent value="notifications">
            <ErrorBoundary fallback={<div className="p-4 text-center text-gray-500">Notifications not available</div>}>
              <PWAPushNotifications />
            </ErrorBoundary>
          </TabsContent>
        </Tabs>
      </div>
    </ErrorBoundary>
  );
};

export default PWADashboard;
