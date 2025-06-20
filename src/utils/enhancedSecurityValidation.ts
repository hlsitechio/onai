
import { sanitizeInput, checkContentSecurity } from './securityValidation';
import { logContentSecurityEvent } from './enhancedSecurityLogger';

export interface EnhancedValidationResult {
  isValid: boolean;
  sanitizedContent?: string;
  warnings?: string[];
  blocked?: boolean;
  error?: string;
}

export const validateAndSanitizeContent = async (
  content: string,
  contentType: string = 'note'
): Promise<EnhancedValidationResult> => {
  try {
    // First check basic security
    const securityCheck = checkContentSecurity(content);
    if (!securityCheck.isValid) {
      await logContentSecurityEvent('content_blocked', contentType, {
        reason: securityCheck.error,
        content_length: content.length
      });
      
      return {
        isValid: false,
        blocked: true,
        error: securityCheck.error
      };
    }

    // Sanitize the content
    const sanitizedContent = sanitizeInput(content);
    const warnings: string[] = [];

    // Check if content was modified during sanitization
    if (sanitizedContent !== content) {
      warnings.push('Content was automatically sanitized for security');
      
      await logContentSecurityEvent('content_sanitized', contentType, {
        original_length: content.length,
        sanitized_length: sanitizedContent.length,
        modifications_made: true
      });
    }

    // Additional enhanced checks
    const suspiciousPatterns = [
      /eval\s*\(/i,
      /function\s*\(\s*\)\s*\{/i,
      /document\s*\.\s*write/i,
      /window\s*\.\s*location/i,
      /setTimeout\s*\(/i,
      /setInterval\s*\(/i
    ];

    let flagged = false;
    for (const pattern of suspiciousPatterns) {
      if (pattern.test(sanitizedContent)) {
        warnings.push('Potentially suspicious content detected');
        flagged = true;
        break;
      }
    }

    if (flagged) {
      await logContentSecurityEvent('content_flagged', contentType, {
        content_length: sanitizedContent.length,
        suspicious_patterns_found: true
      });
    }

    return {
      isValid: true,
      sanitizedContent,
      warnings: warnings.length > 0 ? warnings : undefined,
      blocked: false
    };
  } catch (error) {
    console.error('Enhanced validation error:', error);
    return {
      isValid: false,
      error: 'Validation failed due to an internal error',
      blocked: true
    };
  }
};

export const performRateLimitCheck = async (
  action: string,
  maxRequests: number = 100,
  timeWindow: string = '1 hour'
): Promise<boolean> => {
  try {
    // This would integrate with the enhanced rate limiting function
    // For now, we'll implement a basic client-side check
    const key = `rate_limit_${action}`;
    const now = Date.now();
    const stored = localStorage.getItem(key);
    
    if (stored) {
      const data = JSON.parse(stored);
      const timeWindowMs = timeWindow === '1 hour' ? 3600000 : 60000; // Default to 1 hour
      
      if (now - data.timestamp < timeWindowMs) {
        if (data.count >= maxRequests) {
          return false; // Rate limit exceeded
        }
        data.count++;
      } else {
        // Reset counter
        data.timestamp = now;
        data.count = 1;
      }
      
      localStorage.setItem(key, JSON.stringify(data));
    } else {
      localStorage.setItem(key, JSON.stringify({ timestamp: now, count: 1 }));
    }
    
    return true; // Within rate limit
  } catch (error) {
    console.error('Rate limit check error:', error);
    return true; // Allow on error to avoid blocking users
  }
};
