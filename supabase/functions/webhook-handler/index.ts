
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';
import { createHmac } from "https://deno.land/std@0.168.0/node/crypto.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-signature',
};

interface WebhookPayload {
  event: string;
  data: any;
  timestamp: string;
  source: string;
}

// Security monitoring helper
const logSecurityIncident = async (supabase: any, type: string, severity: string, req: Request, details: any) => {
  try {
    await supabase.functions.invoke('security-monitor', {
      body: JSON.stringify({
        action: 'log_incident',
        incidentType: type,
        severity,
        details,
      }),
    });
  } catch (error) {
    console.error('Failed to log security incident:', error);
  }
};

// Rate limiting helper
const checkRateLimit = async (supabase: any, endpoint: string) => {
  try {
    const { data } = await supabase.functions.invoke('security-monitor', {
      body: JSON.stringify({
        action: 'check_rate_limit',
        endpoint,
      }),
    });
    return data?.allowed !== false;
  } catch (error) {
    console.error('Failed to check rate limit:', error);
    return true; // Allow on error
  }
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Check rate limit first
    const rateLimitAllowed = await checkRateLimit(supabase, '/webhook-handler');
    if (!rateLimitAllowed) {
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded' }),
        {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const signature = req.headers.get('x-signature');
    const payload = await req.text();
    
    console.log('Webhook received:', { signature: !!signature, payloadLength: payload.length });

    // Verify webhook signature if present
    if (signature) {
      const webhookSecret = Deno.env.get('WEBHOOK_SECRET');
      if (webhookSecret) {
        const expectedSignature = createHmac('sha256', webhookSecret)
          .update(payload)
          .digest('hex');
        
        if (signature !== `sha256=${expectedSignature}`) {
          await logSecurityIncident(supabase, 'invalid_webhook_signature', 'high', req, {
            provided_signature: signature,
            payload_length: payload.length,
          });
          throw new Error('Invalid webhook signature');
        }
      }
    }

    let webhookData: WebhookPayload;
    try {
      webhookData = JSON.parse(payload);
    } catch {
      await logSecurityIncident(supabase, 'invalid_webhook_payload', 'medium', req, {
        payload_preview: payload.substring(0, 100),
      });
      throw new Error('Invalid JSON payload');
    }

    // Process different webhook events
    let result: any = {};

    switch (webhookData.event) {
      case 'user.created': {
        // Handle new user registration
        const userData = webhookData.data;
        
        // Log the new user event
        const { error: logError } = await supabase
          .from('page_visits')
          .insert({
            page_path: '/webhook/user-created',
            ip_address: req.headers.get('x-forwarded-for') || 'webhook',
            user_agent: webhookData.source,
            referrer: userData.email,
          });

        if (logError) {
          console.error('Failed to log user creation:', logError);
        }

        result = {
          message: 'User creation webhook processed',
          userId: userData.id,
          processedAt: new Date().toISOString(),
        };
        break;
      }

      case 'payment.success': {
        // Handle successful payment
        const paymentData = webhookData.data;
        
        console.log('Payment success:', paymentData);
        
        // Log the payment event
        const { error: logError } = await supabase
          .from('page_visits')
          .insert({
            page_path: '/webhook/payment-success',
            ip_address: req.headers.get('x-forwarded-for') || 'webhook',
            user_agent: webhookData.source,
            referrer: paymentData.amount ? `$${paymentData.amount}` : null,
          });

        if (logError) {
          console.error('Failed to log payment:', logError);
        }

        result = {
          message: 'Payment webhook processed',
          amount: paymentData.amount,
          processedAt: new Date().toISOString(),
        };
        break;
      }

      case 'data.sync': {
        // Handle data synchronization with content moderation
        const syncData = webhookData.data;
        
        if (syncData.notes && Array.isArray(syncData.notes)) {
          const notesToInsert = [];
          
          for (const note of syncData.notes) {
            // Moderate content before syncing
            const { data: moderationResult } = await supabase.functions.invoke('security-monitor', {
              body: JSON.stringify({
                action: 'moderate_content',
                contentType: 'note',
                contentId: note.id || crypto.randomUUID(),
                content: note.content || '',
              }),
            });

            if (moderationResult?.approved) {
              notesToInsert.push({
                id: note.id || crypto.randomUUID(),
                title: note.title || 'Synced Note',
                content: note.content || '',
                is_encrypted: false,
                created_at: note.created_at || new Date().toISOString(),
                updated_at: new Date().toISOString(),
              });
            } else {
              await logSecurityIncident(supabase, 'content_moderation_rejected', 'medium', req, {
                note_id: note.id,
                flags: moderationResult?.flags,
              });
            }
          }

          if (notesToInsert.length > 0) {
            const { error: syncError } = await supabase
              .from('notes')
              .upsert(notesToInsert);

            if (syncError) {
              throw new Error(`Sync failed: ${syncError.message}`);
            }
          }

          result = {
            message: 'Data sync completed',
            syncedNotes: notesToInsert.length,
            rejectedNotes: syncData.notes.length - notesToInsert.length,
            processedAt: new Date().toISOString(),
          };
        } else {
          result = {
            message: 'No valid sync data provided',
            processedAt: new Date().toISOString(),
          };
        }
        break;
      }

      case 'health.check': {
        // Handle health checks
        const { data: dbCheck } = await supabase
          .from('notes')
          .select('id')
          .limit(1);

        // Get security status
        const { data: securityStatus } = await supabase.functions.invoke('security-monitor', {
          body: JSON.stringify({ action: 'get_security_status' }),
        });

        result = {
          message: 'Health check completed',
          status: 'healthy',
          database: dbCheck ? 'connected' : 'disconnected',
          security: securityStatus?.security_status || {},
          timestamp: new Date().toISOString(),
        };
        break;
      }

      default: {
        // Handle unknown events
        console.log('Unknown webhook event:', webhookData.event);
        
        await logSecurityIncident(supabase, 'unknown_webhook_event', 'low', req, {
          event_type: webhookData.event,
          source: webhookData.source,
        });
        
        const { error: logError } = await supabase
          .from('page_visits')
          .insert({
            page_path: `/webhook/unknown/${webhookData.event}`,
            ip_address: req.headers.get('x-forwarded-for') || 'webhook',
            user_agent: webhookData.source,
          });

        if (logError) {
          console.error('Failed to log unknown event:', logError);
        }

        result = {
          message: 'Unknown event type',
          event: webhookData.event,
          processedAt: new Date().toISOString(),
        };
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        event: webhookData.event,
        result,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in webhook-handler:', error);
    
    // Log critical errors as security incidents
    try {
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      );
      await logSecurityIncident(supabase, 'webhook_processing_error', 'high', req, {
        error_message: error.message,
      });
    } catch (logError) {
      console.error('Failed to log webhook error:', logError);
    }
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
