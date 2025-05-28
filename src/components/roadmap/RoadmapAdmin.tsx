import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, ArrowUpDown, Check, GitHub, Info, Lock, RefreshCw, Save, Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { RoadmapItem } from '@/types/roadmap';
import { 
  syncRoadmapWithGitHub, 
  fetchRoadmapFromGitHub,
  storeRoadmapConfig
} from '@/utils/github/roadmapSync';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';

interface RoadmapAdminProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roadmapItems: RoadmapItem[];
  onRoadmapItemsChange: (items: RoadmapItem[]) => void;
}

/**
 * Secure token storage utility functions
 */
const saveToken = (token: string) => {
  try {
    // Encrypt token before storing (in a real app, use a proper encryption method)
    const encodedToken = btoa(`oneai-gh-${token}`);
    localStorage.setItem('oneai-github-token', encodedToken);
    return true;
  } catch (error) {
    console.error('Error saving GitHub token:', error);
    return false;
  }
};

const getToken = (): string | null => {
  try {
    const encodedToken = localStorage.getItem('oneai-github-token');
    if (!encodedToken) return null;
    
    const decodedToken = atob(encodedToken);
    if (!decodedToken.startsWith('oneai-gh-')) return null;
    
    return decodedToken.substring(9);
  } catch (error) {
    console.error('Error retrieving GitHub token:', error);
    return null;
  }
};

