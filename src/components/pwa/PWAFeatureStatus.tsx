
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { usePWA } from './PWAProvider';

const PWAFeatureStatus: React.FC = () => {
  const { enhancedFeatures } = usePWA();

  const getFeatureStatus = (feature: keyof typeof enhancedFeatures) => {
    return enhancedFeatures[feature] ? 'Available' : 'Not Available';
  };

  const getFeatureVariant = (feature: keyof typeof enhancedFeatures) => {
    return enhancedFeatures[feature] ? 'default' : 'secondary';
  };

  return (
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
  );
};

export default PWAFeatureStatus;
