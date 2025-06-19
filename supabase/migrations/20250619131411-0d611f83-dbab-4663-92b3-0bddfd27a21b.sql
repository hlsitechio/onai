
-- Fix the search path security issue for both get_daily_ai_usage functions
-- First, drop and recreate the function that returns a table
DROP FUNCTION IF EXISTS public.get_daily_ai_usage();

CREATE OR REPLACE FUNCTION public.get_daily_ai_usage()
RETURNS TABLE(
  user_id UUID,
  daily_count INTEGER,
  usage_date DATE
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Return daily AI usage statistics for all users for today
  RETURN QUERY
  SELECT 
    aut.user_id,
    COUNT(*)::INTEGER as daily_count,
    aut.date as usage_date
  FROM public.ai_usage_tracking aut
  WHERE aut.date = CURRENT_DATE
  GROUP BY aut.user_id, aut.date
  ORDER BY daily_count DESC;
END;
$$;

-- Fix the search path for the function that takes parameters
DROP FUNCTION IF EXISTS public.get_daily_ai_usage(uuid, date);

CREATE OR REPLACE FUNCTION public.get_daily_ai_usage(user_uuid UUID, usage_date DATE DEFAULT CURRENT_DATE)
RETURNS INTEGER
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(COUNT(*), 0)::INTEGER
  FROM public.ai_usage_tracking
  WHERE user_id = user_uuid 
  AND date = usage_date;
$$;
