
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import Stripe from 'https://esm.sh/stripe@14.21.0';

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

    console.log('Initializing Stripe client...');
    const stripe = new Stripe(STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    });

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

    console.log('User authenticated:', user.id);

    const { price_id, product_id, success_url, cancel_url }: CheckoutRequest = await req.json();

    // Use the product ID you provided to get the price
    const productIdToUse = product_id || 'prod_SOstZzMeZgtmK5';
    console.log('Using product ID:', productIdToUse);

    // Check if user already has a Stripe customer ID
    let { data: subscriber } = await supabase
      .from('subscribers')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .single();

    let customerId = subscriber?.stripe_customer_id;
    console.log('Existing customer ID:', customerId || 'None');

    // Get prices for the product using Stripe client
    console.log('Fetching prices for product...');
    const prices = await stripe.prices.list({
      product: productIdToUse,
      active: true,
      type: 'recurring', // Only get recurring prices for subscriptions
      limit: 1,
    });
    
    if (!prices.data || prices.data.length === 0) {
      throw new Error(`No active recurring prices found for product: ${productIdToUse}`);
    }

    const priceId = prices.data[0].id;
    console.log('Using recurring price ID:', priceId);

    // Create or get customer if needed
    if (!customerId) {
      console.log('Creating new Stripe customer...');
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          supabase_user_id: user.id,
        },
      });
      customerId = customer.id;
      console.log('Created customer ID:', customerId);
    }

    // Create Stripe checkout session using Stripe client
    console.log('Creating checkout session...');
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: success_url || `${req.headers.get('origin')}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancel_url || `${req.headers.get('origin')}/`,
      client_reference_id: user.id,
    });

    console.log('Checkout session created:', session.id);

    // Create or update subscriber record
    await supabase
      .from('subscribers')
      .upsert({
        user_id: user.id,
        email: user.email,
        stripe_customer_id: customerId,
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
