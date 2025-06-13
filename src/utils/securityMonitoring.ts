
import { supabase } from '@/integrations/supabase/client';

// Types for security monitoring
export interface SecurityIncident {
  incident_type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  details?: Record<string, any>;
}

export interface SecurityStatus {
  incidents_24h: number;
  active_rate_limits: number;
  blocked_ips: number;
  settings: Array<{ setting_name: string; setting_value: any }>;
  recent_incidents: Array<{
    incident_type: string;
    severity: string;
    created_at: string;
  }>;
}

/**
 * Log a security incident
 */
export const logSecurityIncident = async (
  incidentType: string,
  severity: 'low' | 'medium' | 'high' | 'critical' = 'medium',
  details?: Record<string, any>
): Promise<boolean> => {
  try {
    const { data, error } = await supabase.functions.invoke('security-monitor', {
      body: JSON.stringify({
        action: 'log_incident',
        incidentType,
        severity,
        details,
      }),
    });

    if (error) {
      console.error('Failed to log security incident:', error);
      return false;
    }

    return data?.success || false;
  } catch (error) {
    console.error('Error logging security incident:', error);
    return false;
  }
};

/**
 * Check if current request should be rate limited
 */
export const checkRateLimit = async (endpoint: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.functions.invoke('security-monitor', {
      body: JSON.stringify({
        action: 'check_rate_limit',
        endpoint,
      }),
    });

    if (error) {
      console.error('Failed to check rate limit:', error);
      return true; // Allow on error
    }

    return data?.allowed !== false;
  } catch (error) {
    console.error('Error checking rate limit:', error);
    return true; // Allow on error
  }
};

/**
 * Moderate content before processing
 */
export const moderateContent = async (
  contentType: string,
  contentId: string,
  content: string
): Promise<{ approved: boolean; flags?: string[] }> => {
  try {
    const { data, error } = await supabase.functions.invoke('security-monitor', {
      body: JSON.stringify({
        action: 'moderate_content',
        contentType,
        contentId,
        content,
      }),
    });

    if (error) {
      console.error('Failed to moderate content:', error);
      return { approved: true }; // Allow on error
    }

    return {
      approved: data?.approved || false,
      flags: data?.flags,
    };
  } catch (error) {
    console.error('Error moderating content:', error);
    return { approved: true }; // Allow on error
  }
};

/**
 * Get current security status
 */
export const getSecurityStatus = async (): Promise<SecurityStatus | null> => {
  try {
    const { data, error } = await supabase.functions.invoke('security-monitor', {
      body: JSON.stringify({
        action: 'get_security_status',
      }),
    });

    if (error) {
      console.error('Failed to get security status:', error);
      return null;
    }

    return data?.security_status || null;
  } catch (error) {
    console.error('Error getting security status:', error);
    return null;
  }
};

/**
 * Enhanced tracking for privacy-friendly security monitoring
 */
export const trackSecurityEvent = (eventType: string, details?: Record<string, any>): void => {
  // Only track security-relevant events, not user behavior
  const securityEvents = [
    'login_attempt',
    'failed_login',
    'suspicious_activity',
    'content_flagged',
    'rate_limit_approached',
  ];

  if (securityEvents.includes(eventType)) {
    // Log asynchronously without blocking user experience
    logSecurityIncident(eventType, 'low', details).catch(error => {
      console.error('Failed to track security event:', error);
    });
  }
};

/**
 * Validate and sanitize user input for security
 */
export const sanitizeInput = (input: string, maxLength: number = 1000): string => {
  if (!input || typeof input !== 'string') {
    return '';
  }

  // Remove potentially dangerous characters
  let sanitized = input
    .replace(/[<>]/g, '') // Remove basic HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/data:/gi, '') // Remove data: protocol
    .trim();

  // Truncate if too long
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
    
    // Log if content was truncated due to length
    trackSecurityEvent('content_truncated', { 
      original_length: input.length, 
      truncated_length: maxLength 
    });
  }

  return sanitized;
};
