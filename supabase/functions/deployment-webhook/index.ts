
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DeploymentWebhookRequest {
  deployment_url?: string;
  branch?: string;
  commit?: string;
  status?: 'success' | 'failed' | 'building';
  timestamp?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const IONOS_API_KEY = Deno.env.get('IONOS_API_KEY');
    const IONOS_PUBLIC_PREFIX = Deno.env.get('IONOS_PUBLIC_PREFIX');

    if (!IONOS_API_KEY) {
      console.error('IONOS_API_KEY not found');
      return new Response(
        JSON.stringify({ error: 'IONOS API key not configured' }),
        { 
          status: 500, 
          headers: { 'Content-Type': 'application/json', ...corsHeaders } 
        }
      );
    }

    const payload: DeploymentWebhookRequest = await req.json();
    console.log('Deployment webhook received:', payload);

    // Only process successful deployments
    if (payload.status !== 'success') {
      console.log('Deployment not successful, skipping DNS update');
      return new Response(
        JSON.stringify({ message: 'Deployment not successful, no action taken' }),
        { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    // Extract the new deployment URL
    const newDeploymentUrl = payload.deployment_url;
    if (!newDeploymentUrl) {
      console.error('No deployment URL provided');
      return new Response(
        JSON.stringify({ error: 'No deployment URL provided' }),
        { 
          status: 400, 
          headers: { 'Content-Type': 'application/json', ...corsHeaders } 
        }
      );
    }

    // Extract hostname from deployment URL
    const deploymentHost = new URL(newDeploymentUrl).hostname;
    console.log('New deployment host:', deploymentHost);

    const baseUrl = IONOS_PUBLIC_PREFIX || 'https://api.hosting.ionos.com';
    const domain = 'onlinenote.ai';

    // Get current DNS records
    const recordsResponse = await fetch(`${baseUrl}/v1/domains/${domain}/records`, {
      headers: {
        'X-API-Key': IONOS_API_KEY,
        'Accept': 'application/json'
      }
    });

    if (!recordsResponse.ok) {
      const errorText = await recordsResponse.text();
      console.error('Failed to get DNS records:', errorText);
      throw new Error(`Failed to get DNS records: ${recordsResponse.status}`);
    }

    const records = await recordsResponse.json();
    console.log('Current DNS records:', records.length);

    // Find the A record for the root domain (@)
    const rootRecord = records.find((record: any) => 
      record.type === 'CNAME' && record.name === '@'
    );

    if (rootRecord) {
      // Update existing CNAME record
      const updateResponse = await fetch(`${baseUrl}/v1/domains/${domain}/records/${rootRecord.id}`, {
        method: 'PUT',
        headers: {
          'X-API-Key': IONOS_API_KEY,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          type: 'CNAME',
          name: '@',
          content: deploymentHost,
          ttl: 3600
        })
      });

      if (!updateResponse.ok) {
        const errorText = await updateResponse.text();
        console.error('Failed to update DNS record:', errorText);
        throw new Error(`Failed to update DNS record: ${updateResponse.status}`);
      }

      console.log('DNS record updated successfully');
    } else {
      // Create new CNAME record
      const createResponse = await fetch(`${baseUrl}/v1/domains/${domain}/records`, {
        method: 'POST',
        headers: {
          'X-API-Key': IONOS_API_KEY,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          type: 'CNAME',
          name: '@',
          content: deploymentHost,
          ttl: 3600
        })
      });

      if (!createResponse.ok) {
        const errorText = await createResponse.text();
        console.error('Failed to create DNS record:', errorText);
        throw new Error(`Failed to create DNS record: ${createResponse.status}`);
      }

      console.log('DNS record created successfully');
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `DNS updated for ${domain} to point to ${deploymentHost}`,
        deployment_url: newDeploymentUrl,
        timestamp: new Date().toISOString()
      }),
      { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );

  } catch (error: any) {
    console.error('Error in deployment webhook:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Unknown error occurred',
        details: error.toString()
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

serve(handler);
