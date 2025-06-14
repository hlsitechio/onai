

-- Enable the required extensions for cron jobs
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Note: pg_net extension is now installed in the extensions schema for security
-- CREATE EXTENSION IF NOT EXISTS pg_net SCHEMA extensions;

-- Create a table to track cron job executions
CREATE TABLE IF NOT EXISTS public.cron_job_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  job_name TEXT NOT NULL,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  status TEXT CHECK (status IN ('running', 'completed', 'failed')) DEFAULT 'running',
  details JSONB,
  error_message TEXT
);

-- Enable RLS on the cron job logs table
ALTER TABLE public.cron_job_logs ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow reading cron job logs (adjust as needed)
CREATE POLICY "Allow reading cron job logs" ON public.cron_job_logs
  FOR SELECT USING (true);

-- Example cron job: Clean up expired shared notes every hour
-- This will call an edge function that handles the cleanup
-- Updated to use extensions.net.http_post instead of net.http_post
SELECT cron.schedule(
  'cleanup-expired-shared-notes',
  '0 * * * *', -- Every hour at minute 0
  $$
  SELECT
    extensions.net.http_post(
      url := 'https://qrdulwzjgbfgaplazgsh.supabase.co/functions/v1/cron-cleanup',
      headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyZHVsd3pqZ2JmZ2FwbGF6Z3NoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4ODAzOTEsImV4cCI6MjA2MzQ1NjM5MX0.1KYtfqg9iKuu9UfSuySWOH7XsCneoDTbnYqg9JqSvjY"}'::jsonb,
      body := '{"job_name": "cleanup-expired-shared-notes"}'::jsonb
    ) as request_id;
  $$
);

-- Example cron job: Generate daily analytics report at midnight
-- Updated to use extensions.net.http_post instead of net.http_post
SELECT cron.schedule(
  'daily-analytics-report',
  '0 0 * * *', -- Every day at midnight
  $$
  SELECT
    extensions.net.http_post(
      url := 'https://qrdulwzjgbfgaplazgsh.supabase.co/functions/v1/cron-cleanup',
      headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyZHVsd3pqZ2JmZ2FwbGF6Z3NoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4ODAzOTEsImV4cCI6MjA2MzQ1NjM5MX0.1KYtfqg9iKuu9UfSuySWOH7XsCneoDTbnYqg9JqSvjY"}'::jsonb,
      body := '{"job_name": "daily-analytics-report"}'::jsonb
    ) as request_id;
  $$
);

