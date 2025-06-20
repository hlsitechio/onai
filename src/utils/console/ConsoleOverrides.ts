
import { sanitizeConsoleArgs } from '../errorSanitization';
import { reportError } from '../errorReporter';
import { ErrorFiltering } from './ErrorFiltering';
import { ErrorAggregation } from './ErrorAggregation';

/**
 * Enhanced console method overrides with aggressive filtering
 */
export class ConsoleOverrides {
  private errorAggregation = new ErrorAggregation();
  private originalConsole: Partial<Console>;
  private suppressedCount = 0;
  private lastSuppressedReport = 0;

  constructor(originalConsole: Partial<Console>) {
    this.originalConsole = originalConsole;
  }

  setupErrorAggregation() {
    const originalError = console.error;
    const originalWarn = console.warn;
    const originalLog = console.log;
    const originalInfo = console.info;

    console.error = (...args) => {
      const message = args.join(' ');
      
      // Aggressive filtering - block most noise
      if (ErrorFiltering.isFilteredError(message)) {
        this.trackSuppressed();
        return;
      }

      // Only log critical and significant errors
      if (!ErrorFiltering.isCriticalError(message) && !ErrorFiltering.isSignificantError(message)) {
        this.trackSuppressed();
        return;
      }

      const sanitizedArgs = sanitizeConsoleArgs(args);
      const { shouldLog, count } = this.errorAggregation.shouldLogError(message, 2); // Reduced threshold

      if (shouldLog) {
        originalError(...sanitizedArgs);
        
        // Report to Sentry for significant errors
        if (ErrorFiltering.isSignificantError(message)) {
          const error = new Error(message);
          reportError(error, {
            component: 'console',
            severity: ErrorFiltering.getErrorSeverity(message),
            tags: { error_type: 'console_error', count: count.toString() },
          });
        }
      } else if (count === 3) {
        originalError(`${message} (suppressed after ${count} occurrences)`);
      }
    };

    console.warn = (...args) => {
      const message = args.join(' ');
      
      // Block most warnings in development
      if (ErrorFiltering.isFilteredError(message)) {
        this.trackSuppressed();
        return;
      }

      // Only show important warnings
      if (!ErrorFiltering.isImportantMessage(message)) {
        this.trackSuppressed();
        return;
      }

      const sanitizedArgs = sanitizeConsoleArgs(args);
      const { shouldLog, count } = this.errorAggregation.shouldLogWarning(message, 3);

      if (shouldLog) {
        originalWarn(...sanitizedArgs);
      } else if (count === 4) {
        originalWarn(`${message} (suppressed after ${count} occurrences)`);
      }
    };

    // Suppress most console.log in production, filter in development
    console.log = (...args) => {
      if (import.meta.env.PROD) {
        return; // No logs in production unless critical
      }

      const message = args.join(' ');
      
      // Filter noisy logs even in development
      if (ErrorFiltering.isFilteredError(message)) {
        return;
      }

      // Allow important logs through
      if (ErrorFiltering.isImportantMessage(message) || message.includes('✅') || message.includes('🚨')) {
        originalLog(...args);
      }
    };

    // Filter console.info similarly
    console.info = (...args) => {
      const message = args.join(' ');
      
      if (ErrorFiltering.isFilteredError(message)) {
        return;
      }

      if (ErrorFiltering.isImportantMessage(message)) {
        originalInfo(...args);
      }
    };

    // Report suppression stats periodically
    this.startSuppressionReporting();
  }

  private trackSuppressed() {
    this.suppressedCount++;
  }

  private startSuppressionReporting() {
    setInterval(() => {
      const now = Date.now();
      if (this.suppressedCount > 0 && now - this.lastSuppressedReport > 30000) { // Every 30 seconds
        console.info(`🔇 Suppressed ${this.suppressedCount} console messages to reduce noise`);
        this.suppressedCount = 0;
        this.lastSuppressedReport = now;
      }
    }, 30000);
  }

  getErrorStats() {
    return {
      ...this.errorAggregation.getErrorStats(),
      suppressedCount: this.suppressedCount,
    };
  }

  resetErrorCounts() {
    this.errorAggregation.resetErrorCounts();
    this.suppressedCount = 0;
  }
}
