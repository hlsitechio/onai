
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CronJobRequest {
  job_name: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client with service role key for admin operations
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { job_name }: CronJobRequest = await req.json();
    
    console.log(`Starting cron job: ${job_name}`);

    // Log the start of the job
    const { data: logEntry, error: logError } = await supabase
      .from('cron_job_logs')
      .insert({
        job_name,
        status: 'running',
        details: { triggered_at: new Date().toISOString() }
      })
      .select()
      .single();

    if (logError) {
      console.error('Failed to create log entry:', logError);
    }

    const jobId = logEntry?.id;
    let result: any = {};
    let status = 'completed';
    let errorMessage = null;

    try {
      switch (job_name) {
        case 'cleanup-expired-shared-notes': {
          console.log('Cleaning up expired shared notes...');
          
          // Delete expired shared notes
          const { data: deletedNotes, error: deleteError } = await supabase
            .from('shared_notes')
            .delete()
            .lt('expires_at', new Date().toISOString())
            .select('id');

          if (deleteError) {
            throw deleteError;
          }

          result = {
            deleted_notes_count: deletedNotes?.length || 0,
            deleted_note_ids: deletedNotes?.map(note => note.id) || []
          };

          console.log(`Cleaned up ${result.deleted_notes_count} expired shared notes`);
          break;
        }

        case 'daily-analytics-report': {
          console.log('Generating daily analytics report...');
          
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = yesterday.toISOString().split('T')[0];

          // Get page visit statistics for yesterday
          const { data: visits, error: visitsError } = await supabase
            .from('page_visits')
            .select('page_path, ip_address')
            .gte('visited_at', `${yesterdayStr}T00:00:00.000Z`)
            .lt('visited_at', `${yesterdayStr}T23:59:59.999Z`);

          if (visitsError) {
            throw visitsError;
          }

          // Calculate metrics
          const totalVisits = visits?.length || 0;
          const uniqueVisitors = new Set(visits?.map(v => v.ip_address)).size;
          const pageViews = visits?.reduce((acc, visit) => {
            acc[visit.page_path] = (acc[visit.page_path] || 0) + 1;
            return acc;
          }, {} as Record<string, number>) || {};

          // Update or insert daily visit counts
          const { error: upsertError } = await supabase
            .from('daily_visit_counts')
            .upsert({
              visit_date: yesterdayStr,
              page_path: '/',
              visit_count: totalVisits
            });

          if (upsertError) {
            console.error('Failed to update daily visit counts:', upsertError);
          }

          // Get notes created yesterday
          const { data: newNotes, error: notesError } = await supabase
            .from('notes')
            .select('id')
            .gte('created_at', `${yesterdayStr}T00:00:00.000Z`)
            .lt('created_at', `${yesterdayStr}T23:59:59.999Z`);

          if (notesError) {
            console.error('Failed to get notes count:', notesError);
          }

          // Get security incidents from yesterday
          const { data: securityIncidents, error: securityError } = await supabase
            .from('security_incidents')
            .select('incident_type, severity')
            .gte('created_at', `${yesterdayStr}T00:00:00.000Z`)
            .lt('created_at', `${yesterdayStr}T23:59:59.999Z`);

          if (securityError) {
            console.error('Failed to get security incidents:', securityError);
          }

          result = {
            date: yesterdayStr,
            total_visits: totalVisits,
            unique_visitors: uniqueVisitors,
            page_views: pageViews,
            new_notes_count: newNotes?.length || 0,
            security_incidents_count: securityIncidents?.length || 0,
            security_incidents_by_severity: securityIncidents?.reduce((acc, incident) => {
              acc[incident.severity] = (acc[incident.severity] || 0) + 1;
              return acc;
            }, {} as Record<string, number>) || {}
          };

          console.log('Daily analytics report generated:', result);
          break;
        }

        default: {
          throw new Error(`Unknown job name: ${job_name}`);
        }
      }
    } catch (jobError) {
      console.error(`Error executing job ${job_name}:`, jobError);
      status = 'failed';
      errorMessage = jobError instanceof Error ? jobError.message : 'Unknown error';
      result = { error: errorMessage };
    }

    // Update the log entry with completion status
    if (jobId) {
      await supabase
        .from('cron_job_logs')
        .update({
          completed_at: new Date().toISOString(),
          status,
          details: result,
          error_message: errorMessage
        })
        .eq('id', jobId);
    }

    return new Response(
      JSON.stringify({
        success: status === 'completed',
        job_name,
        status,
        result,
        error: errorMessage
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in cron-cleanup function:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
