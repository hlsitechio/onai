
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AnalyticsRequest {
  action: 'track_event' | 'get_stats' | 'get_trends' | 'export_data';
  eventType?: string;
  eventData?: Record<string, any>;
  dateRange?: {
    start: string;
    end: string;
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, eventType, eventData, dateRange }: AnalyticsRequest = await req.json();

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log(`Processing analytics action: ${action}`);

    switch (action) {
      case 'track_event': {
        if (!eventType) {
          throw new Error('Event type is required for tracking');
        }

        // Track custom events
        const { error } = await supabase
          .from('page_visits')
          .insert({
            page_path: eventType,
            ip_address: req.headers.get('x-forwarded-for') || 'unknown',
            user_agent: req.headers.get('user-agent') || 'unknown',
            referrer: eventData?.referrer || null,
            country: eventData?.country || null,
            city: eventData?.city || null,
          });

        if (error) throw error;

        return new Response(
          JSON.stringify({ success: true, tracked: eventType }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'get_stats': {
        // Get comprehensive statistics
        const [visitsResult, notesResult, aiResult] = await Promise.all([
          supabase
            .from('page_visits')
            .select('*')
            .gte('visited_at', dateRange?.start || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
            .lte('visited_at', dateRange?.end || new Date().toISOString()),
          
          supabase
            .from('notes')
            .select('id, created_at, is_encrypted')
            .gte('created_at', dateRange?.start || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
            .lte('created_at', dateRange?.end || new Date().toISOString()),
          
          supabase
            .from('ai_interactions')
            .select('request_type, created_at')
            .gte('created_at', dateRange?.start || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
            .lte('created_at', dateRange?.end || new Date().toISOString())
        ]);

        const stats = {
          visits: {
            total: visitsResult.data?.length || 0,
            unique: new Set(visitsResult.data?.map(v => v.ip_address)).size || 0,
            byCountry: visitsResult.data?.reduce((acc, v) => {
              acc[v.country || 'Unknown'] = (acc[v.country || 'Unknown'] || 0) + 1;
              return acc;
            }, {} as Record<string, number>) || {},
          },
          notes: {
            total: notesResult.data?.length || 0,
            encrypted: notesResult.data?.filter(n => n.is_encrypted).length || 0,
            dailyCreation: notesResult.data?.reduce((acc, n) => {
              const date = new Date(n.created_at).toDateString();
              acc[date] = (acc[date] || 0) + 1;
              return acc;
            }, {} as Record<string, number>) || {},
          },
          ai: {
            total: aiResult.data?.length || 0,
            byType: aiResult.data?.reduce((acc, ai) => {
              acc[ai.request_type] = (acc[ai.request_type] || 0) + 1;
              return acc;
            }, {} as Record<string, number>) || {},
          },
        };

        return new Response(
          JSON.stringify(stats),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'get_trends': {
        // Analyze usage trends
        const { data: trends, error } = await supabase
          .rpc('analyze_usage_trends', {
            start_date: dateRange?.start || new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
            end_date: dateRange?.end || new Date().toISOString()
          });

        if (error) {
          // Fallback if RPC doesn't exist
          const { data: visits } = await supabase
            .from('page_visits')
            .select('visited_at, page_path')
            .gte('visited_at', dateRange?.start || new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString())
            .order('visited_at', { ascending: true });

          const dailyTrends = visits?.reduce((acc, visit) => {
            const date = new Date(visit.visited_at).toDateString();
            acc[date] = (acc[date] || 0) + 1;
            return acc;
          }, {} as Record<string, number>) || {};

          return new Response(
            JSON.stringify({ dailyVisits: dailyTrends }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        return new Response(
          JSON.stringify(trends),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'export_data': {
        // Export analytics data
        const { data: exportData, error } = await supabase
          .from('page_visits')
          .select('*')
          .gte('visited_at', dateRange?.start || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
          .lte('visited_at', dateRange?.end || new Date().toISOString())
          .csv();

        if (error) throw error;

        return new Response(exportData, {
          headers: {
            ...corsHeaders,
            'Content-Type': 'text/csv',
            'Content-Disposition': 'attachment; filename="analytics-export.csv"',
          },
        });
      }

      default:
        throw new Error('Invalid action');
    }

  } catch (error) {
    console.error('Error in advanced-analytics:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
