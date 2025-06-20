
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, CheckCircle, ExternalLink, RefreshCw, Settings } from 'lucide-react';
import { sentryAPI, type SentryIssue } from '@/utils/sentryAPI';
import { cleanConsoleControls } from '@/utils/console/CleanConsoleManager';

interface LocalError {
  id: string;
  message: string;
  stack?: string;
  timestamp: Date;
  level: 'error' | 'warn' | 'info';
  component?: string;
  url: string;
}

const ErrorDashboard: React.FC = () => {
  const [sentryIssues, setSentryIssues] = useState<SentryIssue[]>([]);
  const [localErrors, setLocalErrors] = useState<LocalError[]>([]);
  const [loading, setLoading] = useState(false);
  const [sentryAuthToken, setSentryAuthToken] = useState('');
  const [showTokenForm, setShowTokenForm] = useState(!sentryAPI.isConfigured());

  const fetchSentryData = async () => {
    if (!sentryAPI.isConfigured()) return;
    
    setLoading(true);
    try {
      const issues = await sentryAPI.getRecentIssues(50);
      setSentryIssues(issues);
    } catch (error) {
      console.error('Failed to fetch Sentry data:', error);
    } finally {
      setLoading(false);
    }
  };

  const setupSentryAuth = () => {
    if (sentryAuthToken.trim()) {
      sentryAPI.setAuthToken(sentryAuthToken.trim());
      setShowTokenForm(false);
      fetchSentryData();
    }
  };

  const loadLocalErrors = () => {
    // Get errors from localStorage if any
    try {
      const stored = localStorage.getItem('error-dashboard-logs');
      if (stored) {
        const errors = JSON.parse(stored);
        setLocalErrors(errors.slice(-50)); // Keep last 50 errors
      }
    } catch (error) {
      console.error('Failed to load local errors:', error);
    }
  };

  const clearLocalErrors = () => {
    localStorage.removeItem('error-dashboard-logs');
    setLocalErrors([]);
  };

  useEffect(() => {
    fetchSentryData();
    loadLocalErrors();

    // Set up error capture
    const originalError = console.error;
    const originalWarn = console.warn;

    const captureError = (level: 'error' | 'warn', ...args: any[]) => {
      const message = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
      ).join(' ');

      const error: LocalError = {
        id: Date.now().toString(),
        message,
        timestamp: new Date(),
        level,
        url: window.location.href,
        stack: new Error().stack
      };

      setLocalErrors(prev => {
        const updated = [...prev, error].slice(-50);
        localStorage.setItem('error-dashboard-logs', JSON.stringify(updated));
        return updated;
      });

      // Call original method
      if (level === 'error') {
        originalError.apply(console, args);
      } else {
        originalWarn.apply(console, args);
      }
    };

    console.error = (...args) => captureError('error', ...args);
    console.warn = (...args) => captureError('warn', ...args);

    // Cleanup
    return () => {
      console.error = originalError;
      console.warn = originalWarn;
    };
  }, []);

  const getStatusColor = (level: string) => {
    switch (level) {
      case 'error': return 'destructive';
      case 'warning': return 'secondary';
      case 'info': return 'default';
      default: return 'outline';
    }
  };

  const totalErrors = sentryIssues.length + localErrors.filter(e => e.level === 'error').length;
  const totalWarnings = localErrors.filter(e => e.level === 'warn').length;

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Error Monitoring Dashboard</h2>
          <p className="text-gray-400">Monitor and track application errors in real-time</p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={fetchSentryData} disabled={loading} size="sm">
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={() => setShowTokenForm(true)} variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Errors</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-400">{totalErrors}</div>
            <p className="text-xs text-gray-400">Last 24 hours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Warnings</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-400">{totalWarnings}</div>
            <p className="text-xs text-gray-400">Active warnings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sentry Status</CardTitle>
            <CheckCircle className={`h-4 w-4 ${sentryAPI.isConfigured() ? 'text-green-400' : 'text-gray-400'}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${sentryAPI.isConfigured() ? 'text-green-400' : 'text-gray-400'}`}>
              {sentryAPI.isConfigured() ? 'Connected' : 'Not Setup'}
            </div>
            <p className="text-xs text-gray-400">API Integration</p>
          </CardContent>
        </Card>
      </div>

      {/* Auth Token Form */}
      {showTokenForm && (
        <Card>
          <CardHeader>
            <CardTitle>Sentry API Configuration</CardTitle>
            <CardDescription>
              Configure Sentry API access to fetch errors from your dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sentry-token">Sentry Auth Token</Label>
              <Input
                id="sentry-token"
                type="password"
                placeholder="Enter your Sentry auth token"
                value={sentryAuthToken}
                onChange={(e) => setSentryAuthToken(e.target.value)}
              />
            </div>
            <div className="flex space-x-2">
              <Button onClick={setupSentryAuth} disabled={!sentryAuthToken.trim()}>
                Connect to Sentry
              </Button>
              <Button variant="outline" onClick={() => setShowTokenForm(false)}>
                Cancel
              </Button>
            </div>
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Instructions</AlertTitle>
              <AlertDescription className="whitespace-pre-line">
                {sentryAPI.getAuthTokenInstructions()}
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}

      {/* Error Tabs */}
      <Tabs defaultValue="sentry" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sentry">Sentry Issues ({sentryIssues.length})</TabsTrigger>
          <TabsTrigger value="local">Local Errors ({localErrors.length})</TabsTrigger>
          <TabsTrigger value="console">Console Status</TabsTrigger>
        </TabsList>

        <TabsContent value="sentry" className="space-y-4">
          {sentryIssues.length === 0 ? (
            <Card>
              <CardContent className="flex items-center justify-center py-8">
                <div className="text-center">
                  <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-white">No Sentry issues found</p>
                  <p className="text-gray-400">Your application is running smoothly!</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {sentryIssues.map((issue) => (
                <Card key={issue.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center space-x-2">
                          <Badge variant={getStatusColor(issue.level)}>
                            {issue.level}
                          </Badge>
                          <span className="text-sm text-gray-400">#{issue.shortId}</span>
                        </div>
                        <h3 className="font-medium text-white">{issue.title}</h3>
                        <p className="text-sm text-gray-400">{issue.culprit}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>Count: {issue.count}</span>
                          <span>Users: {issue.userCount}</span>
                          <span>Last seen: {new Date(issue.lastSeen).toLocaleString()}</span>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(issue.permalink, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="local" className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-400">Local errors captured in this session</p>
            <Button onClick={clearLocalErrors} variant="outline" size="sm">
              Clear All
            </Button>
          </div>
          
          {localErrors.length === 0 ? (
            <Card>
              <CardContent className="flex items-center justify-center py-8">
                <div className="text-center">
                  <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-white">No local errors</p>
                  <p className="text-gray-400">No errors have been captured locally</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {localErrors.reverse().map((error) => (
                <Card key={error.id}>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Badge variant={getStatusColor(error.level)}>
                          {error.level}
                        </Badge>
                        <span className="text-xs text-gray-400">
                          {error.timestamp.toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-white font-mono">{error.message}</p>
                      {error.component && (
                        <p className="text-xs text-gray-400">Component: {error.component}</p>
                      )}
                      <p className="text-xs text-gray-500">{error.url}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="console" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Console Monitoring Status</CardTitle>
              <CardDescription>Current state of console monitoring and suppression</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {(() => {
                  const status = cleanConsoleControls.getStatus();
                  const counts = cleanConsoleControls.getSuppressedCounts();
                  
                  return (
                    <>
                      <div className="flex items-center justify-between">
                        <span>Console Suppression</span>
                        <Badge variant={status.isActive ? "default" : "secondary"}>
                          {status.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <div>
                          <p className="text-xs text-gray-400">Logs</p>
                          <p className="text-lg font-medium">{counts.log}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Info</p>
                          <p className="text-lg font-medium">{counts.info}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Warnings</p>
                          <p className="text-lg font-medium">{counts.warn}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Errors</p>
                          <p className="text-lg font-medium">{counts.error}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Debug</p>
                          <p className="text-lg font-medium">{counts.debug}</p>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button 
                          onClick={cleanConsoleControls.restore} 
                          variant="outline" 
                          size="sm"
                        >
                          Restore Console
                        </Button>
                        <Button 
                          onClick={cleanConsoleControls.clearAndShowWelcome} 
                          variant="outline" 
                          size="sm"
                        >
                          Clear & Welcome
                        </Button>
                      </div>
                    </>
                  );
                })()}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ErrorDashboard;
