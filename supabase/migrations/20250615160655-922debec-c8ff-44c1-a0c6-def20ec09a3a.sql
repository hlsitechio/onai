
-- Create table for PWA installation analytics
CREATE TABLE public.pwa_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL CHECK (event_type IN ('prompt_shown', 'install_completed', 'install_declined', 'app_launched')),
  user_agent TEXT,
  device_type TEXT CHECK (device_type IN ('mobile', 'desktop', 'tablet')),
  platform TEXT CHECK (platform IN ('android', 'ios', 'windows', 'mac', 'linux')),
  browser TEXT,
  session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Create indexes for better query performance
CREATE INDEX idx_pwa_analytics_event_type ON public.pwa_analytics(event_type);
CREATE INDEX idx_pwa_analytics_created_at ON public.pwa_analytics(created_at);
CREATE INDEX idx_pwa_analytics_device_type ON public.pwa_analytics(device_type);
CREATE INDEX idx_pwa_analytics_platform ON public.pwa_analytics(platform);

-- Enable RLS (Row Level Security)
ALTER TABLE public.pwa_analytics ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access (for analytics viewing)
CREATE POLICY "Allow public read access to PWA analytics" 
  ON public.pwa_analytics 
  FOR SELECT 
  USING (true);

-- Create policy to allow public insert (for tracking events)
CREATE POLICY "Allow public insert to PWA analytics" 
  ON public.pwa_analytics 
  FOR INSERT 
  WITH CHECK (true);

-- Create a view for aggregated analytics
CREATE OR REPLACE VIEW public.pwa_analytics_summary AS
SELECT 
  DATE(created_at) as date,
  event_type,
  device_type,
  platform,
  COUNT(*) as count
FROM public.pwa_analytics 
GROUP BY DATE(created_at), event_type, device_type, platform
ORDER BY date DESC, event_type;
