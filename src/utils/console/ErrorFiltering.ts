
/**
 * Maximum error filtering - block everything except critical errors
 */
export class ErrorFiltering {
  /**
   * Comprehensive filtering - block almost everything
   */
  static isFilteredError(message: string): boolean {
    const messageStr = message.toLowerCase();
    
    // Only allow critical system errors through
    const criticalOnlyPatterns = [
      'uncaught',
      'unhandled',
      'fatal',
      'crash',
      'segmentation fault',
      'out of memory',
      'stack overflow',
    ];

    const isCritical = criticalOnlyPatterns.some(pattern => 
      messageStr.includes(pattern)
    );

    // If it's not critical, filter it out
    return !isCritical;
  }

  /**
   * Only the most critical errors
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
    ];

    return criticalPatterns.some(pattern => 
      message.toLowerCase().includes(pattern)
    );
  }

  static isImportantMessage(message: string): boolean {
    // Only allow our welcome message and critical system messages
    return message.includes('Welcome to OnlineNote AI') ||
           message.includes('Console controls available') ||
           message.includes('Sentry initialized');
  }

  static isSignificantError(message: string): boolean {
    // Only report truly significant errors to Sentry
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
    return 'low';
  }
}
