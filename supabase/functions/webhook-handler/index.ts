
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

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
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
          throw new Error('Invalid webhook signature');
        }
      }
    }

    let webhookData: WebhookPayload;
    try {
      webhookData = JSON.parse(payload);
    } catch {
      throw new Error('Invalid JSON payload');
    }

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

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
        
        // Here you would typically update user subscription status
        // For now, just log the event
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
        // Handle data synchronization
        const syncData = webhookData.data;
        
        // Process data sync (example: update notes from external source)
        if (syncData.notes && Array.isArray(syncData.notes)) {
          const notesToInsert = syncData.notes.map((note: any) => ({
            id: note.id || crypto.randomUUID(),
            title: note.title || 'Synced Note',
            content: note.content || '',
            is_encrypted: false,
            created_at: note.created_at || new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }));

          const { error: syncError } = await supabase
            .from('notes')
            .upsert(notesToInsert);

          if (syncError) {
            throw new Error(`Sync failed: ${syncError.message}`);
          }

          result = {
            message: 'Data sync completed',
            syncedNotes: notesToInsert.length,
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

        result = {
          message: 'Health check completed',
          status: 'healthy',
          database: dbCheck ? 'connected' : 'disconnected',
          timestamp: new Date().toISOString(),
        };
        break;
      }

      default: {
        // Handle unknown events
        console.log('Unknown webhook event:', webhookData.event);
        
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
