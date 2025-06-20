
import { reportError } from '../errorReporter';

/**
 * Separate error capture layer - inspired by Unity's Application.logMessageReceived
 * Captures all errors silently and sends them to Sentry without console noise
 */
export class SentryErrorCaptureLayer {
  private static instance: SentryErrorCaptureLayer;
  private captureActive = false;

  static getInstance(): SentryErrorCaptureLayer {
    if (!SentryErrorCaptureLayer.instance) {
      SentryErrorCaptureLayer.instance = new SentryErrorCaptureLayer();
    }
    return SentryErrorCaptureLayer.instance;
  }

  initializeSilentCapture() {
    if (this.captureActive) return;

    // Capture at the browser level (like Unity's Application.logMessageReceived)
    this.setupBrowserLevelErrorCapture();
    this.setupPromiseRejectionCapture();
    this.setupResourceErrorCapture();
    
    this.captureActive = true;
  }

  private setupBrowserLevelErrorCapture() {
    // Capture all JavaScript errors silently
    window.addEventListener('error', (event) => {
      this.processCapturedError(event.error || new Error(event.message), {
        type: 'javascript_error',
        source: event.filename,
        line: event.lineno,
        column: event.colno
      });
    }, true); // Use capture phase
  }

  private setupPromiseRejectionCapture() {
    // Capture unhandled promise rejections silently
    window.addEventListener('unhandledrejection', (event) => {
      const error = event.reason instanceof Error ? event.reason : new Error(String(event.reason));
      this.processCapturedError(error, {
        type: 'unhandled_promise_rejection'
      });
    }, true);
  }

  private setupResourceErrorCapture() {
    // Capture resource loading errors silently
    window.addEventListener('error', (event) => {
      if (event.target && event.target !== window) {
        const target = event.target as any;
        this.processCapturedError(new Error(`Resource loading failed: ${target.src || target.href}`), {
          type: 'resource_error',
          element: target.tagName,
          source: target.src || target.href
        });
      }
    }, true);
  }

  private processCapturedError(error: Error, context: Record<string, any>) {
    // Filter and process like Unity's log level filtering
    if (!this.shouldCaptureError(error)) {
      return;
    }

    // Send to Sentry silently (like Unity sending to external logging service)
    reportError(error, {
      component: 'browser_capture_layer',
      severity: this.determineSeverity(error, context),
      tags: { 
        capture_method: 'silent_layer',
        error_type: context.type || 'unknown'
      },
      ...context
    });
  }

  private shouldCaptureError(error: Error): boolean {
    const message = error.message?.toLowerCase() || '';
    
    // Filter out noise (like Unity's log filtering)
    const noisePatterns = [
      'script error',
      'non-error promise rejection',
      'loading chunk',
      'dynamically imported module',
      'extension context invalidated',
      'message port closed'
    ];

    return !noisePatterns.some(pattern => message.includes(pattern));
  }

  private determineSeverity(error: Error, context: Record<string, any>): 'low' | 'medium' | 'high' | 'critical' {
    const message = error.message?.toLowerCase() || '';
    
    if (message.includes('critical') || context.type === 'unhandled_promise_rejection') {
      return 'critical';
    }
    
    if (message.includes('network') || message.includes('failed to fetch')) {
      return 'high';
    }
    
    if (context.type === 'resource_error') {
      return 'medium';
    }
    
    return 'low';
  }

  getStatus() {
    return {
      active: this.captureActive,
      method: 'silent_browser_capture'
    };
  }
}
