
/**
 * Enhanced error filtering utilities for console control
 */
export class ErrorFiltering {
  /**
   * Check if error should be filtered out (comprehensive filtering for dev console)
   */
  static isFilteredError(message: string): boolean {
    const messageStr = message.toLowerCase();
    
    // Comprehensive patterns for filtering common browser noise
    const filteredPatterns = [
      // Browser extension errors
      'the message port closed before a response was received',
      'message port closed before a response was received',
      'message port closed',
      'extension context invalidated',
      'extension_id',
      
      // CSP and Worker violations
      'refused to create a worker from \'blob:',
      'refused to create a worker from "blob:',
      'refused to create a worker',
      'violates the following content security policy directive',
      'worker-src',
      'script-src',
      'content security policy',
      'csp violation',
      
      // React development warnings (minified errors)
      'minified react error #130',
      'react error #130',
      'element type is invalid',
      'react does not recognize',
      'validatedomnesting',
      'received `true` for a non-boolean attribute',
      
      // Chrome DevTools and browser features
      'unrecognized feature',
      'understand this warning',
      'understand this error',
      "'vr'",
      "'ambient-light-sensor'",
      "'battery'",
      "'gyroscope'",
      "'magnetometer'",
      "'camera'",
      "'microphone'",
      "'geolocation'",
      'iframe which has both allow-scripts and allow-same-origin',
      'sandbox attribute can escape its sandboxing',
      'can escape its sandboxing',
      
      // Resource loading and preload warnings
      'was preloaded using link preload but not used',
      'preloaded using link preload but not used',
      'facebook.com/tr',
      'preloaded intentionally',
      'please make sure it has an appropriate',
      'failed to load resource',  
      'net::err_',
      'loading css chunk',
      'loading chunk',
      'chunkloaderror',
      
      // Performance and accessibility warnings
      'google fonts link missing display=swap',
      'deprecated api usage detected',
      'form validation found',
      'accessibility issues',
      'missing id attribute',
      'missing name attribute',
      'missing label or aria-label',
      'aria-',
      
      // Common browser API warnings
      'resizeobserver loop limit exceeded',
      'non-passive event listener',
      'about:blank',
      'blob:',
      
      // Development tools noise
      'lovable-tagger',
      'componenttagger',
      'pointer event detected',
      'stylus event',
      'dev server',
      'hot module replacement',
      'hmr',
      
      // Third-party service noise
      'google-analytics',
      'gtag',
      'analytics',
      'tracking',
      'advertisement',
      'ads',
      
      // Generic browser warnings
      'deprecation warning',
      'feature will be removed',
      'consider using',
      'should use',
      'recommendation',
      
      // Specific React Router warnings
      'react-router',
      'router',
      'navigation',
      
      // Tiptap editor warnings
      'tiptap',
      'prosemirror',
      'editor warning',
      
      // Font and styling warnings
      'font-display',
      'font-face',
      'css selector',
      'stylesheet',
      
      // Service worker and PWA warnings
      'service worker',
      'sw.js',
      'manifest.json',
      'pwa',
    ];

    // Check if message contains any of the filtered patterns
    return filteredPatterns.some(pattern => messageStr.includes(pattern));
  }

  /**
   * Check if this is a critical error that should always be shown
   */
  static isCriticalError(message: string): boolean {
    const criticalPatterns = [
      'uncaught',
      'unhandled',
      'fatal',
      'crash',
      'segmentation fault',
      'out of memory',
      'stack overflow',
      'authentication failed',
      'permission denied',
      'network error',
      'database error',
      'api error',
      'server error',
      '500',
      '404',
      '403',
      '401',
    ];

    return criticalPatterns.some(pattern => 
      message.toLowerCase().includes(pattern)
    );
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
      'user error',
      'business logic',
      'data corruption',
      'backup',
      'sync failed',
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

    // Always report critical errors
    if (this.isCriticalError(message)) {
      return true;
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
      'API error',
      'Uncaught',
      'Unhandled promise rejection',
    ];

    return significantErrors.some(error =>
      message.includes(error)
    );
  }

  /**
   * Get severity level for error reporting
   */
  static getErrorSeverity(message: string): 'low' | 'medium' | 'high' | 'critical' {
    if (this.isCriticalError(message)) return 'critical';
    if (this.isSignificantError(message)) return 'high';
    if (this.isImportantMessage(message)) return 'medium';
    return 'low';
  }
}
