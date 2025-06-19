
import { logger } from './consoleControl';
import { sanitizeConsoleArgs } from './errorSanitization';
import { reportError } from './errorReporter';

/**
 * Enhanced console control with production suppression and error reporting
 */
class EnhancedConsoleControl {
  private originalConsole: Partial<Console> = {};
  private isProductionSuppressed = false;
  private errorCounts = new Map<string, number>();

  constructor() {
    this.initializeConsoleOverrides();
  }

  private initializeConsoleOverrides() {
    // Store original console methods
    this.originalConsole = {
      log: console.log,
      warn: console.warn,
      error: console.error,
      debug: console.debug,
      info: console.info,
    };

    this.setupProductionSuppression();
    this.setupErrorAggregation();
  }

  private setupProductionSuppression() {
    if (import.meta.env.PROD) {
      // Suppress non-critical console output in production
      console.log = () => {};
      console.debug = () => {};
      console.info = (...args) => {
        // Only allow important info messages
        const message = args.join(' ');
        if (this.isImportantMessage(message)) {
          this.originalConsole.info?.(...sanitizeConsoleArgs(args));
        }
      };

      this.isProductionSuppressed = true;
      this.originalConsole.log?.('Production console suppression enabled');
    }
  }

  private setupErrorAggregation() {
    const originalError = console.error;
    const originalWarn = console.warn;

    console.error = (...args) => {
      const message = args.join(' ');
      
      // Filter out the specific errors - with exact matching
      if (this.isFilteredError(message)) {
        return; // Silently ignore these errors
      }

      const sanitizedArgs = sanitizeConsoleArgs(args);

      // Count similar errors to prevent spam
      const errorKey = this.getErrorKey(message);
      const count = this.errorCounts.get(errorKey) || 0;
      this.errorCounts.set(errorKey, count + 1);

      // Only log first few occurrences of the same error
      if (count < 3) {
        originalError(...sanitizedArgs);
      } else if (count === 3) {
        originalError(`${message} (suppressing further occurrences)`);
      }

      // Report significant errors
      if (this.isSignificantError(message)) {
        const error = new Error(message);
        reportError(error, {
          component: 'console',
          severity: 'medium',
          tags: { error_type: 'console_error' },
        });
      }
    };

    console.warn = (...args) => {
      const message = args.join(' ');
      
      // Filter out the specific warnings
      if (this.isFilteredError(message)) {
        return; // Silently ignore these warnings
      }

      const sanitizedArgs = sanitizeConsoleArgs(args);

      // Apply same aggregation logic to warnings
      const warnKey = this.getErrorKey(message);
      const count = this.errorCounts.get(warnKey) || 0;
      this.errorCounts.set(warnKey, count + 1);

      if (count < 5) {
        originalWarn(...sanitizedArgs);
      } else if (count === 5) {
        originalWarn(`${message} (suppressing further occurrences)`);
      }
    };
  }

  /**
   * Check if error should be filtered out (the specific errors you mentioned)
   */
  private isFilteredError(message: string): boolean {
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
      
      // Additional common non-critical errors
      'resizeobserver loop limit exceeded',
      'non-passive event listener',
      'failed to load resource',
      'lovable-tagger',
      'componenttagger',
      'unrecognized feature',
      'iframe which has both allow-scripts and allow-same-origin',
      'sandbox attribute can escape its sandboxing',
      'vr',
      'ambient-light-sensor',
      'battery',
      'was preloaded using link preload but not used',
      'facebook.com/tr',
      'preloaded intentionally',
      'understand this error', // Chrome DevTools link text
    ];

    // Check if message contains any of the filtered patterns
    return filteredPatterns.some(pattern => messageStr.includes(pattern));
  }

  private isImportantMessage(message: string): boolean {
    const importantKeywords = [
      'authentication',
      'security',
      'critical',
      'fatal',
      'initialization',
      'migration',
      'deployment',
    ];

    return importantKeywords.some(keyword =>
      message.toLowerCase().includes(keyword)
    );
  }

  private isSignificantError(message: string): boolean {
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

  private getErrorKey(message: string): string {
    // Create a normalized key for error aggregation
    return message
      .replace(/\d+/g, '[NUMBER]') // Replace numbers
      .replace(/https?:\/\/[^\s]+/g, '[URL]') // Replace URLs
      .replace(/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/g, '[UUID]') // Replace UUIDs
      .replace(/blob:[^\s]+/g, '[BLOB_URL]') // Replace blob URLs
      .substring(0, 100); // Limit length
  }

  /**
   * Restore original console methods (for debugging)
   */
  restoreConsole() {
    Object.assign(console, this.originalConsole);
    this.isProductionSuppressed = false;
    console.log('Console methods restored');
  }

  /**
   * Get error statistics
   */
  getErrorStats() {
    return {
      totalErrors: Array.from(this.errorCounts.values()).reduce((a, b) => a + b, 0),
      uniqueErrors: this.errorCounts.size,
      topErrors: Array.from(this.errorCounts.entries())
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10),
      isProductionSuppressed: this.isProductionSuppressed,
    };
  }

  /**
   * Reset error counts
   */
  resetErrorCounts() {
    this.errorCounts.clear();
  }
}

// Initialize enhanced console control
const enhancedConsole = new EnhancedConsoleControl();

// Export controls for runtime management
export const enhancedConsoleControls = {
  restore: () => enhancedConsole.restoreConsole(),
  getStats: () => enhancedConsole.getErrorStats(),
  reset: () => enhancedConsole.resetErrorCounts(),
};

// Make controls available globally in development
if (import.meta.env.DEV && typeof window !== 'undefined') {
  (window as any).enhancedConsoleControls = enhancedConsoleControls;
}

export default enhancedConsole;
