
-- Phase 1: Critical Security Fixes - RLS Policies and Database Security

-- First, ensure all tables have proper RLS enabled and policies
-- Fix the notes table RLS policies to be more secure and consistent

-- Drop existing potentially problematic policies
DROP POLICY IF EXISTS "Consolidated read access for notes" ON public.notes;
DROP POLICY IF EXISTS "Enhanced read access for notes" ON public.notes;
DROP POLICY IF EXISTS "Users can view their own notes" ON public.notes;
DROP POLICY IF EXISTS "Users can create their own notes" ON public.notes;
DROP POLICY IF EXISTS "Users can update their own notes" ON public.notes;
DROP POLICY IF EXISTS "Users can delete their own notes" ON public.notes;

-- Create comprehensive RLS policies for notes table
CREATE POLICY "notes_select_policy" ON public.notes
  FOR SELECT 
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "notes_insert_policy" ON public.notes
  FOR INSERT 
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "notes_update_policy" ON public.notes
  FOR UPDATE 
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "notes_delete_policy" ON public.notes
  FOR DELETE 
  TO authenticated
  USING (user_id = auth.uid());

-- Fix AI interactions tables RLS policies
ALTER TABLE public.ai_interactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own AI interactions" ON public.ai_interactions;
DROP POLICY IF EXISTS "Users can create their own AI interactions" ON public.ai_interactions;
DROP POLICY IF EXISTS "Users can update their own AI interactions" ON public.ai_interactions;
DROP POLICY IF EXISTS "Users can delete their own AI interactions" ON public.ai_interactions;

CREATE POLICY "ai_interactions_select_policy" ON public.ai_interactions
  FOR SELECT 
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "ai_interactions_insert_policy" ON public.ai_interactions
  FOR INSERT 
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Fix AI interactions v2 table RLS policies
ALTER TABLE public.ai_interactions_v2 ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ai_interactions_v2_select_policy" ON public.ai_interactions_v2
  FOR SELECT 
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "ai_interactions_v2_insert_policy" ON public.ai_interactions_v2
  FOR INSERT 
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Fix user profiles RLS policies
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.user_profiles;

CREATE POLICY "user_profiles_select_policy" ON public.user_profiles
  FOR SELECT 
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "user_profiles_insert_policy" ON public.user_profiles
  FOR INSERT 
  TO authenticated
  WITH CHECK (id = auth.uid());

CREATE POLICY "user_profiles_update_policy" ON public.user_profiles
  FOR UPDATE 
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Fix user settings RLS policies
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage their own settings" ON public.user_settings;

CREATE POLICY "user_settings_select_policy" ON public.user_settings
  FOR SELECT 
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "user_settings_insert_policy" ON public.user_settings
  FOR INSERT 
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "user_settings_update_policy" ON public.user_settings
  FOR UPDATE 
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "user_settings_delete_policy" ON public.user_settings
  FOR DELETE 
  TO authenticated
  USING (user_id = auth.uid());

-- Add input validation function for content
CREATE OR REPLACE FUNCTION public.validate_content_length(content TEXT, max_length INTEGER DEFAULT 1000000)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF content IS NULL THEN
    RETURN FALSE;
  END IF;
  
  IF LENGTH(content) > max_length THEN
    RETURN FALSE;
  END IF;
  
  -- Basic XSS prevention - check for script tags
  IF content ~* '<script[^>]*>.*?</script>' THEN
    RETURN FALSE;
  END IF;
  
  RETURN TRUE;
END;
$$;

-- Add content validation to notes table
ALTER TABLE public.notes ADD CONSTRAINT notes_content_validation 
  CHECK (public.validate_content_length(content, 1000000));

-- Create audit log table for security monitoring
CREATE TABLE IF NOT EXISTS public.security_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  table_name TEXT,
  record_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on audit log (only admins can view)
ALTER TABLE public.security_audit_log ENABLE ROW LEVEL SECURITY;

-- Create function to log security events
CREATE OR REPLACE FUNCTION public.log_security_event()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.security_audit_log (
    user_id,
    action,
    table_name,
    record_id,
    old_values,
    new_values,
    created_at
  ) VALUES (
    auth.uid(),
    TG_OP,
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    CASE WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD) ELSE NULL END,
    CASE WHEN TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN to_jsonb(NEW) ELSE NULL END,
    NOW()
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Add audit triggers to critical tables
CREATE TRIGGER notes_audit_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.notes
  FOR EACH ROW EXECUTE FUNCTION public.log_security_event();

CREATE TRIGGER user_profiles_audit_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.log_security_event();

-- Create rate limiting enhancement
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  user_uuid UUID,
  action_type TEXT,
  max_requests INTEGER DEFAULT 100,
  time_window INTERVAL DEFAULT '1 hour'::INTERVAL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  request_count INTEGER;
BEGIN
  -- Count requests in the time window
  SELECT COUNT(*) INTO request_count
  FROM public.security_audit_log
  WHERE user_id = user_uuid
    AND action = action_type
    AND created_at > NOW() - time_window;
  
  -- Return true if under the limit
  RETURN request_count < max_requests;
END;
$$;

-- Create function to sanitize user input
CREATE OR REPLACE FUNCTION public.sanitize_input(input_text TEXT)
RETURNS TEXT
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
  IF input_text IS NULL THEN
    RETURN NULL;
  END IF;
  
  -- Remove potentially dangerous patterns
  input_text := regexp_replace(input_text, '<script[^>]*>.*?</script>', '', 'gi');
  input_text := regexp_replace(input_text, 'javascript:', '', 'gi');
  input_text := regexp_replace(input_text, 'data:', '', 'gi');
  input_text := regexp_replace(input_text, 'vbscript:', '', 'gi');
  
  -- Limit length
  IF LENGTH(input_text) > 10000 THEN
    input_text := LEFT(input_text, 10000);
  END IF;
  
  RETURN input_text;
END;
$$;
