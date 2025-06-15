
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Smartphone, Monitor, Download, Users, TrendingUp } from 'lucide-react';

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

const PWAInstallationAnalytics: React.FC = () => {
  const [metrics, setMetrics] = useState<InstallationMetrics>({
    promptsShown: 0,
    installsCompleted: 0,
    installsDeclined: 0,
    installationRate: 0,
    deviceTypes: { mobile: 0, desktop: 0, tablet: 0 },
    platforms: { android: 0, ios: 0, windows: 0, mac: 0, linux: 0 }
  });

  const [isCollecting, setIsCollecting] = useState(true);

  useEffect(() => {
    // Only initialize analytics in development mode
    if (!import.meta.env.DEV) return;
    
    loadMetrics();
    setupAnalyticsListeners();
  }, []);

  const loadMetrics = () => {
    try {
      const stored = localStorage.getItem('pwa-installation-metrics');
      if (stored) {
        const parsedMetrics = JSON.parse(stored);
        setMetrics(parsedMetrics);
      }
    } catch (error) {
      console.error('Error loading installation metrics:', error);
    }
  };

  const saveMetrics = (newMetrics: InstallationMetrics) => {
    try {
      localStorage.setItem('pwa-installation-metrics', JSON.stringify(newMetrics));
      setMetrics(newMetrics);
    } catch (error) {
      console.error('Error saving installation metrics:', error);
    }
  };

  const setupAnalyticsListeners = () => {
    // Track install prompt shown
    window.addEventListener('beforeinstallprompt', () => {
      const newMetrics = {
        ...metrics,
        promptsShown: metrics.promptsShown + 1
      };
      newMetrics.installationRate = calculateInstallationRate(newMetrics);
      saveMetrics(newMetrics);
      trackDeviceAndPlatform();
    });

    // Track successful installation
    window.addEventListener('appinstalled', () => {
      const newMetrics = {
        ...metrics,
        installsCompleted: metrics.installsCompleted + 1
      };
      newMetrics.installationRate = calculateInstallationRate(newMetrics);
      saveMetrics(newMetrics);
    });
  };

  const calculateInstallationRate = (metricsData: InstallationMetrics): number => {
    const totalPrompts = metricsData.promptsShown;
    if (totalPrompts === 0) return 0;
    return Math.round((metricsData.installsCompleted / totalPrompts) * 100);
  };

  const trackDeviceAndPlatform = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
    const isTablet = /ipad|android(?!.*mobile)/i.test(userAgent);
    
    let deviceType: 'mobile' | 'desktop' | 'tablet' = 'desktop';
    if (isMobile && !isTablet) deviceType = 'mobile';
    else if (isTablet) deviceType = 'tablet';

    let platform: keyof InstallationMetrics['platforms'] = 'windows';
    if (userAgent.includes('android')) platform = 'android';
    else if (userAgent.includes('iphone') || userAgent.includes('ipad')) platform = 'ios';
    else if (userAgent.includes('mac')) platform = 'mac';
    else if (userAgent.includes('linux')) platform = 'linux';

    const newMetrics = { ...metrics };
    newMetrics.deviceTypes[deviceType]++;
    newMetrics.platforms[platform]++;
    saveMetrics(newMetrics);
  };

  const recordDeclined = () => {
    const newMetrics = {
      ...metrics,
      installsDeclined: metrics.installsDeclined + 1
    };
    newMetrics.installationRate = calculateInstallationRate(newMetrics);
    saveMetrics(newMetrics);
  };

  const resetMetrics = () => {
    const resetMetrics: InstallationMetrics = {
      promptsShown: 0,
      installsCompleted: 0,
      installsDeclined: 0,
      installationRate: 0,
      deviceTypes: { mobile: 0, desktop: 0, tablet: 0 },
      platforms: { android: 0, ios: 0, windows: 0, mac: 0, linux: 0 }
    };
    saveMetrics(resetMetrics);
  };

  const exportMetrics = () => {
    const dataStr = JSON.stringify(metrics, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'pwa-installation-metrics.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  // Only show in development mode
  if (!import.meta.env.DEV) {
    return null;
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          PWA Installation Analytics (Dev Only)
        </CardTitle>
        <CardDescription>
          Development analytics - not visible to production users
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
