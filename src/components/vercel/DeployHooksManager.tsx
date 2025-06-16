
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useDeployHooks } from '@/hooks/useDeployHooks';
import { useVercelIntegration } from '@/hooks/useVercelIntegration';
import ExternalHookImporter from './ExternalHookImporter';
import DeployHookAnalytics from './DeployHookAnalytics';
import CICDIntegrationGuide from './CICDIntegrationGuide';
import DeployHookCard from './DeployHookCard';
import ActivityLogsTab from './ActivityLogsTab';
import DeployHooksManagerHeader from './DeployHooksManagerHeader';

const DeployHooksManager = () => {
  const { deployHooks, isLoading, fetchDeployHooks, createDeployHook, deleteDeployHook, toggleDeployHook } = useDeployHooks();
  const { projects, fetchProjects } = useVercelIntegration();
  
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [selectedHookForCICD, setSelectedHookForCICD] = useState<any>(null);

  useEffect(() => {
    fetchDeployHooks();
    fetchProjects();
  }, [fetchDeployHooks, fetchProjects]);

  const handleRefresh = () => {
    fetchDeployHooks();
  };

  return (
    <div className="space-y-6">
      <DeployHooksManagerHeader
        onRefresh={handleRefresh}
        onImport={() => setIsImportDialogOpen(true)}
        isLoading={isLoading}
        projects={projects}
        onCreateHook={createDeployHook}
      />

      <Tabs defaultValue="hooks" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="hooks">Hooks</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="cicd">CI/CD Setup</TabsTrigger>
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
                <DeployHookCard
                  key={hook.id}
                  hook={hook}
                  onDelete={deleteDeployHook}
                  onToggle={toggleDeployHook}
                  onConfigureCICD={setSelectedHookForCICD}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <DeployHookAnalytics deployHooks={deployHooks} />
        </TabsContent>

        <TabsContent value="cicd" className="space-y-4">
          {selectedHookForCICD ? (
            <CICDIntegrationGuide 
              webhookUrl={selectedHookForCICD.webhook_url}
              hookName={selectedHookForCICD.hook_name}
            />
          ) : (
            <Card className="border-white/10 bg-black/40 backdrop-blur-sm">
              <CardContent className="text-center py-8">
                <p className="text-gray-400">
                  Select a deploy hook from the "Hooks" tab to view CI/CD integration instructions.
                </p>
                <Button
                  variant="outline"
                  className="mt-4 border-white/20 text-white hover:bg-white/10"
                  onClick={() => {
                    if (deployHooks.length > 0) {
                      setSelectedHookForCICD(deployHooks[0]);
                    }
                  }}
                >
                  {deployHooks.length > 0 ? 'Select First Hook' : 'Create a Hook First'}
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <ActivityLogsTab deployHooks={deployHooks} />
        </TabsContent>
      </Tabs>

      <ExternalHookImporter 
        isOpen={isImportDialogOpen}
        onClose={() => setIsImportDialogOpen(false)}
      />

      {selectedHookForCICD && (
        <Dialog open={!!selectedHookForCICD} onOpenChange={() => setSelectedHookForCICD(null)}>
          <DialogContent className="bg-black/90 border-white/10 max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-white">CI/CD Integration Setup</DialogTitle>
              <DialogDescription className="text-gray-400">
                Configure continuous integration for "{selectedHookForCICD.hook_name}"
              </DialogDescription>
            </DialogHeader>
            
            <CICDIntegrationGuide 
              webhookUrl={selectedHookForCICD.webhook_url}
              hookName={selectedHookForCICD.hook_name}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default DeployHooksManager;
