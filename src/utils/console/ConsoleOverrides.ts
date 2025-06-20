
import { sanitizeConsoleArgs } from '../errorSanitization';
import { reportError } from '../errorReporter';
import { ErrorFiltering } from './ErrorFiltering';
import { ErrorAggregation } from './ErrorAggregation';

/**
 * Maximum console suppression - redirect everything to Sentry
 */
export class ConsoleOverrides {
  private errorAggregation = new ErrorAggregation();
  private originalConsole: Partial<Console>;
  private suppressedCount = 0;
  private welcomeShown = false;

  constructor(originalConsole: Partial<Console>) {
    this.originalConsole = originalConsole;
  }

  setupErrorAggregation() {
    const originalError = console.error;
    const originalWarn = console.warn;
    const originalLog = console.log;
    const originalInfo = console.info;
    const originalDebug = console.debug;

    // Completely suppress console.error and redirect to Sentry
    console.error = (...args) => {
      this.trackSuppressed();
      const message = args.join(' ');
      
      // Always redirect to Sentry unless it's filtered noise
      if (!ErrorFiltering.isFilteredError(message)) {
        const error = new Error(message);
        reportError(error, {
          component: 'console',
          severity: ErrorFiltering.getErrorSeverity(message),
          tags: { error_type: 'console_error' },
        });
      }
    };

    // Completely suppress console.warn and redirect to Sentry
    console.warn = (...args) => {
      this.trackSuppressed();
      const message = args.join(' ');
      
      // Redirect warnings to Sentry unless filtered
      if (!ErrorFiltering.isFilteredError(message) && ErrorFiltering.isSignificantError(message)) {
        const error = new Error(`Warning: ${message}`);
        reportError(error, {
          component: 'console',
          severity: 'medium',
          tags: { error_type: 'console_warning' },
        });
      }
    };

    // Completely suppress console.log
    console.log = (...args) => {
      // Only allow our welcome message
      const message = args.join(' ');
      if (message.includes('Welcome to OnlineNote AI') && !this.welcomeShown) {
        this.welcomeShown = true;
        originalLog(...args);
        return;
      }
      this.trackSuppressed();
    };

    // Completely suppress console.info
    console.info = (...args) => {
      // Only allow our welcome message and critical system info
      const message = args.join(' ');
      if (message.includes('Welcome to OnlineNote AI') || 
          message.includes('Console controls available') ||
          message.includes('Sentry initialized')) {
        originalInfo(...args);
        return;
      }
      this.trackSuppressed();
    };

    // Completely suppress console.debug
    console.debug = () => {
      this.trackSuppressed();
    };

    // Override console.trace, console.group, etc.
    console.trace = () => { this.trackSuppressed(); };
    console.group = () => { this.trackSuppressed(); };
    console.groupCollapsed = () => { this.trackSuppressed(); };
    console.groupEnd = () => { this.trackSuppressed(); };
    console.time = () => { this.trackSuppressed(); };
    console.timeEnd = () => { this.trackSuppressed(); };
    console.timeLog = () => { this.trackSuppressed(); };
    console.count = () => { this.trackSuppressed(); };
    console.countReset = () => { this.trackSuppressed(); };
    console.table = () => { this.trackSuppressed(); };
    console.dir = () => { this.trackSuppressed(); };
    console.dirxml = () => { this.trackSuppressed(); };
    console.assert = () => { this.trackSuppressed(); };
  }

  private trackSuppressed() {
    this.suppressedCount++;
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
