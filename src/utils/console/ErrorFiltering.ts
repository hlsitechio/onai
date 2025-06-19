
/**
 * Error filtering utilities for console control
 */
export class ErrorFiltering {
  /**
   * Check if error should be filtered out (the specific errors you mentioned)
   */
  static isFilteredError(message: string): boolean {
    const messageStr = message.toLowerCase();
    
    // Exact patterns for the specific errors you want to filter
    const filteredPatterns = [
      // Message port errors (browser extensions)
      'the message port closed before a response was received',
      'message port closed before a response was received',
      'message port closed',
      
      // CSP Worker violations (Sentry)
      'refused to create a worker from \'blob:',
      'refused to create a worker from "blob:',
      'refused to create a worker',
      'violates the following content security policy directive',
      'worker-src',
      'script-src',
      
      // Minified React errors
      'minified react error #130',
      'react error #130',
      'element type is invalid',
      
      // Pointer event spam (new addition)
      'pointer event detected:',
      'pointer event detected',
      
      // Browser feature warnings
      'unrecognized feature',
      'understand this warning',
      'understand this error',
      "'vr'",
      "'ambient-light-sensor'",
      "'battery'",
      'iframe which has both allow-scripts and allow-same-origin',
      'sandbox attribute can escape its sandboxing',
      'can escape its sandboxing',
      
      // Preload warnings
      'was preloaded using link preload but not used',
      'preloaded using link preload but not used',
      'facebook.com/tr',
      'preloaded intentionally',
      'please make sure it has an appropriate',
      
      // Form validation and accessibility warnings
      'form validation found',
      'accessibility issues',
      'missing id attribute',
      'missing name attribute',
      'missing label or aria-label',
      
      // Google Fonts performance warnings
      'google fonts link missing display=swap',
      'deprecated api usage detected',
      
      // Additional common non-critical errors
      'resizeobserver loop limit exceeded',
      'non-passive event listener',
      'failed to load resource',
      'lovable-tagger',
      'componenttagger',
      'about:blank',
    ];

    // Check if message contains any of the filtered patterns
    return filteredPatterns.some(pattern => messageStr.includes(pattern));
  }

  static isImportantMessage(message: string): boolean {
    const importantKeywords = [
      'authentication',
      'security',
      'critical',
      'fatal',
      'initialization',
      'migration',
      'deployment',
      'stylus event detected', // Allow stylus-specific logs
      'new pointer type discovered', // Allow pointer type discovery
    ];

    return importantKeywords.some(keyword =>
      message.toLowerCase().includes(keyword)
    );
  }

  static isSignificantError(message: string): boolean {
    // Don't report the filtered errors as significant
    if (this.isFilteredError(message)) {
      return false;
    }

    const significantErrors = [
      'TypeError',
      'ReferenceError', 
      'SyntaxError',
      'RangeError',
      'Failed to fetch',
      'Network error',
      'Authentication failed',
      'Permission denied',
      'Database error',
    ];

    return significantErrors.some(error =>
      message.includes(error)
    );
  }
}
