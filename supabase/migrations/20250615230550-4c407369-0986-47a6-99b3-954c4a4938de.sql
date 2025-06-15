
-- Drop the existing view and recreate it with SECURITY INVOKER
DROP VIEW IF EXISTS public.pwa_analytics_summary;

CREATE OR REPLACE VIEW public.pwa_analytics_summary
WITH (security_invoker = on) AS
SELECT 
  DATE(created_at) as date,
  event_type,
  device_type,
  platform,
  COUNT(*) as count
FROM public.pwa_analytics 
GROUP BY DATE(created_at), event_type, device_type, platform
ORDER BY date DESC, event_type;
