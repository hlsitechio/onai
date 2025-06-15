
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import PWAConnectionCards from './PWAConnectionCards';
import PWAFeatureStatus from './PWAFeatureStatus';
import PWAQuickActions from './PWAQuickActions';
import PWAInstallationAnalytics from './PWAInstallationAnalytics';

const PWAOverviewTab: React.FC = () => {
  // Only show analytics in development mode
  const isDevelopment = import.meta.env.DEV;

  return (
    <div className="space-y-6">
      <PWAConnectionCards />
      <PWAFeatureStatus />
      <PWAQuickActions />

      {/* Development Mode Analytics Access */}
      {isDevelopment && (
        <Card className="border-dashed border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20">
          <CardHeader>
            <CardTitle className="text-yellow-700 dark:text-yellow-300">Development Mode</CardTitle>
            <CardDescription className="text-yellow-600 dark:text-yellow-400">
              Additional analytics available in development environment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PWAInstallationAnalytics />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PWAOverviewTab;
