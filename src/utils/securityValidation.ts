
import { supabase } from '@/integrations/supabase/client';

export interface ContentSecurityResult {
  isValid: boolean;
  error?: string;
  flags?: string[];
}

export interface SecurityValidationOptions {
  maxLength?: number;
  allowHtml?: boolean;
  strictMode?: boolean;
}

/**
 * Enhanced input sanitization with comprehensive security checks
 */
export const sanitizeInput = (
  input: string, 
  options: SecurityValidationOptions = {}
): string => {
  if (!input || typeof input !== 'string') {
    return '';
  }

  const { maxLength = 10000, allowHtml = false, strictMode = true } = options;

  let sanitized = input.trim();

  // Remove dangerous patterns
  if (!allowHtml) {
    // Remove all HTML tags in strict mode
    if (strictMode) {
      sanitized = sanitized.replace(/<[^>]*>/g, '');
    } else {
      // Only remove dangerous tags
      sanitized = sanitized.replace(/<script[^>]*>.*?<\/script>/gi, '');
      sanitized = sanitized.replace(/<iframe[^>]*>.*?<\/iframe>/gi, '');
      sanitized = sanitized.replace(/<object[^>]*>.*?<\/object>/gi, '');
      sanitized = sanitized.replace(/<embed[^>]*>/gi, '');
    }
  }

  // Remove dangerous protocols
  sanitized = sanitized.replace(/javascript:/gi, '');
  sanitized = sanitized.replace(/data:text\/html/gi, '');
  sanitized = sanitized.replace(/vbscript:/gi, '');
  
  // Remove event handlers
  sanitized = sanitized.replace(/on\w+\s*=/gi, '');
  
  // Limit length
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }

  return sanitized;
};

/**
 * Check content security with enhanced validation
 */
export const checkContentSecurity = (
  content: string, 
  options: SecurityValidationOptions = {}
): ContentSecurityResult => {
  const { maxLength = 1048576 } = options; // 1MB default
  const flags: string[] = [];

  // Basic validation
  if (!content || typeof content !== 'string') {
    return { isValid: false, error: 'Content is required and must be a string' };
  }

  if (content.length === 0) {
    return { isValid: false, error: 'Content cannot be empty' };
  }

  if (content.length > maxLength) {
    return { 
      isValid: false, 
      error: `Content exceeds maximum length of ${maxLength} characters` 
    };
  }

  // XSS detection patterns
  const dangerousPatterns = [
    { pattern: /<script[^>]*>.*?<\/script>/gi, flag: 'script_tag' },
    { pattern: /javascript:/gi, flag: 'javascript_protocol' },
    { pattern: /data:text\/html/gi, flag: 'data_html' },
    { pattern: /vbscript:/gi, flag: 'vbscript_protocol' },
    { pattern: /on(load|error|click|focus|mouse|key)\s*=/gi, flag: 'event_handler' },
    { pattern: /<iframe[^>]*>/gi, flag: 'iframe_tag' },
    { pattern: /<object[^>]*>/gi, flag: 'object_tag' },
    { pattern: /<embed[^>]*>/gi, flag: 'embed_tag' }
  ];

  for (const { pattern, flag } of dangerousPatterns) {
    if (pattern.test(content)) {
      flags.push(flag);
    }
  }

  // If any dangerous patterns are found, reject the content
  if (flags.length > 0) {
    return {
      isValid: false,
      error: 'Content contains potentially dangerous elements',
      flags
    };
  }

  return { isValid: true };
};

/**
 * Enhanced rate limiting check using the database function
 */
export const checkRateLimit = async (
  action: string,
  maxRequests: number = 50
): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return false; // Not authenticated
    }

    const { data, error } = await supabase.rpc('check_enhanced_rate_limit', {
      user_uuid: user.id,
      action_type: action,
      max_requests: maxRequests,
      time_window: '1 hour'
    });

    if (error) {
      console.error('Rate limit check failed:', error);
      return true; // Allow on error to avoid blocking users
    }

    return data === true;
  } catch (error) {
    console.error('Error checking rate limit:', error);
    return true; // Allow on error
  }
};

/**
 * Validate user authentication status
 */
export const validateUserAuthentication = async (): Promise<{
  isAuthenticated: boolean;
  userId?: string;
  error?: string;
}> => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      return { 
        isAuthenticated: false, 
        error: `Authentication error: ${error.message}` 
      };
    }

    if (!user) {
      return { 
        isAuthenticated: false, 
        error: 'No authenticated user found' 
      };
    }

    return { 
      isAuthenticated: true, 
      userId: user.id 
    };
  } catch (error) {
    return { 
      isAuthenticated: false, 
      error: error instanceof Error ? error.message : 'Unknown authentication error' 
    };
  }
};

/**
 * Log security validation events
 */
export const logSecurityValidation = async (
  eventType: 'content_blocked' | 'rate_limit_exceeded' | 'auth_failure',
  details: Record<string, any>
): Promise<void> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    const { error } = await supabase
      .from('security_audit_log')
      .insert({
        user_id: user?.id || null,
        action: eventType,
        new_values: {
          ...details,
          timestamp: new Date().toISOString(),
          user_agent: navigator.userAgent
        }
      });

    if (error) {
      console.error('Failed to log security validation:', error);
    }
  } catch (error) {
    console.error('Error logging security validation:', error);
  }
};
