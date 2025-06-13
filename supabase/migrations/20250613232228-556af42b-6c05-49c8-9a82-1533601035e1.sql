
-- Create essential security tables without invasive user tracking
-- Focus on system security rather than detailed user behavior tracking

-- Table for security incidents and threats
CREATE TABLE IF NOT EXISTS public.security_incidents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  incident_type TEXT NOT NULL, -- 'failed_login', 'suspicious_activity', 'rate_limit_exceeded', 'malicious_request'
  severity TEXT NOT NULL DEFAULT 'medium', -- 'low', 'medium', 'high', 'critical'
  ip_address INET,
  user_agent TEXT,
  details JSONB,
  resolved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table for rate limiting (IP-based, not user-based)
CREATE TABLE IF NOT EXISTS public.rate_limits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_address INET NOT NULL,
  endpoint TEXT NOT NULL,
  request_count INTEGER DEFAULT 1,
  window_start TIMESTAMP WITH TIME ZONE DEFAULT now(),
  blocked_until TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table for content moderation (only for public content)
CREATE TABLE IF NOT EXISTS public.content_moderation (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content_type TEXT NOT NULL, -- 'note', 'comment', 'shared_content'
  content_id UUID NOT NULL,
  moderation_status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected', 'flagged'
  flags JSONB, -- Array of detected issues
  moderator_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table for system security settings
CREATE TABLE IF NOT EXISTS public.security_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_name TEXT UNIQUE NOT NULL,
  setting_value JSONB NOT NULL,
  description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Insert default security settings
INSERT INTO public.security_settings (setting_name, setting_value, description) VALUES
('rate_limit_requests_per_minute', '60', 'Maximum requests per minute per IP'),
('rate_limit_ai_requests_per_hour', '100', 'Maximum AI requests per hour per IP'),
('enable_content_moderation', 'true', 'Enable automatic content moderation'),
('max_failed_login_attempts', '5', 'Maximum failed login attempts before temporary block'),
('session_timeout_hours', '24', 'Session timeout in hours')
ON CONFLICT (setting_name) DO NOTHING;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_security_incidents_type_created ON public.security_incidents(incident_type, created_at);
CREATE INDEX IF NOT EXISTS idx_rate_limits_ip_endpoint ON public.rate_limits(ip_address, endpoint);
CREATE INDEX IF NOT EXISTS idx_rate_limits_window ON public.rate_limits(window_start);
CREATE INDEX IF NOT EXISTS idx_content_moderation_status ON public.content_moderation(moderation_status);

-- Enable RLS on all tables
ALTER TABLE public.security_incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_moderation ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_settings ENABLE ROW LEVEL SECURITY;

-- Create policies that allow service role access only (these are admin/system tables)
CREATE POLICY "Service role access only" ON public.security_incidents FOR ALL USING (false);
CREATE POLICY "Service role access only" ON public.rate_limits FOR ALL USING (false);
CREATE POLICY "Service role access only" ON public.content_moderation FOR ALL USING (false);
CREATE POLICY "Service role access only" ON public.security_settings FOR ALL USING (false);
