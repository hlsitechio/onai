
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SecurityRequest {
  action: 'log_incident' | 'check_rate_limit' | 'moderate_content' | 'get_security_status';
  incidentType?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  details?: Record<string, any>;
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
    const { action, incidentType, severity, details, endpoint, contentType, contentId, content }: SecurityRequest = await req.json();

    // Initialize Supabase client with service role key
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const clientIP = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';

    console.log(`Security action: ${action} from IP: ${clientIP}`);

    switch (action) {
      case 'log_incident': {
        if (!incidentType) {
          throw new Error('Incident type is required');
        }

        const { data, error } = await supabase
          .from('security_incidents')
          .insert({
            incident_type: incidentType,
            severity: severity || 'medium',
            ip_address: clientIP,
            user_agent: userAgent,
            details: details || {},
          });

        if (error) throw error;

        return new Response(
          JSON.stringify({ success: true, incident_logged: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'check_rate_limit': {
        if (!endpoint) {
          throw new Error('Endpoint is required for rate limit check');
        }

        // Get rate limit settings
        const { data: settings } = await supabase
          .from('security_settings')
          .select('setting_value')
          .eq('setting_name', 'rate_limit_requests_per_minute')
          .single();

        const rateLimitPerMinute = settings ? parseInt(settings.setting_value as string) : 60;
        const windowStart = new Date(Date.now() - 60000); // 1 minute ago

        // Check current rate limit for this IP and endpoint
        const { data: currentRequests } = await supabase
          .from('rate_limits')
          .select('request_count')
          .eq('ip_address', clientIP)
          .eq('endpoint', endpoint)
          .gte('window_start', windowStart.toISOString())
          .single();

        let requestCount = 1;
        let isBlocked = false;

        if (currentRequests) {
          requestCount = currentRequests.request_count + 1;
          
          if (requestCount > rateLimitPerMinute) {
            isBlocked = true;
            
            // Log security incident
            await supabase.from('security_incidents').insert({
              incident_type: 'rate_limit_exceeded',
              severity: 'medium',
              ip_address: clientIP,
              user_agent: userAgent,
              details: { endpoint, request_count: requestCount, limit: rateLimitPerMinute },
            });

            // Update rate limit record with block
            await supabase
              .from('rate_limits')
              .update({
                request_count: requestCount,
                blocked_until: new Date(Date.now() + 300000).toISOString(), // Block for 5 minutes
                updated_at: new Date().toISOString(),
              })
              .eq('ip_address', clientIP)
              .eq('endpoint', endpoint);
          } else {
            // Update request count
            await supabase
              .from('rate_limits')
              .update({
                request_count: requestCount,
                updated_at: new Date().toISOString(),
              })
              .eq('ip_address', clientIP)
              .eq('endpoint', endpoint);
          }
        } else {
          // Create new rate limit record
          await supabase
            .from('rate_limits')
            .insert({
              ip_address: clientIP,
              endpoint,
              request_count: 1,
              window_start: new Date().toISOString(),
            });
        }

        return new Response(
          JSON.stringify({ 
            success: true, 
            allowed: !isBlocked, 
            request_count: requestCount,
            limit: rateLimitPerMinute 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'moderate_content': {
        if (!contentType || !contentId || !content) {
          throw new Error('Content type, ID, and content are required for moderation');
        }

        // Simple content moderation (you could integrate with external services)
        const suspiciousPatterns = [
          /\b(spam|scam|phishing)\b/i,
          /\b(malware|virus|trojan)\b/i,
          /\b(hack|exploit|vulnerability)\b/i,
        ];

        const flags = [];
        let moderationStatus = 'approved';

        for (const pattern of suspiciousPatterns) {
          if (pattern.test(content)) {
            flags.push(pattern.source);
            moderationStatus = 'flagged';
          }
        }

        // Check content length
        if (content.length > 50000) {
          flags.push('excessive_length');
          moderationStatus = 'flagged';
        }

        const { data, error } = await supabase
          .from('content_moderation')
          .insert({
            content_type: contentType,
            content_id: contentId,
            moderation_status: moderationStatus,
            flags: flags.length > 0 ? flags : null,
          });

        if (error) throw error;

        return new Response(
          JSON.stringify({ 
            success: true, 
            moderation_status: moderationStatus,
            flags,
            approved: moderationStatus === 'approved' 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'get_security_status': {
        // Get recent security incidents
        const { data: incidents } = await supabase
          .from('security_incidents')
          .select('incident_type, severity, created_at')
          .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
          .order('created_at', { ascending: false })
          .limit(100);

        // Get current rate limits
        const { data: rateLimits } = await supabase
          .from('rate_limits')
          .select('ip_address, endpoint, request_count, blocked_until')
          .gte('window_start', new Date(Date.now() - 60000).toISOString());

        // Get security settings
        const { data: settings } = await supabase
          .from('security_settings')
          .select('setting_name, setting_value');

        const securityStatus = {
          incidents_24h: incidents?.length || 0,
          active_rate_limits: rateLimits?.length || 0,
          blocked_ips: rateLimits?.filter(rl => rl.blocked_until && new Date(rl.blocked_until) > new Date()).length || 0,
          settings: settings || [],
          recent_incidents: incidents?.slice(0, 10) || [],
        };

        return new Response(
          JSON.stringify({ success: true, security_status: securityStatus }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      default:
        throw new Error('Invalid action');
    }

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
