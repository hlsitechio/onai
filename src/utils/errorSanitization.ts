/**
 * Enhanced error sanitization to prevent sensitive data leaks
 */

// Sensitive data patterns to remove
const SENSITIVE_PATTERNS = [
  /password/gi,
  /token/gi,
  /key/gi,
  /secret/gi,
  /auth/gi,
  /email/gi,
  /phone/gi,
  /ssn/gi,
  /credit/gi,
  /card/gi,
  /api[_-]?key/gi,
  /bearer/gi,
  /jwt/gi,
];

// URLs that should be sanitized
const SENSITIVE_URLS = [
  'supabase.co',
  'vercel.app',
  'auth0.com',
  'googleapis.com',
];

/**
 * Sanitize error messages to remove sensitive information
 */
export const sanitizeErrorMessage = (message: string): string => {
  let sanitized = message;
  
  // Remove potential API keys or tokens
  sanitized = sanitized.replace(/[a-zA-Z0-9]{32,}/g, '[REDACTED]');
  
  // Remove URLs with sensitive domains
  SENSITIVE_URLS.forEach(domain => {
    const regex = new RegExp(`https?://[^\\s]*${domain}[^\\s]*`, 'gi');
    sanitized = sanitized.replace(regex, '[REDACTED_URL]');
  });
  
  // Remove email addresses
  sanitized = sanitized.replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[REDACTED_EMAIL]');
  
  // Remove file paths that might contain usernames
  sanitized = sanitized.replace(/\/Users\/[^\/\s]+/g, '/Users/[REDACTED]');
  sanitized = sanitized.replace(/C:\\Users\\[^\\s]+/g, 'C:\\Users\\[REDACTED]');
  
  return sanitized;
};

/**
 * Sanitize error stack traces
 */
export const sanitizeStackTrace = (stack: string): string => {
  let sanitized = stack;
  
  // Remove absolute file paths
  sanitized = sanitized.replace(/file:\/\/\/[^\s)]+/g, '[REDACTED_PATH]');
  
  // Remove webpack internal paths
  sanitized = sanitized.replace(/webpack-internal:\/\/\/[^\s)]+/g, '[WEBPACK_INTERNAL]');
  
  // Remove node_modules paths while keeping relative info
  sanitized = sanitized.replace(/\/node_modules\/([^\/]+)/g, '/node_modules/$1');
  
  return sanitizeErrorMessage(sanitized);
};

/**
 * Sanitize error objects completely
 */
export const sanitizeError = (error: Error): Error => {
  const sanitizedError = new Error(sanitizeErrorMessage(error.message));
  sanitizedError.name = error.name;
  
  if (error.stack) {
    sanitizedError.stack = sanitizeStackTrace(error.stack);
  }
  
  return sanitizedError;
};

/**
 * Check if error contains sensitive information
 */
export const containsSensitiveData = (text: string): boolean => {
  return SENSITIVE_PATTERNS.some(pattern => pattern.test(text));
};

/**
 * Sanitize console arguments before logging
 */
export const sanitizeConsoleArgs = (args: any[]): any[] => {
  return args.map(arg => {
    if (typeof arg === 'string') {
      return containsSensitiveData(arg) ? sanitizeErrorMessage(arg) : arg;
    }
    
    if (typeof arg === 'object' && arg !== null) {
      return sanitizeObject(arg);
    }
    
    return arg;
  });
};

/**
 * Sanitize object properties
 */
const sanitizeObject = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item));
  }
  
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }
  
  const sanitized: any = {};
  
  Object.keys(obj).forEach(key => {
    const lowerKey = key.toLowerCase();
    
    // Check if key might contain sensitive data
    if (SENSITIVE_PATTERNS.some(pattern => pattern.test(lowerKey))) {
      sanitized[key] = '[REDACTED]';
    } else if (typeof obj[key] === 'string' && containsSensitiveData(obj[key])) {
      sanitized[key] = sanitizeErrorMessage(obj[key]);
    } else if (typeof obj[key] === 'object') {
      sanitized[key] = sanitizeObject(obj[key]);
    } else {
      sanitized[key] = obj[key];
    }
  });
  
  return sanitized;
};
