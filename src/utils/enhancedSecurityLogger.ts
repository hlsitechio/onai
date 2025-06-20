
import { supabase } from '@/integrations/supabase/client';
import { logSecurityEvent } from './auditLogger';

export interface SecurityEvent {
  eventType: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  details?: Record<string, any>;
  userId?: string;
}

// Enhanced security event logging with better categorization
export const logEnhancedSecurityEvent = async (event: SecurityEvent): Promise<void> => {
  try {
    // Log to security audit log
    await logSecurityEvent({
      action: event.eventType,
      details: {
        ...event.details,
        severity: event.severity,
        timestamp: new Date().toISOString(),
        user_agent: navigator.userAgent,
        url: window.location.href
      }
    });

    // For high/critical events, also log to security incidents table
    if (event.severity === 'high' || event.severity === 'critical') {
      const { error } = await supabase
        .from('security_incidents')
        .insert({
          incident_type: event.eventType,
          severity: event.severity,
          details: event.details || {},
          resolved: false
        });

      if (error) {
        console.error('Failed to log security incident:', error);
      }
    }
  } catch (error) {
    console.error('Failed to log enhanced security event:', error);
  }
};

// OAuth-specific security logging
export const logOAuthEvent = async (
  eventType: 'oauth_start' | 'oauth_success' | 'oauth_error' | 'oauth_callback',
  provider: string,
  details?: Record<string, any>
): Promise<void> => {
  await logEnhancedSecurityEvent({
    eventType: `oauth_${eventType}`,
    severity: eventType === 'oauth_error' ? 'medium' : 'low',
    details: {
      provider,
      ...details
    }
  });
};

// Enhanced authentication monitoring
export const logAuthenticationEvent = async (
  eventType: 'login_attempt' | 'login_success' | 'login_failure' | 'logout',
  method: 'email' | 'google' | 'github',
  details?: Record<string, any>
): Promise<void> => {
  const severity = eventType === 'login_failure' ? 'medium' : 'low';
  
  await logEnhancedSecurityEvent({
    eventType,
    severity,
    details: {
      auth_method: method,
      ...details
    }
  });
};

// Content security monitoring
export const logContentSecurityEvent = async (
  eventType: 'content_blocked' | 'content_sanitized' | 'content_flagged',
  contentType: string,
  details?: Record<string, any>
): Promise<void> => {
  await logEnhancedSecurityEvent({
    eventType,
    severity: 'medium',
    details: {
      content_type: contentType,
      ...details
    }
  });
};
