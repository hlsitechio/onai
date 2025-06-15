
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Smartphone, Monitor, Download, Users, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface InstallationMetrics {
  promptsShown: number;
  installsCompleted: number;
  installsDeclined: number;
  installationRate: number;
  deviceTypes: {
    mobile: number;
    desktop: number;
    tablet: number;
  };
  platforms: {
    android: number;
    ios: number;
    windows: number;
    mac: number;
    linux: number;
  };
}

interface PWAAnalyticsEvent {
  event_type: 'prompt_shown' | 'install_completed' | 'install_declined' | 'app_launched';
  user_agent?: string;
  device_type?: 'mobile' | 'desktop' | 'tablet';
  platform?: 'android' | 'ios' | 'windows' | 'mac' | 'linux';
  browser?: string;
  session_id?: string;
  metadata?: any;
}

const PWAInstallationAnalytics: React.FC = () => {
  const { toast } = useToast();
  const [metrics, setMetrics] = useState<InstallationMetrics>({
    promptsShown: 0,
    installsCompleted: 0,
    installsDeclined: 0,
    installationRate: 0,
    deviceTypes: { mobile: 0, desktop: 0, tablet: 0 },
    platforms: { android: 0, ios: 0, windows: 0, mac: 0, linux: 0 }
  });

  const [isCollecting, setIsCollecting] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Only initialize analytics in development mode
    if (!import.meta.env.DEV) return;
    
    loadMetricsFromSupabase();
    setupAnalyticsListeners();
  }, []);

  const loadMetricsFromSupabase = async () => {
    try {
      setIsLoading(true);
      
      // Get all analytics events
      const { data: events, error } = await supabase
        .from('pwa_analytics')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading analytics:', error);
        toast({
          title: 'Analytics Error',
          description: 'Failed to load analytics data from database',
          variant: 'destructive',
        });
        return;
      }

      if (!events || events.length === 0) {
        setMetrics({
          promptsShown: 0,
          installsCompleted: 0,
          installsDeclined: 0,
          installationRate: 0,
          deviceTypes: { mobile: 0, desktop: 0, tablet: 0 },
          platforms: { android: 0, ios: 0, windows: 0, mac: 0, linux: 0 }
        });
        return;
      }

      // Process events into metrics
      const newMetrics: InstallationMetrics = {
        promptsShown: events.filter(e => e.event_type === 'prompt_shown').length,
        installsCompleted: events.filter(e => e.event_type === 'install_completed').length,
        installsDeclined: events.filter(e => e.event_type === 'install_declined').length,
        installationRate: 0,
        deviceTypes: { mobile: 0, desktop: 0, tablet: 0 },
        platforms: { android: 0, ios: 0, windows: 0, mac: 0, linux: 0 }
      };

      // Calculate installation rate
      newMetrics.installationRate = newMetrics.promptsShown > 0 
        ? Math.round((newMetrics.installsCompleted / newMetrics.promptsShown) * 100)
        : 0;

      // Count device types and platforms
      events.forEach(event => {
        if (event.device_type && newMetrics.deviceTypes.hasOwnProperty(event.device_type)) {
          newMetrics.deviceTypes[event.device_type as keyof typeof newMetrics.deviceTypes]++;
        }
        if (event.platform && newMetrics.platforms.hasOwnProperty(event.platform)) {
          newMetrics.platforms[event.platform as keyof typeof newMetrics.platforms]++;
        }
      });

      setMetrics(newMetrics);
    } catch (error) {
      console.error('Error processing analytics data:', error);
      toast({
        title: 'Analytics Error',
        description: 'Failed to process analytics data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const trackEvent = async (eventData: PWAAnalyticsEvent) => {
    if (!isCollecting || !import.meta.env.DEV) return;

    try {
      const { error } = await supabase
        .from('pwa_analytics')
        .insert([{
          event_type: eventData.event_type,
          user_agent: eventData.user_agent || navigator.userAgent,
          device_type: eventData.device_type || detectDeviceType(),
          platform: eventData.platform || detectPlatform(),
          browser: eventData.browser || detectBrowser(),
          session_id: eventData.session_id || getSessionId(),
          metadata: eventData.metadata || {}
        }]);

      if (error) {
        console.error('Error tracking event:', error);
        return;
      }

      // Reload metrics after tracking new event
      await loadMetricsFromSupabase();
    } catch (error) {
      console.error('Error saving analytics event:', error);
    }
  };

  const detectDeviceType = (): 'mobile' | 'desktop' | 'tablet' => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
    const isTablet = /ipad|android(?!.*mobile)/i.test(userAgent);
    
    if (isMobile && !isTablet) return 'mobile';
    if (isTablet) return 'tablet';
    return 'desktop';
  };

  const detectPlatform = (): 'android' | 'ios' | 'windows' | 'mac' | 'linux' => {
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.includes('android')) return 'android';
    if (userAgent.includes('iphone') || userAgent.includes('ipad')) return 'ios';
    if (userAgent.includes('mac')) return 'mac';
    if (userAgent.includes('linux')) return 'linux';
    return 'windows';
  };

  const detectBrowser = (): string => {
    const userAgent = navigator.userAgent;
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    return 'Other';
  };

  const getSessionId = (): string => {
    let sessionId = sessionStorage.getItem('pwa-session-id');
    if (!sessionId) {
      sessionId = Date.now().toString(36) + Math.random().toString(36).substr(2);
      sessionStorage.setItem('pwa-session-id', sessionId);
    }
    return sessionId;
  };

  const setupAnalyticsListeners = () => {
    // Track install prompt shown
    window.addEventListener('beforeinstallprompt', () => {
      trackEvent({ event_type: 'prompt_shown' });
    });

    // Track successful installation
    window.addEventListener('appinstalled', () => {
      trackEvent({ event_type: 'install_completed' });
    });
  };

  const recordDeclined = async () => {
    await trackEvent({ event_type: 'install_declined' });
  };

  const resetMetrics = async () => {
    try {
      // Delete all analytics data
      const { error } = await supabase
        .from('pwa_analytics')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all rows

      if (error) {
        console.error('Error resetting analytics:', error);
        toast({
          title: 'Reset Failed',
          description: 'Failed to reset analytics data',
          variant: 'destructive',
        });
        return;
      }

      // Reload metrics
      await loadMetricsFromSupabase();
      
      toast({
        title: 'Analytics Reset',
        description: 'All analytics data has been cleared',
      });
    } catch (error) {
      console.error('Error resetting analytics:', error);
      toast({
        title: 'Reset Failed',
        description: 'An error occurred while resetting analytics',
        variant: 'destructive',
      });
    }
  };

  const exportMetrics = async () => {
    try {
      // Get all raw data for export
      const { data: events, error } = await supabase
        .from('pwa_analytics')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error exporting analytics:', error);
        toast({
          title: 'Export Failed',
          description: 'Failed to export analytics data',
          variant: 'destructive',
        });
        return;
      }

      const exportData = {
        summary: metrics,
        events: events || [],
        exportedAt: new Date().toISOString()
      };

      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `pwa-analytics-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
      
      toast({
        title: 'Export Complete',
        description: 'Analytics data has been downloaded',
      });
    } catch (error) {
      console.error('Error exporting analytics:', error);
      toast({
        title: 'Export Failed',
        description: 'An error occurred during export',
        variant: 'destructive',
      });
    }
  };

  // Only show in development mode
  if (!import.meta.env.DEV) {
    return null;
  }

  if (isLoading) {
    return (
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            PWA Installation Analytics (Dev Only)
          </CardTitle>
          <CardDescription>
            Loading analytics data from database...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          PWA Installation Analytics (Dev Only)
        </CardTitle>
        <CardDescription>
          Development analytics stored in Supabase - not visible to production users
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Installation Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{metrics.promptsShown}</div>
            <div className="text-sm text-muted-foreground">Prompts Shown</div>
          </div>
          
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{metrics.installsCompleted}</div>
            <div className="text-sm text-muted-foreground">Installs</div>
          </div>
          
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">{metrics.installsDeclined}</div>
            <div className="text-sm text-muted-foreground">Declined</div>
          </div>
          
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{metrics.installationRate}%</div>
            <div className="text-sm text-muted-foreground">Success Rate</div>
          </div>
        </div>

        {/* Installation Rate Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Installation Rate</span>
            <span>{metrics.installationRate}%</span>
          </div>
          <Progress value={metrics.installationRate} className="h-2" />
        </div>

        {/* Device Types */}
        <div className="space-y-3">
          <h4 className="font-medium flex items-center gap-2">
            <Monitor className="h-4 w-4" />
            Device Types
          </h4>
          <div className="grid grid-cols-3 gap-2">
            {Object.entries(metrics.deviceTypes).map(([type, count]) => (
              <div key={type} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                <span className="text-sm capitalize">{type}</span>
                <Badge variant="secondary">{count}</Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Platforms */}
        <div className="space-y-3">
          <h4 className="font-medium flex items-center gap-2">
            <Smartphone className="h-4 w-4" />
            Platforms
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(metrics.platforms).map(([platform, count]) => (
              <div key={platform} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                <span className="text-sm capitalize">{platform}</span>
                <Badge variant="secondary">{count}</Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-2 pt-4 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsCollecting(!isCollecting)}
          >
            {isCollecting ? 'Pause' : 'Resume'} Tracking
          </Button>
          
          <Button variant="outline" size="sm" onClick={recordDeclined}>
            Test Decline Event
          </Button>
          
          <Button variant="outline" size="sm" onClick={exportMetrics}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          
          <Button variant="destructive" size="sm" onClick={resetMetrics}>
            Reset Data
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PWAInstallationAnalytics;
