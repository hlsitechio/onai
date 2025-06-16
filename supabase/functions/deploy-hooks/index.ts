
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { v4 as uuidv4 } from 'https://esm.sh/uuid@11.1.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DeployHookRequest {
  hookName: string;
  vercelProjectId: string;
  branch?: string;
}

interface WebhookTriggerRequest {
  webhookUrl: string;
  source?: string;
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

    const url = new URL(req.url);
    const action = url.searchParams.get('action');
    
    console.log(`Deploy Hooks: ${action} request`);

    // Handle webhook triggers (public endpoint)
    if (action === 'trigger' && req.method === 'POST') {
      const webhookUrl = url.searchParams.get('webhook_url');
      if (!webhookUrl) {
        return new Response(
          JSON.stringify({ error: 'Webhook URL required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Find the deploy hook by webhook URL
      const { data: deployHook, error: hookError } = await supabaseClient
        .from('deploy_hooks')
        .select('*')
        .eq('webhook_url', webhookUrl)
        .eq('is_active', true)
        .single();

      if (hookError || !deployHook) {
        console.error('Deploy hook not found:', hookError);
        return new Response(
          JSON.stringify({ error: 'Deploy hook not found or inactive' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Get client IP and user agent
      const clientIP = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
      const userAgent = req.headers.get('user-agent') || 'unknown';

      // Log the webhook trigger
      const logId = uuidv4();
      await supabaseClient
        .from('deploy_hook_logs')
        .insert({
          id: logId,
          deploy_hook_id: deployHook.id,
          source_ip: clientIP,
          user_agent: userAgent,
          status: 'triggered',
        });

      // Get Vercel token
      const vercelToken = Deno.env.get('VERCEL_TOKEN');
      if (!vercelToken) {
        await supabaseClient
          .from('deploy_hook_logs')
          .update({
            status: 'failed',
            error_message: 'Vercel token not configured',
          })
          .eq('id', logId);

        return new Response(
          JSON.stringify({ error: 'Vercel token not configured' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      try {
        // Trigger deployment via Vercel API
        const vercelHeaders = {
          'Authorization': `Bearer ${vercelToken}`,
          'Content-Type': 'application/json',
        };

        const deploymentData = {
          name: deployHook.vercel_project_id,
          gitSource: {
            type: 'github',
            ref: deployHook.branch,
          },
          target: 'production',
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

        // Update the deploy hook
        await supabaseClient
          .from('deploy_hooks')
          .update({
            last_triggered_at: new Date().toISOString(),
            trigger_count: deployHook.trigger_count + 1,
          })
          .eq('id', deployHook.id);

        // Update log with success
        await supabaseClient
          .from('deploy_hook_logs')
          .update({
            deployment_id: deployment.id,
            status: 'success',
            response_data: deployment,
          })
          .eq('id', logId);

        return new Response(
          JSON.stringify({
            success: true,
            deployment_id: deployment.id,
            deployment_url: deployment.url,
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

      } catch (error) {
        console.error('Deployment trigger failed:', error);
        
        // Update log with failure
        await supabaseClient
          .from('deploy_hook_logs')
          .update({
            status: 'failed',
            error_message: error instanceof Error ? error.message : 'Unknown error',
          })
          .eq('id', logId);

        return new Response(
          JSON.stringify({ error: error instanceof Error ? error.message : 'Deployment failed' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // For all other actions, require authentication
    const authHeader = req.headers.get('Authorization')!;
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    switch (action) {
      case 'create': {
        if (req.method !== 'POST') {
          return new Response(
            JSON.stringify({ error: 'Method not allowed' }),
            { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const body = await req.json() as DeployHookRequest;
        
        // Generate webhook URL and secret
        const webhookId = uuidv4();
        const webhookSecret = uuidv4();
        const baseUrl = Deno.env.get('SUPABASE_URL')?.replace('/rest/v1', '') || 'https://qrdulwzjgbfgaplazgsh.supabase.co';
        const webhookUrl = `${baseUrl}/functions/v1/deploy-hooks?action=trigger&webhook_url=${webhookId}`;

        // Create deploy hook
        const { data: deployHook, error: createError } = await supabaseClient
          .from('deploy_hooks')
          .insert({
            user_id: user.id,
            vercel_project_id: body.vercelProjectId,
            hook_name: body.hookName,
            branch: body.branch || 'main',
            webhook_url: webhookId, // Store just the ID, not the full URL
            webhook_secret: webhookSecret,
          })
          .select()
          .single();

        if (createError) {
          console.error('Failed to create deploy hook:', createError);
          return new Response(
            JSON.stringify({ error: 'Failed to create deploy hook' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        return new Response(
          JSON.stringify({
            ...deployHook,
            webhook_url: webhookUrl, // Return the full URL to the client
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'list': {
        const projectId = url.searchParams.get('project_id');
        
        let query = supabaseClient
          .from('deploy_hooks')
          .select(`
            *,
            deploy_hook_logs (
              id,
              triggered_at,
              status,
              deployment_id
            )
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (projectId) {
          query = query.eq('vercel_project_id', projectId);
        }

        const { data: deployHooks, error } = await query;

        if (error) {
          console.error('Failed to fetch deploy hooks:', error);
          return new Response(
            JSON.stringify({ error: 'Failed to fetch deploy hooks' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Transform webhook URLs to full URLs for the response
        const transformedHooks = deployHooks?.map(hook => ({
          ...hook,
          webhook_url: `${Deno.env.get('SUPABASE_URL')?.replace('/rest/v1', '') || 'https://qrdulwzjgbfgaplazgsh.supabase.co'}/functions/v1/deploy-hooks?action=trigger&webhook_url=${hook.webhook_url}`,
        }));

        return new Response(
          JSON.stringify({ deploy_hooks: transformedHooks }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'delete': {
        const hookId = url.searchParams.get('hook_id');
        if (!hookId) {
          return new Response(
            JSON.stringify({ error: 'Hook ID required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const { error } = await supabaseClient
          .from('deploy_hooks')
          .delete()
          .eq('id', hookId)
          .eq('user_id', user.id);

        if (error) {
          console.error('Failed to delete deploy hook:', error);
          return new Response(
            JSON.stringify({ error: 'Failed to delete deploy hook' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'toggle': {
        const hookId = url.searchParams.get('hook_id');
        if (!hookId) {
          return new Response(
            JSON.stringify({ error: 'Hook ID required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Get current status
        const { data: currentHook } = await supabaseClient
          .from('deploy_hooks')
          .select('is_active')
          .eq('id', hookId)
          .eq('user_id', user.id)
          .single();

        if (!currentHook) {
          return new Response(
            JSON.stringify({ error: 'Deploy hook not found' }),
            { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Toggle status
        const { error } = await supabaseClient
          .from('deploy_hooks')
          .update({ is_active: !currentHook.is_active })
          .eq('id', hookId)
          .eq('user_id', user.id);

        if (error) {
          console.error('Failed to toggle deploy hook:', error);
          return new Response(
            JSON.stringify({ error: 'Failed to toggle deploy hook' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        return new Response(
          JSON.stringify({ success: true, is_active: !currentHook.is_active }),
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
    console.error('Deploy Hooks Error:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Internal server error' 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
