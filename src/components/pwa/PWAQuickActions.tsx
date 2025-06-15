
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const PWAQuickActions: React.FC = () => {
  return (
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
  );
};

export default PWAQuickActions;
