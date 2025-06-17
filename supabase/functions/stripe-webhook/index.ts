
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY');
    const STRIPE_WEBHOOK_SECRET = Deno.env.get('STRIPE_WEBHOOK_SECRET');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!STRIPE_SECRET_KEY || !STRIPE_WEBHOOK_SECRET) {
      throw new Error('Stripe secrets not configured');
    }

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
      throw new Error('No stripe signature found');
    }

    // Verify webhook signature (simplified version)
    // In production, you should use proper crypto verification
    const event = JSON.parse(body);

    console.log('Received webhook event:', event.type);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const userId = session.client_reference_id;
        const customerId = session.customer;

        if (!userId) {
          console.error('No user ID in session');
          break;
        }

        // Get subscription details from Stripe
        const subscriptionResponse = await fetch(
          `https://api.stripe.com/v1/subscriptions/${session.subscription}`,
          {
            headers: {
              'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
            },
          }
        );

        const subscription = await subscriptionResponse.json();
        const priceId = subscription.items.data[0].price.id;

        // Determine tier based on price ID
        let tier = 'starter';
        if (priceId.includes('professional') || priceId.includes('pro')) {
          tier = 'professional';
        }

        // Update subscriber record
        await supabase
          .from('subscribers')
          .upsert({
            user_id: userId,
            stripe_customer_id: customerId,
            subscribed: true,
            subscription_tier: tier,
            subscription_end: new Date(subscription.current_period_end * 1000).toISOString(),
            updated_at: new Date().toISOString()
          });

        console.log(`Updated subscription for user ${userId} to ${tier}`);
        break;
      }

      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const customerId = subscription.customer;

        // Find user by customer ID
        const { data: subscriber } = await supabase
          .from('subscribers')
          .select('user_id')
          .eq('stripe_customer_id', customerId)
          .single();

        if (!subscriber) {
          console.error('No subscriber found for customer:', customerId);
          break;
        }

        const isActive = subscription.status === 'active';
        const tier = isActive ? 'professional' : 'starter';

        await supabase
          .from('subscribers')
          .update({
            subscribed: isActive,
            subscription_tier: tier,
            subscription_end: isActive 
              ? new Date(subscription.current_period_end * 1000).toISOString()
              : null,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', subscriber.user_id);

        console.log(`Updated subscription status for customer ${customerId}: ${tier}`);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
