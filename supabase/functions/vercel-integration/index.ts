
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface VercelProject {
  id: string;
  name: string;
  framework?: string;
  buildCommand?: string;
  outputDirectory?: string;
  environmentVariables?: Record<string, string>;
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

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get user from JWT
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const url = new URL(req.url);
    const action = url.searchParams.get('action');
    
    console.log(`Vercel Integration: ${action} request from user ${user.id}`);

    const vercelToken = Deno.env.get('VERCEL_TOKEN');
    if (!vercelToken) {
      return new Response(
        JSON.stringify({ error: 'Vercel token not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const vercelHeaders = {
      'Authorization': `Bearer ${vercelToken}`,
      'Content-Type': 'application/json',
    };

    switch (action) {
      case 'list-projects': {
        // Get projects from Vercel API
        const response = await fetch('https://api.vercel.com/v9/projects', {
          headers: vercelHeaders,
        });
        
        if (!response.ok) {
          throw new Error(`Vercel API error: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Store/update projects in our database
        for (const project of data.projects) {
          await supabaseClient
            .from('vercel_projects')
            .upsert({
              user_id: user.id,
              project_name: project.name,
              vercel_project_id: project.id,
              deployment_url: project.targets?.production?.url || null,
              framework: project.framework || 'vite',
              build_command: project.buildCommand || 'npm run build',
              output_directory: project.outputDirectory || 'dist',
              environment_variables: project.env || {},
            }, {
              onConflict: 'user_id,vercel_project_id'
            });
        }
        
        return new Response(
          JSON.stringify({ projects: data.projects }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'create-deployment': {
        const body = await req.json() as DeploymentRequest;
        
        // Create deployment via Vercel API
        const deploymentData = {
          name: body.projectId,
          gitSource: body.gitSource,
          target: body.target || 'production',
        };
        
        const response = await fetch('https://api.vercel.com/v13/deployments', {
          method: 'POST',
          headers: vercelHeaders,
          body: JSON.stringify(deploymentData),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Deployment failed: ${errorData.error?.message || response.statusText}`);
        }
        
        const deployment = await response.json();
        
        // Log the deployment
        await supabaseClient
          .from('deployment_logs')
          .insert({
            user_id: user.id,
            vercel_project_id: body.projectId,
            deployment_id: deployment.id,
            status: deployment.readyState || 'pending',
            deployment_url: deployment.url,
            commit_sha: deployment.meta?.githubCommitSha || null,
            branch: deployment.meta?.githubCommitRef || 'main',
            metadata: deployment,
          });
        
        return new Response(
          JSON.stringify({ deployment }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'get-deployment-status': {
        const deploymentId = url.searchParams.get('deploymentId');
        if (!deploymentId) {
          return new Response(
            JSON.stringify({ error: 'Deployment ID required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        
        const response = await fetch(`https://api.vercel.com/v13/deployments/${deploymentId}`, {
          headers: vercelHeaders,
        });
        
        if (!response.ok) {
          throw new Error(`Failed to get deployment status: ${response.statusText}`);
        }
        
        const deployment = await response.json();
        
        // Update deployment log
        await supabaseClient
          .from('deployment_logs')
          .update({
            status: deployment.readyState,
            build_duration: deployment.buildingAt && deployment.ready 
              ? new Date(deployment.ready).getTime() - new Date(deployment.buildingAt).getTime()
              : null,
            completed_at: deployment.ready ? new Date(deployment.ready).toISOString() : null,
          })
          .eq('deployment_id', deploymentId)
          .eq('user_id', user.id);
        
        return new Response(
          JSON.stringify({ deployment }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'get-analytics': {
        const projectId = url.searchParams.get('projectId');
        const since = url.searchParams.get('since') || '7d';
        
        if (!projectId) {
          return new Response(
            JSON.stringify({ error: 'Project ID required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        
        const response = await fetch(
          `https://api.vercel.com/v2/deployments/${projectId}/events?since=${since}`,
          { headers: vercelHeaders }
        );
        
        if (!response.ok) {
          throw new Error(`Failed to get analytics: ${response.statusText}`);
        }
        
        const analytics = await response.json();
        
        return new Response(
          JSON.stringify({ analytics }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'sync-environment': {
        const body = await req.json();
        const { projectId, environmentVariables } = body;
        
        // Update environment variables in Vercel
        const response = await fetch(`https://api.vercel.com/v9/projects/${projectId}/env`, {
          method: 'POST',
          headers: vercelHeaders,
          body: JSON.stringify({
            type: 'encrypted',
            key: Object.keys(environmentVariables)[0],
            value: Object.values(environmentVariables)[0],
            target: ['production', 'preview'],
          }),
        });
        
        if (!response.ok) {
          throw new Error(`Failed to sync environment: ${response.statusText}`);
        }
        
        // Update local database
        await supabaseClient
          .from('vercel_projects')
          .update({
            environment_variables: environmentVariables,
          })
          .eq('vercel_project_id', projectId)
          .eq('user_id', user.id);
        
        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
  } catch (error) {
    console.error('Vercel Integration Error:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Internal server error' 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
