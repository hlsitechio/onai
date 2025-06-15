
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PWAOverviewTab from './PWAOverviewTab';
import BackgroundSyncUI from './BackgroundSyncUI';
import EnhancedShareIntegration from './EnhancedShareIntegration';
import PWAPushNotifications from './PWAPushNotifications';
import { 
  Settings, 
  RefreshCw, 
  Share, 
  Bell
} from 'lucide-react';

const PWADashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
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
          <PWAOverviewTab />
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
      </Tabs>
    </div>
  );
};

export default PWADashboard;
