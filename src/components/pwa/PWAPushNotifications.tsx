
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Bell, BellOff, Settings } from 'lucide-react';

interface NotificationState {
  permission: NotificationPermission;
  isSubscribed: boolean;
  subscription: PushSubscription | null;
}

const PWAPushNotifications: React.FC = () => {
  const [notificationState, setNotificationState] = useState<NotificationState>({
    permission: 'default',
    isSubscribed: false,
    subscription: null,
  });

  const [settings, setSettings] = useState({
    notesUpdates: true,
    featureAnnouncements: true,
    syncNotifications: false,
  });

  useEffect(() => {
    checkNotificationState();
    loadSettings();
  }, []);

  const checkNotificationState = async () => {
    if (!('Notification' in window) || !('serviceWorker' in navigator)) {
      return;
    }

    const permission = Notification.permission;
    let isSubscribed = false;
    let subscription = null;

    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        subscription = await registration.pushManager.getSubscription();
        isSubscribed = !!subscription;
      }
    } catch (error) {
      console.error('Error checking notification state:', error);
    }

    setNotificationState({
      permission,
      isSubscribed,
      subscription,
    });
  };

  const loadSettings = () => {
    try {
      const stored = localStorage.getItem('oneai-notification-settings');
      if (stored) {
        setSettings(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading notification settings:', error);
    }
  };

  const saveSettings = (newSettings: typeof settings) => {
    setSettings(newSettings);
    localStorage.setItem('oneai-notification-settings', JSON.stringify(newSettings));
  };

  const requestPermission = async () => {
    if (!('Notification' in window)) {
      toast.error('Notifications not supported in this browser');
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      
      if (permission === 'granted') {
        await subscribeToNotifications();
        toast.success('Notifications enabled successfully');
      } else {
        toast.error('Notification permission denied');
      }
      
      await checkNotificationState();
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      toast.error('Failed to enable notifications');
    }
  };

  const subscribeToNotifications = async () => {
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (!registration) {
        throw new Error('Service worker not registered');
      }

      // Generate VAPID keys for push notifications
      // In a real app, these would come from your server
      const vapidPublicKey = 'BEl62iUYgUivxIkv69yViEuiBIa40HI2YD56_-LFgd88'
        + 'qhriKLMu6u3c_kZeVHGqhWEiHYvn0qfDW2lAcL7XQHM';

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
      });

      // In a real app, send this subscription to your server
      console.log('Push subscription:', subscription);
      
      return subscription;
    } catch (error) {
      console.error('Error subscribing to push notifications:', error);
      throw error;
    }
  };

  const unsubscribeFromNotifications = async () => {
    try {
      if (notificationState.subscription) {
        await notificationState.subscription.unsubscribe();
        toast.success('Notifications disabled');
        await checkNotificationState();
      }
    } catch (error) {
      console.error('Error unsubscribing from notifications:', error);
      toast.error('Failed to disable notifications');
    }
  };

  const testNotification = () => {
    if (notificationState.permission === 'granted') {
      new Notification('OneAI Notes', {
        body: 'Test notification from OneAI Notes',
        icon: '/lovable-uploads/8a54ca4d-f005-4821-b9d8-3fd2958d340b.png',
        badge: '/lovable-uploads/8a54ca4d-f005-4821-b9d8-3fd2958d340b.png',
        tag: 'test-notification',
      });
    }
  };

  // Helper function to convert VAPID key
  const urlBase64ToUint8Array = (base64String: string) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  const getPermissionBadge = () => {
    switch (notificationState.permission) {
      case 'granted':
        return <Badge className="bg-green-500">Enabled</Badge>;
      case 'denied':
        return <Badge variant="destructive">Blocked</Badge>;
      default:
        return <Badge variant="secondary">Not Set</Badge>;
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Push Notifications
        </CardTitle>
        <CardDescription>
          Stay updated with important notifications
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Permission Status */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Status</span>
          {getPermissionBadge()}
        </div>

        {/* Subscription Status */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Subscription</span>
          <Badge variant={notificationState.isSubscribed ? 'default' : 'secondary'}>
            {notificationState.isSubscribed ? 'Active' : 'Inactive'}
          </Badge>
        </div>

        {/* Main Action */}
        <div className="flex gap-2">
          {notificationState.permission === 'default' && (
            <Button onClick={requestPermission} className="flex-1">
              <Bell className="h-4 w-4 mr-2" />
              Enable Notifications
            </Button>
          )}
          
          {notificationState.permission === 'granted' && !notificationState.isSubscribed && (
            <Button onClick={subscribeToNotifications} className="flex-1">
              <Bell className="h-4 w-4 mr-2" />
              Subscribe
            </Button>
          )}
          
          {notificationState.isSubscribed && (
            <Button onClick={unsubscribeFromNotifications} variant="outline" className="flex-1">
              <BellOff className="h-4 w-4 mr-2" />
              Unsubscribe
            </Button>
          )}
        </div>

        {/* Test Notification */}
        {notificationState.permission === 'granted' && (
          <Button
            variant="outline"
            size="sm"
            onClick={testNotification}
            className="w-full"
          >
            Send Test Notification
          </Button>
        )}

        {/* Notification Settings */}
        {notificationState.isSubscribed && (
          <div className="space-y-3 pt-4 border-t">
            <div className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span className="text-sm font-medium">Notification Types</span>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Notes updates</span>
                <Switch
                  checked={settings.notesUpdates}
                  onCheckedChange={(checked) => saveSettings({ ...settings, notesUpdates: checked })}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Feature announcements</span>
                <Switch
                  checked={settings.featureAnnouncements}
                  onCheckedChange={(checked) => saveSettings({ ...settings, featureAnnouncements: checked })}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Sync notifications</span>
                <Switch
                  checked={settings.syncNotifications}
                  onCheckedChange={(checked) => saveSettings({ ...settings, syncNotifications: checked })}
                />
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PWAPushNotifications;
