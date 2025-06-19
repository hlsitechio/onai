
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface IonosDnsApiRequest {
  action: string;
  zoneId?: string;
  records?: Array<{
    name: string;
    type: string;
    content: string;
    ttl?: number;
    prio?: number;
    disabled?: boolean;
  }>;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const IONOS_API_KEY = Deno.env.get('IONOS_API_KEY');

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

    const { action, zoneId, records }: IonosDnsApiRequest = await req.json();
    
    console.log('IONOS DNS API request:', { action, zoneId });

    const baseUrl = 'https://api.hosting.ionos.com/dns';
    
    switch (action) {
      case 'list_zones':
        const zonesResponse = await fetch(`${baseUrl}/v1/zones`, {
          headers: {
            'X-API-Key': IONOS_API_KEY,
            'Accept': 'application/json'
          }
        });
        
        if (!zonesResponse.ok) {
          const errorText = await zonesResponse.text();
          console.error('IONOS zones API error:', errorText);
          throw new Error(`IONOS API error: ${zonesResponse.status} ${errorText}`);
        }
        
        const zonesData = await zonesResponse.json();
        console.log('Zones retrieved successfully:', zonesData.length || 0, 'zones');
        
        return new Response(JSON.stringify(zonesData), {
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });

      case 'get_zone_records':
        if (!zoneId) {
          throw new Error('Zone ID is required for getting zone records');
        }
        
        const recordsResponse = await fetch(`${baseUrl}/v1/zones/${zoneId}`, {
          headers: {
            'X-API-Key': IONOS_API_KEY,
            'Accept': 'application/json'
          }
        });
        
        if (!recordsResponse.ok) {
          const errorText = await recordsResponse.text();
          console.error('IONOS zone records API error:', errorText);
          throw new Error(`IONOS API error: ${recordsResponse.status} ${errorText}`);
        }
        
        const recordsData = await recordsResponse.json();
        console.log('Zone records retrieved successfully for zone:', zoneId);
        
        return new Response(JSON.stringify(recordsData), {
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });

      case 'create_dns_records':
        if (!zoneId || !records || records.length === 0) {
          throw new Error('Zone ID and records are required for creating DNS records');
        }
        
        const createResponse = await fetch(`${baseUrl}/v1/zones/${zoneId}/records`, {
          method: 'POST',
          headers: {
            'X-API-Key': IONOS_API_KEY,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(records)
        });
        
        if (!createResponse.ok) {
          const errorText = await createResponse.text();
          console.error('IONOS create DNS records API error:', errorText);
          throw new Error(`IONOS API error: ${createResponse.status} ${errorText}`);
        }
        
        const createData = await createResponse.json();
        console.log('DNS records created successfully:', createData);
        
        return new Response(JSON.stringify(createData), {
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });

      default:
        throw new Error(`Unsupported action: ${action}`);
    }

  } catch (error: any) {
    console.error('Error in IONOS DNS API function:', error);
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
