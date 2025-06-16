
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface IonosApiRequest {
  action: string;
  domain?: string;
  recordType?: string;
  name?: string;
  content?: string;
  ttl?: number;
  priority?: number;
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

    const { action, domain, recordType, name, content, ttl, priority }: IonosApiRequest = await req.json();
    
    console.log('IONOS API request:', { action, domain, recordType, name });

    const baseUrl = IONOS_PUBLIC_PREFIX || 'https://api.hosting.ionos.com';
    
    switch (action) {
      case 'list_domains':
        const domainsResponse = await fetch(`${baseUrl}/v1/domains`, {
          headers: {
            'X-API-Key': IONOS_API_KEY,
            'Accept': 'application/json'
          }
        });
        
        if (!domainsResponse.ok) {
          const errorText = await domainsResponse.text();
          console.error('IONOS domains API error:', errorText);
          throw new Error(`IONOS API error: ${domainsResponse.status} ${errorText}`);
        }
        
        const domainsData = await domainsResponse.json();
        console.log('Domains retrieved successfully:', domainsData.length || 0, 'domains');
        
        return new Response(JSON.stringify(domainsData), {
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });

      case 'list_dns_records':
        if (!domain) {
          throw new Error('Domain is required for listing DNS records');
        }
        
        const recordsResponse = await fetch(`${baseUrl}/v1/domains/${domain}/records`, {
          headers: {
            'X-API-Key': IONOS_API_KEY,
            'Accept': 'application/json'
          }
        });
        
        if (!recordsResponse.ok) {
          const errorText = await recordsResponse.text();
          console.error('IONOS DNS records API error:', errorText);
          throw new Error(`IONOS API error: ${recordsResponse.status} ${errorText}`);
        }
        
        const recordsData = await recordsResponse.json();
        console.log('DNS records retrieved successfully for domain:', domain);
        
        return new Response(JSON.stringify(recordsData), {
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });

      case 'create_dns_record':
        if (!domain || !recordType || !name || !content) {
          throw new Error('Domain, recordType, name, and content are required for creating DNS records');
        }
        
        const createPayload = {
          type: recordType,
          name: name,
          content: content,
          ttl: ttl || 3600,
          ...(recordType === 'MX' && priority ? { priority } : {})
        };
        
        const createResponse = await fetch(`${baseUrl}/v1/domains/${domain}/records`, {
          method: 'POST',
          headers: {
            'X-API-Key': IONOS_API_KEY,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(createPayload)
        });
        
        if (!createResponse.ok) {
          const errorText = await createResponse.text();
          console.error('IONOS create DNS record API error:', errorText);
          throw new Error(`IONOS API error: ${createResponse.status} ${errorText}`);
        }
        
        const createData = await createResponse.json();
        console.log('DNS record created successfully:', createData);
        
        return new Response(JSON.stringify(createData), {
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });

      default:
        throw new Error(`Unsupported action: ${action}`);
    }

  } catch (error: any) {
    console.error('Error in IONOS API function:', error);
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
