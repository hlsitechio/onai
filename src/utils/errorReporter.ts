import { reportError as sentryReportError } from './sentryConfig';
import { sanitizeError, sanitizeErrorMessage } from './errorSanitization';
import { logSecurityIncident } from './securityMonitoring';

interface ErrorContext {
  component?: string;
  action?: string;
  userId?: string;
  sessionId?: string;
  url?: string;
  userAgent?: string;
  timestamp?: number;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  tags?: Record<string, string>;
}

/**
 * Centralized error reporting with sanitization and context
 */
export class ErrorReporter {
  private static instance: ErrorReporter;
  private errorQueue: Array<{ error: Error; context?: ErrorContext }> = [];
  private isProcessing = false;

  static getInstance(): ErrorReporter {
    if (!ErrorReporter.instance) {
      ErrorReporter.instance = new ErrorReporter();
    }
    return ErrorReporter.instance;
  }

  /**
   * Report an error with context
   */
  async reportError(error: Error, context?: ErrorContext): Promise<void> {
    try {
      // Sanitize the error first
      const sanitizedError = sanitizeError(error);
      
      // Add to queue for batch processing
      this.errorQueue.push({ error: sanitizedError, context });
      
      // Process queue if not already processing
      if (!this.isProcessing) {
        await this.processErrorQueue();
      }
      
      // Log security incidents for critical errors
      if (context?.severity === 'critical') {
        await logSecurityIncident(
          'critical_error',
          'critical',
          {
            error_message: sanitizeErrorMessage(error.message),
            component: context.component,
            action: context.action,
          }
        );
      }
    } catch (reportingError) {
      // Fallback logging if error reporting fails
      console.error('Failed to report error:', reportingError);
      console.error('Original error:', error);
    }
  }

  /**
   * Process queued errors in batches
   */
  private async processErrorQueue(): Promise<void> {
    if (this.isProcessing || this.errorQueue.length === 0) {
      return;
    }

    this.isProcessing = true;

    try {
      const batch = this.errorQueue.splice(0, 5); // Process up to 5 errors at once
      
      for (const { error, context } of batch) {
        await this.sendError(error, context);
        
        // Small delay between reports to avoid overwhelming services
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    } catch (error) {
      console.error('Error processing error queue:', error);
    } finally {
      this.isProcessing = false;
      
      // Process remaining errors if any
      if (this.errorQueue.length > 0) {
        setTimeout(() => this.processErrorQueue(), 1000);
      }
    }
  }

  /**
   * Send individual error to monitoring services
   */
  private async sendError(error: Error, context?: ErrorContext): Promise<void> {
    // Add default context
    const enrichedContext = {
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      ...context,
    };

    // Report to Sentry (if configured) - using renamed import
    sentryReportError(error, enrichedContext);

    // Log to console in development
    if (import.meta.env.DEV) {
      console.group(`🚨 Error Report - ${context?.severity || 'medium'}`);
      console.error('Error:', error);
      console.log('Context:', enrichedContext);
      console.groupEnd();
    }

    // Store critical errors locally for debugging
    if (context?.severity === 'critical') {
      this.storeCriticalError(error, enrichedContext);
    }
  }

  /**
   * Store critical errors locally for debugging
   */
  private storeCriticalError(error: Error, context: ErrorContext): void {
    try {
      const criticalErrors = JSON.parse(
        localStorage.getItem('critical-errors') || '[]'
      );

      criticalErrors.push({
        error: {
          message: error.message,
          name: error.name,
          stack: error.stack,
        },
        context,
        timestamp: Date.now(),
      });

      // Keep only last 10 critical errors
      if (criticalErrors.length > 10) {
        criticalErrors.splice(0, criticalErrors.length - 10);
      }

      localStorage.setItem('critical-errors', JSON.stringify(criticalErrors));
    } catch (storageError) {
      console.error('Failed to store critical error:', storageError);
    }
  }

  /**
   * Get stored critical errors for debugging
   */
  getCriticalErrors(): any[] {
    try {
      return JSON.parse(localStorage.getItem('critical-errors') || '[]');
    } catch {
      return [];
    }
  }

  /**
   * Clear stored critical errors
   */
  clearCriticalErrors(): void {
    localStorage.removeItem('critical-errors');
  }
}

// Convenience functions
export const reportError = (error: Error, context?: ErrorContext) => {
  ErrorReporter.getInstance().reportError(error, context);
};

export const reportCriticalError = (error: Error, context?: Omit<ErrorContext, 'severity'>) => {
  ErrorReporter.getInstance().reportError(error, { ...context, severity: 'critical' });
};

export const getCriticalErrors = () => {
  return ErrorReporter.getInstance().getCriticalErrors();
};
