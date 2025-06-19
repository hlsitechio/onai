
import { sanitizeConsoleArgs } from '../errorSanitization';
import { reportError } from '../errorReporter';
import { ErrorFiltering } from './ErrorFiltering';
import { ErrorAggregation } from './ErrorAggregation';

/**
 * Console method overrides with filtering and aggregation
 */
export class ConsoleOverrides {
  private errorAggregation = new ErrorAggregation();
  private originalConsole: Partial<Console>;

  constructor(originalConsole: Partial<Console>) {
    this.originalConsole = originalConsole;
  }

  setupErrorAggregation() {
    const originalError = console.error;
    const originalWarn = console.warn;

    console.error = (...args) => {
      const message = args.join(' ');
      
      // Filter out the specific errors - with exact matching
      if (ErrorFiltering.isFilteredError(message)) {
        return; // Silently ignore these errors
      }

      const sanitizedArgs = sanitizeConsoleArgs(args);

      // Count similar errors to prevent spam
      const { shouldLog, count } = this.errorAggregation.shouldLogError(message);

      // Only log first few occurrences of the same error
      if (shouldLog) {
        originalError(...sanitizedArgs);
      } else if (count === 4) {
        originalError(`${message} (suppressing further occurrences)`);
      }

      // Report significant errors
      if (ErrorFiltering.isSignificantError(message)) {
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
      if (ErrorFiltering.isFilteredError(message)) {
        return; // Silently ignore these warnings
      }

      const sanitizedArgs = sanitizeConsoleArgs(args);

      // Apply same aggregation logic to warnings
      const { shouldLog, count } = this.errorAggregation.shouldLogWarning(message);

      if (shouldLog) {
        originalWarn(...sanitizedArgs);
      } else if (count === 6) {
        originalWarn(`${message} (suppressing further occurrences)`);
      }
    };
  }

  getErrorStats() {
    return this.errorAggregation.getErrorStats();
  }

  resetErrorCounts() {
    this.errorAggregation.resetErrorCounts();
  }
}