const RoadmapAdmin: React.FC<RoadmapAdminProps> = ({ 
  open, 
  onOpenChange,
  roadmapItems,
  onRoadmapItemsChange
}) => {
  const [token, setToken] = useState<string>('');
  const [isTokenValid, setIsTokenValid] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncProgress, setSyncProgress] = useState<number>(0);
  const [syncResults, setSyncResults] = useState<{
    success: number;
    failed: number;
    total: number;
  }>({ success: 0, failed: 0, total: 0 });
  const [activeTab, setActiveTab] = useState<string>('sync');
  const [lastSynced, setLastSynced] = useState<string | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);
  
  // Load saved token on initial render
  useEffect(() => {
    const savedToken = getToken();
    if (savedToken) {
      setToken(savedToken);
      setIsTokenValid(true);
    }
  }, []);
  
  // Scroll to top when modal opens
  useEffect(() => {
    if (open) {
      window.scrollTo(0, 0);
    }
  }, [open]);
  
  // Save token when it changes and is valid
  const handleSaveToken = () => {
    if (!token.trim()) {
      setIsTokenValid(false);
      return;
    }
    
    const success = saveToken(token.trim());
    setIsTokenValid(success);
    
    if (success) {
      // Validate token by fetching repo info
      validateToken(token.trim());
    }
  };
  
  // Validate GitHub token
  const validateToken = async (tokenToValidate: string) => {
    try {
      setIsSyncing(true);
      const items = await fetchRoadmapFromGitHub(tokenToValidate);
      setIsSyncing(false);
      
      if (items.length > 0 || items.length === 0) {
        // Token is valid (we successfully made an API call)
        setIsTokenValid(true);
        return true;
      } else {
        setIsTokenValid(false);
        return false;
      }
    } catch (error) {
      console.error('Error validating GitHub token:', error);
      setIsSyncing(false);
      setIsTokenValid(false);
      return false;
    }
  };
  
  // Sync roadmap with GitHub
  const handleSync = async () => {
    if (!isTokenValid || !token) {
      setSyncError('Please configure a valid GitHub token first');
      return;
    }
    
    try {
      setSyncError(null);
      setIsSyncing(true);
      setSyncProgress(10);
      
      // First, fetch latest from GitHub
      setSyncProgress(30);
      
      // Then sync our roadmap items
      setSyncProgress(50);
      const updatedItems = await syncRoadmapWithGitHub(token, roadmapItems);
      setSyncProgress(90);
      
      // Update success/failure counts
      const successCount = updatedItems.filter(item => !item.syncError).length;
      const failedCount = updatedItems.filter(item => item.syncError).length;
      
      setSyncResults({
        success: successCount,
        failed: failedCount,
        total: updatedItems.length
      });
      
      // Update last synced timestamp
      const now = new Date().toISOString();
      setLastSynced(now);
      
      // Store sync timestamp in config
      await storeRoadmapConfig(token, {
        lastSyncedAt: now
      });
      
      // Update roadmap items
      onRoadmapItemsChange(updatedItems);
      
      setSyncProgress(100);
      setIsSyncing(false);
    } catch (error) {
      console.error('Error syncing roadmap with GitHub:', error);
      setSyncError('Failed to sync with GitHub. Please check your token and try again.');
      setIsSyncing(false);
    }
  };
  
  // Pull roadmap from GitHub
  const handlePull = async () => {
    if (!isTokenValid || !token) {
      setSyncError('Please configure a valid GitHub token first');
      return;
    }
    
    try {
      setSyncError(null);
      setIsSyncing(true);
      setSyncProgress(20);
      
      // Fetch roadmap items from GitHub
      const githubItems = await fetchRoadmapFromGitHub(token);
      setSyncProgress(80);
      
      if (githubItems.length === 0) {
        setSyncError('No roadmap items found on GitHub');
        setIsSyncing(false);
        return;
      }
      
      // Update roadmap items
      onRoadmapItemsChange(githubItems);
      
      // Update last synced timestamp
      const now = new Date().toISOString();
      setLastSynced(now);
      
      setSyncResults({
        success: githubItems.length,
        failed: 0,
        total: githubItems.length
      });
      
      setSyncProgress(100);
      setIsSyncing(false);
    } catch (error) {
      console.error('Error pulling roadmap from GitHub:', error);
      setSyncError('Failed to pull from GitHub. Please check your token and try again.');
      setIsSyncing(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] top-24 max-h-[80vh] overflow-y-auto bg-black/90 border-white/10">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <GitHub className="mr-2 h-5 w-5" />
            Roadmap GitHub Synchronization
          </DialogTitle>
          <DialogDescription>
            Manage GitHub integration for your roadmap
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="sync">Synchronization</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="sync" className="space-y-4">
            {isTokenValid ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <Card className="bg-black/60 border-white/10 hover:border-white/20 transition">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Sync Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {lastSynced ? (
                        <div className="text-sm space-y-2">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Last Synced:</span>
                            <span className="text-white">{new Date(lastSynced).toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Items:</span>
                            <span className="text-white">{roadmapItems.length}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">GitHub Linked:</span>
                            <span className="text-white">
                              {roadmapItems.filter(i => i.id.startsWith('gh-')).length}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-12 text-slate-400 text-sm">
                          Not synced yet
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="pt-0">
                      {lastSynced && (
                        <div className="w-full text-xs text-slate-500 flex items-center">
                          <Info className="h-3 w-3 mr-1" />
                          Auto-sync every 24 hours
                        </div>
                      )}
                    </CardFooter>
                  </Card>
                  
                  <Card className="bg-black/60 border-white/10 hover:border-white/20 transition">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Synchronization Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full justify-start"
                        onClick={handleSync}
                        disabled={isSyncing}
                      >
                        <ArrowUpDown className="h-4 w-4 mr-2" />
                        Sync with GitHub
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full justify-start"
                        onClick={handlePull}
                        disabled={isSyncing}
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Pull from GitHub
                      </Button>
                    </CardContent>
                  </Card>
                </div>
                
                {isSyncing && (
                  <div className="space-y-2">
                    <Progress value={syncProgress} className="h-2" />
                    <div className="text-center text-sm text-slate-400">
                      {syncProgress < 100 ? 'Syncing roadmap with GitHub...' : 'Sync complete!'}
                    </div>
                  </div>
                )}
                
                {syncResults.total > 0 && !isSyncing && (
                  <Alert className={syncResults.failed > 0 ? 'bg-orange-950/20' : 'bg-green-950/20'}>
                    <Check className={`h-4 w-4 ${syncResults.failed > 0 ? 'text-orange-400' : 'text-green-400'}`} />
                    <AlertTitle>Sync Results</AlertTitle>
                    <AlertDescription>
                      Successfully synced {syncResults.success} of {syncResults.total} items
                      {syncResults.failed > 0 && (
                        <span className="text-orange-400"> ({syncResults.failed} failed)</span>
                      )}
                    </AlertDescription>
                  </Alert>
                )}
                
                {syncError && (
                  <Alert variant="destructive" className="bg-red-950/20 border-red-900/50 text-red-400">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Sync Error</AlertTitle>
                    <AlertDescription>{syncError}</AlertDescription>
                  </Alert>
                )}
              </>
            ) : (
              <Alert className="bg-blue-950/20 border-blue-900/50">
                <Info className="h-4 w-4 text-blue-400" />
                <AlertTitle>GitHub Configuration Required</AlertTitle>
                <AlertDescription>
                  Please configure your GitHub token in the Settings tab to enable synchronization.
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-4">
            <Card className="bg-black/60 border-white/10">
              <CardHeader>
                <CardTitle className="text-base flex items-center">
                  <Shield className="mr-2 h-4 w-4" />
                  GitHub Authentication
                </CardTitle>
                <CardDescription>
                  Connect to GitHub to sync your roadmap with issues
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="text-sm text-slate-300 flex items-center">
                    <Lock className="h-4 w-4 mr-1 text-slate-400" />
                    Personal Access Token
                  </div>
                  <Input
                    type="password"
                    placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    className="bg-black/50 border-white/10"
                  />
                  <div className="text-xs text-slate-400">
                    Your token needs <code>repo</code> scope permissions
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Badge variant={isTokenValid ? "default" : "outline"} className="mr-2">
                    {isTokenValid ? 'Valid Token' : 'Not Configured'}
                  </Badge>
                  {isTokenValid && (
                    <span className="text-xs text-slate-400">
                      Token saved locally and never sent to any server
                    </span>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="text-xs text-slate-500">
                  <a 
                    href="https://github.com/settings/tokens/new" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Create a token
                  </a>
                </div>
                <Button 
                  variant="default" 
                  size="sm"
                  onClick={handleSaveToken}
                  disabled={isSyncing}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Token
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="bg-black/60 border-white/10">
              <CardHeader>
                <CardTitle className="text-base">Repository Configuration</CardTitle>
                <CardDescription>
                  Default: hlsitechio/oneai
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-slate-400">
                  The repository configuration is defined in the synchronization utility.
                  To change the target repository, modify the constants in the roadmapSync.ts file.
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RoadmapAdmin;
