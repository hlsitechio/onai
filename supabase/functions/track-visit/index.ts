
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface VisitData {
  page_path: string;
  referrer?: string;
  user_agent?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { page_path, referrer, user_agent }: VisitData = await req.json();

    // Get visitor IP address
    const forwarded = req.headers.get('x-forwarded-for');
    const ip_address = forwarded ? forwarded.split(',')[0].trim() : 
                     req.headers.get('x-real-ip') || 
                     'unknown';

    // Insert visit record
    const { data: visitData, error: visitError } = await supabase
      .from('page_visits')
      .insert({
        ip_address,
        user_agent,
        page_path,
        referrer
      })
      .select()
      .single();

    if (visitError) {
      console.error('Error inserting visit:', visitError);
      throw visitError;
    }

    // Get total visit count for this page
    const { data: stats, error: statsError } = await supabase
      .from('visitor_stats')
      .select('*')
      .single();

    if (statsError) {
      console.error('Error getting stats:', statsError);
    }

    // Send notification email (you can replace with your email)
    const notificationEmail = 'your-email@example.com'; // Replace with your actual email
    
    try {
      // Simple webhook notification - you can replace this with your preferred notification method
      console.log(`New visitor: IP ${ip_address} visited ${page_path}`);
      console.log(`Total visits: ${stats?.total_visits || 'unknown'}`);
      
      // You can integrate with email services here
      // For now, we'll just log the notification
    } catch (notificationError) {
      console.error('Error sending notification:', notificationError);
      // Don't fail the request if notification fails
    }

    return new Response(
      JSON.stringify({
        success: true,
        visit_id: visitData.id,
        total_visits: stats?.total_visits || 0,
        unique_visitors: stats?.unique_visitors || 0
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error('Error in track-visit function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

serve(handler);
