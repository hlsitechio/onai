
-- Create deploy_hooks table to store webhook configurations
CREATE TABLE public.deploy_hooks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  vercel_project_id TEXT NOT NULL,
  hook_name TEXT NOT NULL,
  branch TEXT NOT NULL DEFAULT 'main',
  webhook_url TEXT NOT NULL UNIQUE,
  webhook_secret TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_triggered_at TIMESTAMP WITH TIME ZONE,
  trigger_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT fk_deploy_hooks_vercel_project 
    FOREIGN KEY (user_id, vercel_project_id) 
    REFERENCES public.vercel_projects(user_id, vercel_project_id) 
    ON DELETE CASCADE
);

-- Add RLS policies for deploy_hooks
ALTER TABLE public.deploy_hooks ENABLE ROW LEVEL SECURITY;

-- Policy for users to view their own deploy hooks
CREATE POLICY "Users can view their own deploy hooks" 
  ON public.deploy_hooks 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Policy for users to create their own deploy hooks
CREATE POLICY "Users can create their own deploy hooks" 
  ON public.deploy_hooks 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Policy for users to update their own deploy hooks
CREATE POLICY "Users can update their own deploy hooks" 
  ON public.deploy_hooks 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Policy for users to delete their own deploy hooks
CREATE POLICY "Users can delete their own deploy hooks" 
  ON public.deploy_hooks 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create trigger to update updated_at column
CREATE TRIGGER update_deploy_hooks_updated_at
  BEFORE UPDATE ON public.deploy_hooks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better performance on webhook lookups
CREATE INDEX idx_deploy_hooks_webhook_url ON public.deploy_hooks(webhook_url);
CREATE INDEX idx_deploy_hooks_user_project ON public.deploy_hooks(user_id, vercel_project_id);

-- Create deploy_hook_logs table to track webhook usage
CREATE TABLE public.deploy_hook_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  deploy_hook_id UUID NOT NULL REFERENCES public.deploy_hooks(id) ON DELETE CASCADE,
  triggered_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  source_ip INET,
  user_agent TEXT,
  deployment_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  error_message TEXT,
  response_data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS for deploy_hook_logs (users can view logs for their hooks)
ALTER TABLE public.deploy_hook_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view logs for their deploy hooks" 
  ON public.deploy_hook_logs 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.deploy_hooks 
      WHERE deploy_hooks.id = deploy_hook_logs.deploy_hook_id 
      AND deploy_hooks.user_id = auth.uid()
    )
  );

-- Create index for better performance on log queries
CREATE INDEX idx_deploy_hook_logs_hook_id ON public.deploy_hook_logs(deploy_hook_id);
CREATE INDEX idx_deploy_hook_logs_triggered_at ON public.deploy_hook_logs(triggered_at DESC);
