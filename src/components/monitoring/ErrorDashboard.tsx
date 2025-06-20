
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertTriangle, CheckCircle, ExternalLink, RefreshCw, Settings, Trash2, Eye, Copy } from 'lucide-react';
import { sentryAPI, type SentryIssue } from '@/utils/sentryAPI';
import { cleanConsoleControls } from '@/utils/console/CleanConsoleManager';
import { useErrorMonitoring } from '@/contexts/ErrorMonitoringContext';
import { useToast } from '@/hooks/use-toast';

const ErrorDashboard: React.FC = () => {
  const { errors, sentryIssues, clearErrors, refreshSentryData, isMonitoring, toggleMonitoring } = useErrorMonitoring();
  const [loading, setLoading] = useState(false);
  const [sentryAuthToken, setSentryAuthToken] = useState('');
  const [showTokenForm, setShowTokenForm] = useState(!sentryAPI.isConfigured());
  const [selectedError, setSelectedError] = useState<any>(null);
  const { toast } = useToast();

  const fetchSentryData = async () => {
    if (!sentryAPI.isConfigured()) return;
    
    setLoading(true);
    try {
      await refreshSentryData();
      toast({
        title: "Success",
        description: "Sentry data refreshed successfully",
      });
    } catch (error) {
      console.error('Failed to fetch Sentry data:', error);
      toast({
        title: "Error",
        description: "Failed to refresh Sentry data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const setupSentryAuth = () => {
    if (sentryAuthToken.trim()) {
      sentryAPI.setAuthToken(sentryAuthToken.trim());
      setShowTokenForm(false);
      fetchSentryData();
      toast({
        title: "Success",
        description: "Sentry API connected successfully",
      });
    }
  };

  const clearAllErrors = () => {
    clearErrors();
    toast({
      title: "Success",
      description: "All local errors cleared",
    });
  };

  const copyErrorDetails = (error: any) => {
    const details = JSON.stringify(error, null, 2);
    navigator.clipboard.writeText(details);
    toast({
      title: "Copied",
      description: "Error details copied to clipboard",
    });
  };

  useEffect(() => {
    // Initial fetch
    fetchSentryData();
    
    // Set up periodic refresh
    const interval = setInterval(fetchSentryData, 5 * 60 * 1000); // Every 5 minutes
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'error': return 'destructive';
      case 'warning': 
      case 'warn': return 'secondary';
      case 'info': return 'default';
      default: return 'outline';
    }
  };

  const recentErrors = errors.filter(error => 
    Date.now() - error.timestamp.getTime() < 24 * 60 * 60 * 1000
  ).length;

  const criticalErrors = errors.filter(error => 
    error.level === 'error' && Date.now() - error.timestamp.getTime() < 60 * 60 * 1000
  ).length;

  const totalWarnings = errors.filter(e => e.level === 'warn').length;

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-[#050510] to-[#0a0518] min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Error Monitoring Dashboard</h2>
          <p className="text-gray-400">Monitor and track application errors in real-time</p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={fetchSentryData} disabled={loading} size="sm" variant="outline">
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={() => setShowTokenForm(true)} variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button 
            onClick={toggleMonitoring} 
            variant={isMonitoring ? "destructive" : "default"} 
            size="sm"
          >
            {isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}
          </Button>
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-black/20 backdrop-blur-sm border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Recent Errors</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-400">{recentErrors}</div>
            <p className="text-xs text-gray-400">Last 24 hours</p>
          </CardContent>
        </Card>

        <Card className="bg-black/20 backdrop-blur-sm border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Critical Errors</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-400">{criticalErrors}</div>
            <p className="text-xs text-gray-400">Last hour</p>
          </CardContent>
        </Card>

        <Card className="bg-black/20 backdrop-blur-sm border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Warnings</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-400">{totalWarnings}</div>
            <p className="text-xs text-gray-400">Active warnings</p>
          </CardContent>
        </Card>

        <Card className="bg-black/20 backdrop-blur-sm border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Sentry Status</CardTitle>
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
        <Card className="bg-black/20 backdrop-blur-sm border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Sentry API Configuration</CardTitle>
            <CardDescription className="text-gray-400">
              Configure Sentry API access to fetch errors from your dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sentry-token" className="text-white">Sentry Auth Token</Label>
              <Input
                id="sentry-token"
                type="password"
                placeholder="Enter your Sentry auth token"
                value={sentryAuthToken}
                onChange={(e) => setSentryAuthToken(e.target.value)}
                className="bg-black/30 border-white/20 text-white"
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
            <Alert className="bg-amber-500/10 border-amber-500/20">
              <AlertTriangle className="h-4 w-4 text-amber-400" />
              <AlertTitle className="text-amber-300">Instructions</AlertTitle>
              <AlertDescription className="text-amber-200 whitespace-pre-line">
                {sentryAPI.getAuthTokenInstructions()}
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}

      {/* Error Tabs */}
      <Tabs defaultValue="sentry" className="space-y-4">
        <TabsList className="bg-black/20 backdrop-blur-sm border-white/10">
          <TabsTrigger value="sentry" className="data-[state=active]:bg-white/10">
            Sentry Issues ({sentryIssues.length})
          </TabsTrigger>
          <TabsTrigger value="local" className="data-[state=active]:bg-white/10">
            Local Errors ({errors.length})
          </TabsTrigger>
          <TabsTrigger value="console" className="data-[state=active]:bg-white/10">
            Console Status
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sentry" className="space-y-4">
          {sentryIssues.length === 0 ? (
            <Card className="bg-black/20 backdrop-blur-sm border-white/10">
              <CardContent className="flex items-center justify-center py-8">
                <div className="text-center">
                  <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-white">No Sentry issues found</p>
                  <p className="text-gray-400">Your application is running smoothly!</p>
                  {!sentryAPI.isConfigured() && (
                    <Button onClick={() => setShowTokenForm(true)} className="mt-4" variant="outline">
                      Configure Sentry API
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {sentryIssues.map((issue) => (
                <Card key={issue.id} className="bg-black/20 backdrop-blur-sm border-white/10">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center space-x-2">
                          <Badge variant={getStatusColor(issue.level)}>
                            {issue.level}
                          </Badge>
                          <span className="text-sm text-gray-400">#{issue.shortId}</span>
                          <Badge variant="outline" className="text-xs">
                            {issue.status}
                          </Badge>
                        </div>
                        <h3 className="font-medium text-white">{issue.title}</h3>
                        <p className="text-sm text-gray-400">{issue.culprit}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>Count: {issue.count}</span>
                          <span>Users: {issue.userCount}</span>
                          <span>First seen: {new Date(issue.firstSeen).toLocaleString()}</span>
                          <span>Last seen: {new Date(issue.lastSeen).toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyErrorDetails(issue)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(issue.permalink, '_blank')}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="local" className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-400">
              Local errors captured in this session (Monitoring: {isMonitoring ? 'ON' : 'OFF'})
            </p>
            <Button onClick={clearAllErrors} variant="outline" size="sm">
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          </div>
          
          {errors.length === 0 ? (
            <Card className="bg-black/20 backdrop-blur-sm border-white/10">
              <CardContent className="flex items-center justify-center py-8">
                <div className="text-center">
                  <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-white">No local errors</p>
                  <p className="text-gray-400">No errors have been captured locally</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-black/20 backdrop-blur-sm border-white/10">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/10">
                      <TableHead className="text-gray-300">Level</TableHead>
                      <TableHead className="text-gray-300">Message</TableHead>
                      <TableHead className="text-gray-300">Component</TableHead>
                      <TableHead className="text-gray-300">Time</TableHead>
                      <TableHead className="text-gray-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {errors.slice(-20).reverse().map((error) => (
                      <TableRow key={error.id} className="border-white/10">
                        <TableCell>
                          <Badge variant={getStatusColor(error.level)}>
                            {error.level}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-white font-mono text-xs max-w-md truncate">
                          {error.message}
                        </TableCell>
                        <TableCell className="text-gray-400 text-xs">
                          {error.component || 'Unknown'}
                        </TableCell>
                        <TableCell className="text-gray-400 text-xs">
                          {error.timestamp.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setSelectedError(error)}
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => copyErrorDetails(error)}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="console" className="space-y-4">
          <Card className="bg-black/20 backdrop-blur-sm border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Console Monitoring Status</CardTitle>
              <CardDescription className="text-gray-400">Current state of console monitoring and suppression</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {(() => {
                  const status = cleanConsoleControls.getStatus();
                  const counts = cleanConsoleControls.getSuppressedCounts();
                  
                  return (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-white">Console Suppression</span>
                        <Badge variant={status.isActive ? "default" : "secondary"}>
                          {status.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <div>
                          <p className="text-xs text-gray-400">Logs</p>
                          <p className="text-lg font-medium text-white">{counts.log}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Info</p>
                          <p className="text-lg font-medium text-white">{counts.info}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Warnings</p>
                          <p className="text-lg font-medium text-white">{counts.warn}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Errors</p>
                          <p className="text-lg font-medium text-white">{counts.error}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Debug</p>
                          <p className="text-lg font-medium text-white">{counts.debug}</p>
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

      {/* Error Detail Modal */}
      {selectedError && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setSelectedError(null)}>
          <Card className="bg-black/90 backdrop-blur-sm border-white/20 max-w-4xl max-h-[80vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            <CardHeader>
              <CardTitle className="text-white">Error Details</CardTitle>
              <Button
                onClick={() => setSelectedError(null)}
                variant="ghost"
                size="sm"
                className="absolute top-4 right-4"
              >
                ✕
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-gray-300">Message</Label>
                <p className="text-white font-mono text-sm bg-black/30 p-2 rounded">{selectedError.message}</p>
              </div>
              <div>
                <Label className="text-gray-300">Level</Label>
                <Badge variant={getStatusColor(selectedError.level)} className="ml-2">
                  {selectedError.level}
                </Badge>
              </div>
              <div>
                <Label className="text-gray-300">Timestamp</Label>
                <p className="text-white">{selectedError.timestamp.toLocaleString()}</p>
              </div>
              <div>
                <Label className="text-gray-300">URL</Label>
                <p className="text-white text-sm">{selectedError.url}</p>
              </div>
              {selectedError.stack && (
                <div>
                  <Label className="text-gray-300">Stack Trace</Label>
                  <pre className="text-white font-mono text-xs bg-black/30 p-2 rounded overflow-auto max-h-60">
                    {selectedError.stack}
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ErrorDashboard;
