
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SecurityCheckRequest {
  action: 'check_foreign_tables' | 'log_incident' | 'check_rate_limit' | 'moderate_content' | 'get_security_status';
  incidentType?: string;
  severity?: string;
  details?: any;
  endpoint?: string;
  contentType?: string;
  contentId?: string;
  content?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { action, incidentType, severity, details, endpoint, contentType, contentId, content }: SecurityCheckRequest = await req.json();

    let result: any = {};

    switch (action) {
      case 'check_foreign_tables': {
        // Check for any foreign tables that might bypass RLS
        const { data: foreignTables, error } = await supabase.rpc('check_foreign_tables_security');
        
        if (error) {
          console.error('Error checking foreign tables:', error);
          result = { error: error.message };
        } else {
          result = {
            foreignTables: foreignTables || [],
            securityStatus: foreignTables?.length === 0 ? 'secure' : 'warning',
            message: foreignTables?.length === 0 
              ? 'No foreign tables found that could bypass RLS'
              : `Found ${foreignTables.length} foreign tables that may need review`
          };
        }
        break;
      }

      case 'log_incident': {
        // Log security incident
        const { error } = await supabase
          .from('security_incidents')
          .insert({
            incident_type: incidentType,
            severity: severity || 'medium',
            details: details || {},
            ip_address: req.headers.get('x-forwarded-for') || 'unknown',
            user_agent: req.headers.get('user-agent') || 'unknown'
          });

        if (error) {
          console.error('Failed to log security incident:', error);
          result = { error: error.message };
        } else {
          result = { success: true, message: 'Security incident logged' };
        }
        break;
      }

      case 'check_rate_limit': {
        const clientIP = req.headers.get('x-forwarded-for') || 'unknown';
        
        // Check current rate limit status
        const { data: rateLimitData, error } = await supabase
          .from('rate_limits')
          .select('*')
          .eq('ip_address', clientIP)
          .eq('endpoint', endpoint)
          .gte('window_start', new Date(Date.now() - 60000).toISOString()) // Last minute
          .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
          result = { error: error.message };
        } else {
          const requestCount = rateLimitData?.request_count || 0;
          const isBlocked = rateLimitData?.blocked_until && new Date(rateLimitData.blocked_until) > new Date();
          
          result = {
            allowed: !isBlocked && requestCount < 100, // 100 requests per minute limit
            currentCount: requestCount,
            isBlocked,
            blockedUntil: rateLimitData?.blocked_until
          };

          // Update or insert rate limit record
          if (rateLimitData) {
            await supabase
              .from('rate_limits')
              .update({ 
                request_count: requestCount + 1,
                updated_at: new Date().toISOString()
              })
              .eq('id', rateLimitData.id);
          } else {
            await supabase
              .from('rate_limits')
              .insert({
                ip_address: clientIP,
                endpoint: endpoint || 'unknown',
                request_count: 1,
                window_start: new Date().toISOString()
              });
          }
        }
        break;
      }

      case 'moderate_content': {
        // Basic content moderation (can be enhanced with AI services)
        const flags = [];
        const lowerContent = (content || '').toLowerCase();
        
        // Check for potentially harmful content
        const harmfulPatterns = [
          'script', 'javascript:', 'onclick', 'onerror', 'onload',
          'eval(', 'document.', 'window.', 'location.', 'cookie'
        ];
        
        harmfulPatterns.forEach(pattern => {
          if (lowerContent.includes(pattern)) {
            flags.push(`Potentially harmful pattern: ${pattern}`);
          }
        });

        const approved = flags.length === 0;
        
        // Log moderation result
        await supabase
          .from('content_moderation')
          .insert({
            content_type: contentType || 'unknown',
            content_id: contentId || crypto.randomUUID(),
            flags: flags,
            moderation_status: approved ? 'approved' : 'flagged'
          });

        result = {
          approved,
          flags,
          contentId
        };
        break;
      }

      case 'get_security_status': {
        // Get overall security status
        const { data: incidents, error: incidentsError } = await supabase
          .from('security_incidents')
          .select('severity')
          .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()) // Last 24 hours
          .eq('resolved', false);

        const { data: rateLimits, error: rateLimitsError } = await supabase
          .from('rate_limits')
          .select('*')
          .not('blocked_until', 'is', null);

        result = {
          security_status: {
            unresolvedIncidents: incidents?.length || 0,
            activeRateLimits: rateLimits?.length || 0,
            lastCheck: new Date().toISOString(),
            status: (incidents?.length || 0) > 0 ? 'warning' : 'secure'
          }
        };
        break;
      }

      default:
        result = { error: 'Unknown action' };
    }

    return new Response(
      JSON.stringify(result),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in security-monitor:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
