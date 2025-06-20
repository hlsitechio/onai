
import { supabase } from '@/integrations/supabase/client';
import { logSecurityEvent } from './auditLogger';

// Enhanced security monitoring with better error handling
export const trackSecurityEvent = async (eventType: string, details?: Record<string, any>): Promise<void> => {
  try {
    // Only track security-relevant events
    const securityEvents = [
      'login_attempt',
      'failed_login',
      'suspicious_activity',
      'content_flagged',
      'rate_limit_approached',
      'unauthorized_access_attempt',
      'data_export',
      'settings_change'
    ];

    if (securityEvents.includes(eventType)) {
      await logSecurityEvent({
        action: eventType,
        details: {
          ...details,
          timestamp: new Date().toISOString(),
          user_agent: navigator.userAgent,
          url: window.location.href
        }
      });
    }
  } catch (error) {
    console.error('Failed to track security event:', error);
  }
};

export const validateUserSession = async (): Promise<boolean> => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      await trackSecurityEvent('session_validation_error', { error: error.message });
      return false;
    }

    if (!session) {
      await trackSecurityEvent('no_active_session');
      return false;
    }

    // Check if session is expired
    if (session.expires_at && session.expires_at < Date.now() / 1000) {
      await trackSecurityEvent('expired_session');
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error validating user session:', error);
    await trackSecurityEvent('session_validation_error', { error: String(error) });
    return false;
  }
};

export const enhancedRateLimitCheck = async (action: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.rpc('check_rate_limit', {
      user_uuid: (await supabase.auth.getUser()).data.user?.id,
      action_type: action,
      max_requests: 100,
      time_window: '1 hour'
    });

    if (error) {
      console.error('Rate limit check failed:', error);
      return true; // Allow on error to avoid blocking users
    }

    if (!data) {
      await trackSecurityEvent('rate_limit_exceeded', { action });
      return false;
    }

    return data;
  } catch (error) {
    console.error('Error checking rate limit:', error);
    return true; // Allow on error
  }
};
