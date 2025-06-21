
-- Phase 1: Critical Database Security Fixes (Corrected)

-- First, clean up ALL existing RLS policies on the notes table
DO $$ 
BEGIN
    -- Drop all existing policies on notes table
    DROP POLICY IF EXISTS "Consolidated read access for notes" ON public.notes;
    DROP POLICY IF EXISTS "Users can view their own notes" ON public.notes;
    DROP POLICY IF EXISTS "Users can create their own notes" ON public.notes;
    DROP POLICY IF EXISTS "Users can update their own notes" ON public.notes;
    DROP POLICY IF EXISTS "Users can delete their own notes" ON public.notes;
    DROP POLICY IF EXISTS "authenticated_users_select_own_notes" ON public.notes;
    DROP POLICY IF EXISTS "authenticated_users_insert_own_notes" ON public.notes;
    DROP POLICY IF EXISTS "authenticated_users_update_own_notes" ON public.notes;
    DROP POLICY IF EXISTS "authenticated_users_delete_own_notes" ON public.notes;
END $$;

-- Ensure RLS is enabled on the notes table
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

-- Create comprehensive, non-overlapping RLS policies for notes
CREATE POLICY "authenticated_users_select_own_notes" 
  ON public.notes 
  FOR SELECT 
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "authenticated_users_insert_own_notes" 
  ON public.notes 
  FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "authenticated_users_update_own_notes" 
  ON public.notes 
  FOR UPDATE 
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "authenticated_users_delete_own_notes" 
  ON public.notes 
  FOR DELETE 
  TO authenticated
  USING (auth.uid() = user_id);

-- Ensure user_id column is NOT NULL for security
ALTER TABLE public.notes ALTER COLUMN user_id SET NOT NULL;

-- Add enhanced content validation function (replace existing)
CREATE OR REPLACE FUNCTION public.validate_note_content(content text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check for null or empty content
  IF content IS NULL OR LENGTH(TRIM(content)) = 0 THEN
    RETURN FALSE;
  END IF;
  
  -- Check maximum content length (1MB)
  IF LENGTH(content) > 1048576 THEN
    RETURN FALSE;
  END IF;
  
  -- Enhanced XSS prevention - check for dangerous patterns
  IF content ~* '<script[^>]*>.*?</script>' OR
     content ~* 'javascript:' OR
     content ~* 'data:text/html' OR
     content ~* 'vbscript:' OR
     content ~* 'on(load|error|click|focus)=' THEN
    RETURN FALSE;
  END IF;
  
  RETURN TRUE;
END;
$$;

-- Add trigger to validate content on insert/update (replace existing)
CREATE OR REPLACE FUNCTION public.validate_note_trigger()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NOT public.validate_note_content(NEW.content) THEN
    RAISE EXCEPTION 'Invalid note content detected';
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for content validation (drop first to avoid conflicts)
DROP TRIGGER IF EXISTS validate_note_content_trigger ON public.notes;
CREATE TRIGGER validate_note_content_trigger
  BEFORE INSERT OR UPDATE ON public.notes
  FOR EACH ROW EXECUTE FUNCTION public.validate_note_trigger();

-- Strengthen shared_notes security
ALTER TABLE public.shared_notes ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists and create new one
DROP POLICY IF EXISTS "public_read_valid_shared_notes" ON public.shared_notes;
CREATE POLICY "public_read_valid_shared_notes" 
  ON public.shared_notes 
  FOR SELECT 
  USING (expires_at > NOW());

-- Add rate limiting enhancement (replace existing function)
CREATE OR REPLACE FUNCTION public.check_enhanced_rate_limit(
  user_uuid uuid, 
  action_type text, 
  max_requests integer DEFAULT 50, 
  time_window interval DEFAULT '01:00:00'::interval
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  request_count INTEGER;
  user_tier TEXT;
  tier_multiplier NUMERIC := 1.0;
BEGIN
  -- Get user tier for rate limit adjustment
  SELECT COALESCE(subscription_tier, 'starter') INTO user_tier
  FROM public.subscribers
  WHERE user_id = user_uuid;
  
  -- Adjust rate limits based on subscription tier
  IF user_tier = 'professional' THEN
    tier_multiplier := 5.0;
  ELSIF user_tier = 'premium' THEN
    tier_multiplier := 10.0;
  END IF;
  
  -- Count recent requests
  SELECT COUNT(*) INTO request_count
  FROM public.security_audit_log
  WHERE user_id = user_uuid
    AND action = action_type
    AND created_at > NOW() - time_window;
  
  -- Return true if under the adjusted limit
  RETURN request_count < (max_requests * tier_multiplier);
END;
$$;
