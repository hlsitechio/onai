
-- Create vercel_projects table to store project configurations
CREATE TABLE public.vercel_projects (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  project_name text NOT NULL,
  vercel_project_id text NOT NULL,
  deployment_url text,
  framework text DEFAULT 'vite',
  build_command text DEFAULT 'npm run build',
  output_directory text DEFAULT 'dist',
  environment_variables jsonb DEFAULT '{}',
  deployment_settings jsonb DEFAULT '{}',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, vercel_project_id)
);

-- Create deployment_logs table to track deployment history
CREATE TABLE public.deployment_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  vercel_project_id text NOT NULL,
  deployment_id text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  deployment_url text,
  commit_sha text,
  branch text DEFAULT 'main',
  build_duration integer,
  deployment_size bigint,
  errors jsonb DEFAULT '[]',
  warnings jsonb DEFAULT '[]',
  metadata jsonb DEFAULT '{}',
  created_at timestamp with time zone DEFAULT now(),
  completed_at timestamp with time zone
);

-- Create deployment_analytics table for analytics
CREATE TABLE public.deployment_analytics (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  vercel_project_id text NOT NULL,
  deployment_id text NOT NULL,
  page_views bigint DEFAULT 0,
  unique_visitors bigint DEFAULT 0,
  bandwidth_used bigint DEFAULT 0,
  response_time_avg numeric DEFAULT 0,
  error_rate numeric DEFAULT 0,
  date date NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(vercel_project_id, deployment_id, date)
);

-- Enable RLS on all tables
ALTER TABLE public.vercel_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deployment_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deployment_analytics ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for vercel_projects
CREATE POLICY "Users can view their own Vercel projects" 
  ON public.vercel_projects 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own Vercel projects" 
  ON public.vercel_projects 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own Vercel projects" 
  ON public.vercel_projects 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own Vercel projects" 
  ON public.vercel_projects 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create RLS policies for deployment_logs
CREATE POLICY "Users can view their own deployment logs" 
  ON public.deployment_logs 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own deployment logs" 
  ON public.deployment_logs 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own deployment logs" 
  ON public.deployment_logs 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create RLS policies for deployment_analytics
CREATE POLICY "Users can view their own deployment analytics" 
  ON public.deployment_analytics 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own deployment analytics" 
  ON public.deployment_analytics 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own deployment analytics" 
  ON public.deployment_analytics 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_vercel_projects_user_id ON public.vercel_projects(user_id);
CREATE INDEX idx_deployment_logs_user_id ON public.deployment_logs(user_id);
CREATE INDEX idx_deployment_logs_vercel_project_id ON public.deployment_logs(vercel_project_id);
CREATE INDEX idx_deployment_analytics_user_id ON public.deployment_analytics(user_id);
CREATE INDEX idx_deployment_analytics_date ON public.deployment_analytics(date);

-- Create trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_vercel_projects_updated_at 
    BEFORE UPDATE ON public.vercel_projects 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
