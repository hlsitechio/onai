
-- Create subscribers table to track subscription information (if not exists)
CREATE TABLE IF NOT EXISTS public.subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  stripe_customer_id TEXT,
  subscribed BOOLEAN NOT NULL DEFAULT false,
  subscription_tier TEXT DEFAULT 'starter',
  subscription_end TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view their own subscription info
DROP POLICY IF EXISTS "select_own_subscription" ON public.subscribers;
CREATE POLICY "select_own_subscription" ON public.subscribers
FOR SELECT
USING (user_id = auth.uid() OR email = auth.email());

-- Create policy for edge functions to update subscription info
DROP POLICY IF EXISTS "update_own_subscription" ON public.subscribers;
CREATE POLICY "update_own_subscription" ON public.subscribers
FOR UPDATE
USING (true);

-- Create policy for edge functions to insert subscription info
DROP POLICY IF EXISTS "insert_subscription" ON public.subscribers;
CREATE POLICY "insert_subscription" ON public.subscribers
FOR INSERT
WITH CHECK (true);

-- Create usage tracking table for AI requests (if not exists)
CREATE TABLE IF NOT EXISTS public.ai_usage_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  request_type TEXT NOT NULL,
  tokens_used INTEGER DEFAULT 0,
  subscription_tier TEXT DEFAULT 'starter',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  date DATE NOT NULL DEFAULT CURRENT_DATE
);

-- Enable RLS on usage tracking
ALTER TABLE public.ai_usage_tracking ENABLE ROW LEVEL SECURITY;

-- Policy for users to view their own usage
DROP POLICY IF EXISTS "users_view_own_usage" ON public.ai_usage_tracking;
CREATE POLICY "users_view_own_usage" ON public.ai_usage_tracking
FOR SELECT
USING (user_id = auth.uid());

-- Policy for inserting usage records
DROP POLICY IF EXISTS "users_insert_own_usage" ON public.ai_usage_tracking;
CREATE POLICY "users_insert_own_usage" ON public.ai_usage_tracking
FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Update the function to get daily AI usage count
CREATE OR REPLACE FUNCTION public.get_daily_ai_usage(user_uuid UUID, usage_date DATE DEFAULT CURRENT_DATE)
RETURNS INTEGER
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT COALESCE(COUNT(*), 0)::INTEGER
  FROM public.ai_usage_tracking
  WHERE user_id = user_uuid 
  AND date = usage_date;
$$;

-- Update the function to check if user can make AI request
CREATE OR REPLACE FUNCTION public.can_make_ai_request(user_uuid UUID)
RETURNS BOOLEAN
LANGUAGE PLPGSQL
SECURITY DEFINER
AS $$
DECLARE
  user_tier TEXT;
  daily_usage INTEGER;
  tier_limit INTEGER;
BEGIN
  -- Get user's subscription tier (default to starter if not found)
  SELECT COALESCE(subscription_tier, 'starter') INTO user_tier
  FROM public.subscribers
  WHERE user_id = user_uuid;
  
  -- If no record found, assume starter tier
  IF user_tier IS NULL THEN
    user_tier := 'starter';
  END IF;
  
  -- Get daily usage count
  SELECT public.get_daily_ai_usage(user_uuid) INTO daily_usage;
  
  -- Set tier limits
  IF user_tier = 'professional' THEN
    tier_limit := 500;
  ELSE
    tier_limit := 10; -- starter tier
  END IF;
  
  -- Return whether user can make request
  RETURN daily_usage < tier_limit;
END;
$$;
