
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface DeployHook {
  id: string;
  hook_name: string;
  vercel_project_id: string;
  branch: string;
  webhook_url: string;
  webhook_secret: string;
  is_active: boolean;
  last_triggered_at?: string;
  trigger_count: number;
  created_at: string;
  updated_at: string;
  deploy_hook_logs?: DeployHookLog[];
}

interface DeployHookLog {
  id: string;
  triggered_at: string;
  status: string;
  deployment_id?: string;
}

interface CreateDeployHookRequest {
  hookName: string;
  vercelProjectId: string;
  branch?: string;
}

export const useDeployHooks = () => {
  const [deployHooks, setDeployHooks] = useState<DeployHook[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const callDeployHooksFunction = useCallback(async (action: string, data?: any) => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.access_token) {
        throw new Error('Not authenticated');
      }

      const url = new URL(`https://qrdulwzjgbfgaplazgsh.supabase.co/functions/v1/deploy-hooks`);
      url.searchParams.set('action', action);
      
      if (data && typeof data === 'object') {
        Object.entries(data).forEach(([key, value]) => {
          if (typeof value === 'string') {
            url.searchParams.set(key, value);
          }
        });
      }

      const response = await fetch(url.toString(), {
        method: data && !url.searchParams.has('hook_id') && !url.searchParams.has('project_id') ? 'POST' : 'GET',
        headers: {
          'Authorization': `Bearer ${session.session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: data && !url.searchParams.has('hook_id') && !url.searchParams.has('project_id') 
          ? JSON.stringify(data) 
          : undefined,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Deploy Hooks ${action} error:`, error);
      toast({
        title: 'Deploy Hooks Error',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: 'destructive',
      });
      throw error;
    }
  }, [toast]);

  const fetchDeployHooks = useCallback(async (projectId?: string) => {
    setIsLoading(true);
    try {
      const params = projectId ? { project_id: projectId } : undefined;
      const result = await callDeployHooksFunction('list', params);
      setDeployHooks(result.deploy_hooks || []);
    } catch (error) {
      console.error('Failed to fetch deploy hooks:', error);
    } finally {
      setIsLoading(false);
    }
  }, [callDeployHooksFunction]);

  const createDeployHook = useCallback(async (request: CreateDeployHookRequest) => {
    setIsLoading(true);
    try {
      const result = await callDeployHooksFunction('create', request);
      
      toast({
        title: 'Deploy Hook Created',
        description: `Deploy hook "${request.hookName}" has been created successfully`,
      });
      
      // Refresh the list
      await fetchDeployHooks();
      
      return result;
    } catch (error) {
      console.error('Failed to create deploy hook:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [callDeployHooksFunction, fetchDeployHooks, toast]);

  const deleteDeployHook = useCallback(async (hookId: string) => {
    setIsLoading(true);
    try {
      await callDeployHooksFunction('delete', { hook_id: hookId });
      
      toast({
        title: 'Deploy Hook Deleted',
        description: 'Deploy hook has been deleted successfully',
      });
      
      // Refresh the list
      await fetchDeployHooks();
    } catch (error) {
      console.error('Failed to delete deploy hook:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [callDeployHooksFunction, fetchDeployHooks, toast]);

  const toggleDeployHook = useCallback(async (hookId: string) => {
    setIsLoading(true);
    try {
      const result = await callDeployHooksFunction('toggle', { hook_id: hookId });
      
      toast({
        title: 'Deploy Hook Updated',
        description: `Deploy hook has been ${result.is_active ? 'activated' : 'deactivated'}`,
      });
      
      // Refresh the list
      await fetchDeployHooks();
    } catch (error) {
      console.error('Failed to toggle deploy hook:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [callDeployHooksFunction, fetchDeployHooks, toast]);

  return {
    deployHooks,
    isLoading,
    fetchDeployHooks,
    createDeployHook,
    deleteDeployHook,
    toggleDeployHook,
  };
};
