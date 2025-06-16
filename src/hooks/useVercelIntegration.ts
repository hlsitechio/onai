
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
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

interface DeploymentLog {
  id: string;
  deployment_id: string;
  status: string;
  deployment_url?: string;
  commit_sha?: string;
  branch?: string;
  build_duration?: number;
  created_at: string;
  completed_at?: string;
  errors?: any[];
  warnings?: any[];
}

interface DeploymentRequest {
  projectId: string;
  gitSource?: {
    type: 'github';
    repo: string;
    ref?: string;
  };
  target?: 'production' | 'preview';
}

export const useVercelIntegration = () => {
  const [projects, setProjects] = useState<VercelProject[]>([]);
  const [deploymentLogs, setDeploymentLogs] = useState<DeploymentLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const callVercelFunction = useCallback(async (action: string, data?: any) => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.access_token) {
        throw new Error('Not authenticated');
      }

      const url = new URL(`https://qrdulwzjgbfgaplazgsh.supabase.co/functions/v1/vercel-integration`);
      url.searchParams.set('action', action);
      
      if (data && Object.keys(data).length > 0) {
        Object.entries(data).forEach(([key, value]) => {
          if (typeof value === 'string') {
            url.searchParams.set(key, value);
          }
        });
      }

      const response = await fetch(url.toString(), {
        method: data && !url.searchParams.has('deploymentId') && !url.searchParams.has('projectId') ? 'POST' : 'GET',
        headers: {
          'Authorization': `Bearer ${session.session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: data && !url.searchParams.has('deploymentId') && !url.searchParams.has('projectId') 
          ? JSON.stringify(data) 
          : undefined,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Vercel ${action} error:`, error);
      toast({
        title: 'Vercel Error',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: 'destructive',
      });
      throw error;
    }
  }, [toast]);

  const fetchProjects = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await callVercelFunction('list-projects');
      setProjects(result.projects || []);
      
      // Also fetch from local database
      const { data: localProjects } = await supabase
        .from('vercel_projects')
        .select('*')
        .order('updated_at', { ascending: false });
      
      if (localProjects) {
        setProjects(localProjects);
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setIsLoading(false);
    }
  }, [callVercelFunction]);

  const createDeployment = useCallback(async (deploymentRequest: DeploymentRequest) => {
    setIsLoading(true);
    try {
      const result = await callVercelFunction('create-deployment', deploymentRequest);
      
      toast({
        title: 'Deployment Started',
        description: `Deployment ${result.deployment.id} has been initiated`,
      });
      
      return result.deployment;
    } catch (error) {
      console.error('Failed to create deployment:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [callVercelFunction, toast]);

  const getDeploymentStatus = useCallback(async (deploymentId: string) => {
    try {
      const result = await callVercelFunction('get-deployment-status', { deploymentId });
      return result.deployment;
    } catch (error) {
      console.error('Failed to get deployment status:', error);
      throw error;
    }
  }, [callVercelFunction]);

  const fetchDeploymentLogs = useCallback(async (projectId?: string) => {
    try {
      let query = supabase
        .from('deployment_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (projectId) {
        query = query.eq('vercel_project_id', projectId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      setDeploymentLogs(data || []);
    } catch (error) {
      console.error('Failed to fetch deployment logs:', error);
    }
  }, []);

  const syncEnvironmentVariables = useCallback(async (
    projectId: string, 
    environmentVariables: Record<string, string>
  ) => {
    setIsLoading(true);
    try {
      await callVercelFunction('sync-environment', {
        projectId,
        environmentVariables,
      });
      
      toast({
        title: 'Environment Synced',
        description: 'Environment variables have been synchronized with Vercel',
      });
    } catch (error) {
      console.error('Failed to sync environment variables:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [callVercelFunction, toast]);

  const getAnalytics = useCallback(async (projectId: string, since: string = '7d') => {
    try {
      const result = await callVercelFunction('get-analytics', { projectId, since });
      return result.analytics;
    } catch (error) {
      console.error('Failed to get analytics:', error);
      throw error;
    }
  }, [callVercelFunction]);

  return {
    projects,
    deploymentLogs,
    isLoading,
    fetchProjects,
    createDeployment,
    getDeploymentStatus,
    fetchDeploymentLogs,
    syncEnvironmentVariables,
    getAnalytics,
  };
};
