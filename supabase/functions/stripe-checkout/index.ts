
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CheckoutRequest {
  price_id?: string;
  product_id?: string;
  success_url?: string;
  cancel_url?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!STRIPE_SECRET_KEY) {
      throw new Error('Stripe secret key not found');
    }

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Get user from Supabase
    const { data: { user }, error: userError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (userError || !user) {
      throw new Error('Invalid user token');
    }

    const { price_id, product_id, success_url, cancel_url }: CheckoutRequest = await req.json();

    // Use the product ID you provided to get the price
    const productIdToUse = product_id || 'prod_SOstZzMeZgtmK5';

    // Check if user already has a Stripe customer ID
    let { data: subscriber } = await supabase
      .from('subscribers')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .single();

    let customerId = subscriber?.stripe_customer_id;

    // Get prices for the product to find the correct price ID
    const pricesResponse = await fetch(`https://api.stripe.com/v1/prices?product=${productIdToUse}&active=true&limit=1`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
      },
    });

    if (!pricesResponse.ok) {
      const errorText = await pricesResponse.text();
      console.error('Stripe prices API error:', errorText);
      throw new Error(`Failed to fetch prices for product: ${pricesResponse.status}`);
    }

    const pricesData = await pricesResponse.json();
    
    if (!pricesData.data || pricesData.data.length === 0) {
      throw new Error(`No active prices found for product: ${productIdToUse}`);
    }

    const priceId = pricesData.data[0].id;
    console.log('Using price ID:', priceId);

    // Create Stripe checkout session
    const stripeResponse = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        'payment_method_types[]': 'card',
        'line_items[0][price]': priceId,
        'line_items[0][quantity]': '1',
        'mode': 'subscription',
        'success_url': success_url || `${req.headers.get('origin')}/success?session_id={CHECKOUT_SESSION_ID}`,
        'cancel_url': cancel_url || `${req.headers.get('origin')}/`,
        'customer_email': user.email,
        'client_reference_id': user.id,
        ...(customerId && { customer: customerId }),
      }),
    });

    if (!stripeResponse.ok) {
      const errorText = await stripeResponse.text();
      console.error('Stripe API error:', errorText);
      throw new Error(`Stripe API error: ${stripeResponse.status}`);
    }

    const session = await stripeResponse.json();

    // Create or update subscriber record
    await supabase
      .from('subscribers')
      .upsert({
        user_id: user.id,
        email: user.email,
        subscription_tier: 'starter', // Will be updated by webhook
        updated_at: new Date().toISOString()
      });

    return new Response(
      JSON.stringify({ url: session.url }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
