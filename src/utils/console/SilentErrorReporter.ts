import { reportError } from '../errorReporter';

/**
 * Silent error reporter - sends errors to Sentry without console noise
 */
export class SilentErrorReporter {
  private static instance: SilentErrorReporter;
  
  static getInstance(): SilentErrorReporter {
    if (!SilentErrorReporter.instance) {
      SilentErrorReporter.instance = new SilentErrorReporter();
    }
    return SilentErrorReporter.instance;
  }

  setupSilentErrorCapture() {
    // Capture and silence all errors while sending to Sentry
    const originalConsoleError = console.error;
    
    console.error = (...args) => {
      // Don't show in console, but send to Sentry
      const message = args.join(' ');
      if (this.shouldReportToSentry(message)) {
        const error = new Error(message);
        reportError(error, {
          component: 'console',
          severity: 'high',
          tags: { error_type: 'console_error' },
        });
      }
      // Don't call originalConsoleError - keep console silent
    };

    // Capture unhandled errors
    window.addEventListener('error', (event) => {
      if (this.shouldReportToSentry(event.message)) {
        reportError(event.error || new Error(event.message), {
          component: 'window',
          severity: 'critical',
          tags: { error_type: 'unhandled_error' },
        });
      }
      event.preventDefault(); // Prevent console logging
    });

    // Capture unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      const message = event.reason?.message || String(event.reason);
      if (this.shouldReportToSentry(message)) {
        const error = event.reason instanceof Error ? event.reason : new Error(message);
        reportError(error, {
          component: 'promise',
          severity: 'high',
          tags: { error_type: 'unhandled_rejection' },
        });
      }
      event.preventDefault(); // Prevent console logging
    });
  }

  private shouldReportToSentry(message: string): boolean {
    const messageStr = message.toLowerCase();
    
    // Filter out noise - only report actionable errors
    const noisePatterns = [
      'message port closed',
      'extension context invalidated',
      'worker from blob',
      'csp violation',
      'loading chunk',
      'pointer event',
      'stylus event',
      'resize observer',
      'non-passive event',
      'google fonts',
      'analytics',
      'tracking',
      'facebook.com/tr',
    ];

    if (noisePatterns.some(pattern => messageStr.includes(pattern))) {
      return false; // Don't report noise
    }

    // Only report significant errors
    const significantPatterns = [
      'typeerror',
      'referenceerror',
      'syntaxerror',
      'rangeerror',
      'uncaught',
      'unhandled',
      'failed to fetch',
      'network error',
      'authentication',
      'permission denied',
    ];

    return significantPatterns.some(pattern => messageStr.includes(pattern));
  }
}
