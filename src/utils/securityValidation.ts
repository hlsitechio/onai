
// Security validation utilities for client-side validation
export const validateContentLength = (content: string, maxLength: number = 1000000): boolean => {
  if (!content) return false;
  if (content.length > maxLength) return false;
  
  // Basic XSS prevention - check for script tags
  if (content.match(/<script[^>]*>.*?<\/script>/gi)) return false;
  
  return true;
};

export const sanitizeInput = (input: string): string => {
  if (!input) return '';
  
  // Remove potentially dangerous patterns
  let sanitized = input
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/data:/gi, '')
    .replace(/vbscript:/gi, '');
  
  // Limit length
  if (sanitized.length > 10000) {
    sanitized = sanitized.substring(0, 10000);
  }
  
  return sanitized;
};

export const checkContentSecurity = (content: string): { isValid: boolean; error?: string } => {
  if (!validateContentLength(content)) {
    return { 
      isValid: false, 
      error: 'Content length exceeds maximum allowed or contains invalid characters' 
    };
  }
  
  return { isValid: true };
};
