
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDeployHooks } from '@/hooks/useDeployHooks';
import { useVercelIntegration } from '@/hooks/useVercelIntegration';
import { Plus, Copy, Trash2, Power, PowerOff, ExternalLink, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const DeployHooksManager = () => {
  const { deployHooks, isLoading, fetchDeployHooks, createDeployHook, deleteDeployHook, toggleDeployHook } = useDeployHooks();
  const { projects, fetchProjects } = useVercelIntegration();
  const { toast } = useToast();
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newHook, setNewHook] = useState({
    hookName: '',
    vercelProjectId: '',
    branch: 'main',
  });

  useEffect(() => {
    fetchDeployHooks();
    fetchProjects();
  }, [fetchDeployHooks, fetchProjects]);

  const handleCreateHook = async () => {
    if (!newHook.hookName || !newHook.vercelProjectId) {
      toast({
        title: 'Missing fields',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    try {
      await createDeployHook(newHook);
      setIsCreateDialogOpen(false);
      setNewHook({ hookName: '', vercelProjectId: '', branch: 'main' });
    } catch (error) {
      console.error('Failed to create deploy hook:', error);
    }
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: 'Copied to clipboard',
        description: `${label} has been copied to your clipboard`,
      });
    } catch (error) {
      toast({
        title: 'Failed to copy',
        description: 'Could not copy to clipboard',
        variant: 'destructive',
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'success':
        return 'bg-green-500';
      case 'failed':
        return 'bg-red-500';
      case 'triggered':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Deploy Hooks</h2>
          <p className="text-gray-400 mt-1">
            Create webhooks to trigger deployments from external services
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button
            onClick={fetchDeployHooks}
            disabled={isLoading}
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-noteflow-500 to-purple-500">
                <Plus className="w-4 h-4 mr-2" />
                Create Hook
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-black/90 border-white/10">
              <DialogHeader>
                <DialogTitle className="text-white">Create Deploy Hook</DialogTitle>
                <DialogDescription className="text-gray-400">
                  Create a webhook that can trigger deployments for your Vercel project
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="hook-name" className="text-white">Hook Name</Label>
                  <Input
                    id="hook-name"
                    placeholder="e.g., Production Deploy"
                    value={newHook.hookName}
                    onChange={(e) => setNewHook(prev => ({ ...prev, hookName: e.target.value }))}
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="project" className="text-white">Vercel Project</Label>
                  <Select onValueChange={(value) => setNewHook(prev => ({ ...prev, vercelProjectId: value }))}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue placeholder="Select a project" />
                    </SelectTrigger>
                    <SelectContent>
                      {projects.map((project) => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="branch" className="text-white">Branch</Label>
                  <Input
                    id="branch"
                    placeholder="main"
                    value={newHook.branch}
                    onChange={(e) => setNewHook(prev => ({ ...prev, branch: e.target.value }))}
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
                
                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setIsCreateDialogOpen(false)}
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateHook}
                    disabled={isLoading}
                    className="bg-gradient-to-r from-noteflow-500 to-purple-500"
                  >
                    Create Hook
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="hooks" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="hooks">Hooks</TabsTrigger>
          <TabsTrigger value="logs">Activity Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="hooks" className="space-y-4">
          {deployHooks.length === 0 ? (
            <Card className="border-white/10 bg-black/40 backdrop-blur-sm">
              <CardContent className="text-center py-8">
                <p className="text-gray-400">
                  No deploy hooks found. Create your first hook to get started.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {deployHooks.map((hook) => (
                <Card key={hook.id} className="border-white/10 bg-black/40 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-white flex items-center gap-2">
                          {hook.hook_name}
                          <Badge 
                            variant="outline" 
                            className={`${hook.is_active ? 'text-green-400 border-green-400' : 'text-red-400 border-red-400'}`}
                          >
                            {hook.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </CardTitle>
                        <CardDescription className="text-gray-400">
                          Branch: {hook.branch} • Triggers: {hook.trigger_count}
                          {hook.last_triggered_at && (
                            <> • Last triggered: {new Date(hook.last_triggered_at).toLocaleString()}</>
                          )}
                        </CardDescription>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleDeployHook(hook.id)}
                          className="border-white/20 text-white hover:bg-white/10"
                        >
                          {hook.is_active ? (
                            <PowerOff className="w-4 h-4" />
                          ) : (
                            <Power className="w-4 h-4" />
                          )}
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteDeployHook(hook.id)}
                          className="border-red-400/20 text-red-400 hover:bg-red-400/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-3">
                    <div>
                      <Label className="text-sm text-gray-400">Webhook URL</Label>
                      <div className="flex gap-2 mt-1">
                        <Input
                          readOnly
                          value={hook.webhook_url}
                          className="bg-white/5 border-white/10 text-white font-mono text-sm"
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyToClipboard(hook.webhook_url, 'Webhook URL')}
                          className="border-white/20 text-white hover:bg-white/10"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-sm text-gray-400">Webhook Secret</Label>
                      <div className="flex gap-2 mt-1">
                        <Input
                          readOnly
                          type="password"
                          value={hook.webhook_secret}
                          className="bg-white/5 border-white/10 text-white font-mono text-sm"
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyToClipboard(hook.webhook_secret, 'Webhook Secret')}
                          className="border-white/20 text-white hover:bg-white/10"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <Card className="border-white/10 bg-black/40 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Recent Activity</CardTitle>
              <CardDescription className="text-gray-400">
                Latest webhook triggers and deployment status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {deployHooks
                  .flatMap(hook => 
                    hook.deploy_hook_logs?.map(log => ({
                      ...log,
                      hook_name: hook.hook_name,
                    })) || []
                  )
                  .sort((a, b) => new Date(b.triggered_at).getTime() - new Date(a.triggered_at).getTime())
                  .slice(0, 10)
                  .map((log) => (
                    <div
                      key={log.id}
                      className="flex items-center justify-between p-3 rounded-lg border border-white/10 bg-white/5"
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(log.status)}`} />
                        <div>
                          <p className="text-white font-medium">{log.hook_name}</p>
                          <p className="text-sm text-gray-400">
                            {new Date(log.triggered_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={`${getStatusColor(log.status)} text-white border-0`}>
                          {log.status}
                        </Badge>
                        {log.deployment_id && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(`https://vercel.com/dashboard/deployments/${log.deployment_id}`, '_blank')}
                            className="border-white/20 text-white hover:bg-white/10"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                
                {deployHooks.every(hook => !hook.deploy_hook_logs?.length) && (
                  <p className="text-center text-gray-400 py-4">
                    No activity logs found
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DeployHooksManager;
