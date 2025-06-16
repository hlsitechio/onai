
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useVercelIntegration } from '@/hooks/useVercelIntegration';
import { RefreshCw, ExternalLink, Play, Settings, BarChart3 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VercelProject {
  id: string;
  name: string;
  framework?: string;
  deployment_url?: string;
  build_command?: string;
  output_directory?: string;
  environment_variables?: Record<string, string>;
  created_at?: string;
  updated_at?: string;
}

const VercelDashboard = () => {
  const {
    projects,
    deploymentLogs,
    isLoading,
    fetchProjects,
    createDeployment,
    fetchDeploymentLogs,
  } = useVercelIntegration();
  
  const { toast } = useToast();
  const [selectedProject, setSelectedProject] = useState<VercelProject | null>(null);

  useEffect(() => {
    fetchProjects();
    fetchDeploymentLogs();
  }, [fetchProjects, fetchDeploymentLogs]);

  const handleDeploy = async (project: VercelProject) => {
    try {
      await createDeployment({
        projectId: project.id,
        target: 'production',
      });
      
      // Refresh logs after deployment
      setTimeout(() => {
        fetchDeploymentLogs(project.id);
      }, 2000);
    } catch (error) {
      console.error('Deployment failed:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'ready':
      case 'success':
        return 'bg-green-500';
      case 'building':
      case 'pending':
        return 'bg-yellow-500';
      case 'error':
      case 'failed':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-noteflow-400 to-purple-400 bg-clip-text text-transparent">
            Vercel Integration
          </h1>
          <p className="text-gray-400 mt-2">
            Manage your Vercel deployments and monitor performance
          </p>
        </div>
        <Button
          onClick={fetchProjects}
          disabled={isLoading}
          className="bg-gradient-to-r from-noteflow-500 to-purple-500"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <Tabs defaultValue="projects" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="deployments">Deployments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="projects" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Card key={project.id} className="border-white/10 bg-black/40 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-white">{project.name}</CardTitle>
                      <CardDescription className="text-gray-400">
                        {project.framework || 'Unknown framework'}
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="text-noteflow-400 border-noteflow-400">
                      {project.framework || 'N/A'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-sm text-gray-400">
                    <p><strong>Build:</strong> {project.build_command || 'npm run build'}</p>
                    <p><strong>Output:</strong> {project.output_directory || 'dist'}</p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleDeploy(project)}
                      disabled={isLoading}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Play className="w-4 h-4 mr-1" />
                      Deploy
                    </Button>
                    
                    {project.deployment_url && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(`https://${project.deployment_url}`, '_blank')}
                        className="border-white/20 text-white hover:bg-white/10"
                      >
                        <ExternalLink className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    )}
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedProject(project)}
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      <Settings className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {projects.length === 0 && !isLoading && (
            <Card className="border-white/10 bg-black/40 backdrop-blur-sm">
              <CardContent className="text-center py-8">
                <p className="text-gray-400">No Vercel projects found. Make sure your Vercel token is configured.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="deployments" className="space-y-4">
          <Card className="border-white/10 bg-black/40 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Recent Deployments</CardTitle>
              <CardDescription className="text-gray-400">
                Latest deployment history and status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {deploymentLogs.slice(0, 10).map((log) => (
                  <div
                    key={log.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-white/10 bg-white/5"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(log.status)}`} />
                      <div>
                        <p className="text-white font-medium">
                          {log.deployment_id.substring(0, 8)}...
                        </p>
                        <p className="text-sm text-gray-400">
                          {log.branch || 'main'} • {new Date(log.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <Badge variant="outline" className={`${getStatusColor(log.status)} text-white border-0`}>
                        {log.status}
                      </Badge>
                      {log.build_duration && (
                        <p className="text-sm text-gray-400 mt-1">
                          {Math.round(log.build_duration / 1000)}s
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              {deploymentLogs.length === 0 && (
                <p className="text-center text-gray-400 py-4">
                  No deployment logs found
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card className="border-white/10 bg-black/40 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                Deployment Analytics
              </CardTitle>
              <CardDescription className="text-gray-400">
                Performance metrics and insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 rounded-lg bg-white/5">
                  <div className="text-2xl font-bold text-noteflow-400">
                    {projects.length}
                  </div>
                  <div className="text-sm text-gray-400">Projects</div>
                </div>
                
                <div className="text-center p-4 rounded-lg bg-white/5">
                  <div className="text-2xl font-bold text-green-400">
                    {deploymentLogs.filter(log => log.status === 'ready').length}
                  </div>
                  <div className="text-sm text-gray-400">Successful</div>
                </div>
                
                <div className="text-center p-4 rounded-lg bg-white/5">
                  <div className="text-2xl font-bold text-red-400">
                    {deploymentLogs.filter(log => log.status === 'error').length}
                  </div>
                  <div className="text-sm text-gray-400">Failed</div>
                </div>
                
                <div className="text-center p-4 rounded-lg bg-white/5">
                  <div className="text-2xl font-bold text-yellow-400">
                    {deploymentLogs.filter(log => log.status === 'building').length}
                  </div>
                  <div className="text-sm text-gray-400">Building</div>
                </div>
              </div>
              
              <div className="mt-6 text-center text-gray-400">
                <p>Detailed analytics coming soon...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VercelDashboard;
