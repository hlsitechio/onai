
import * as Sentry from '@sentry/react';

// Clean Sentry configuration with official console integration
export const initializeSentry = () => {
  const sentryDsn = "https://f8ae6101cc7c15b766842bf72cefd257@o4509521908400128.ingest.us.sentry.io/4509521909252096";
  
  if (sentryDsn && (import.meta.env.PROD || import.meta.env.VITE_ENABLE_SENTRY === 'true')) {
    Sentry.init({
      dsn: sentryDsn,
      integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration(),
        // Official console integration - captures all console methods and sends to Sentry
        Sentry.captureConsoleIntegration({
          levels: ['log', 'info', 'warn', 'error', 'debug']
        })
      ],
      
      // Performance monitoring
      tracesSampleRate: import.meta.env.DEV ? 0.1 : 0.05,
      
      // Session replay
      replaysSessionSampleRate: 0.0,
      replaysOnErrorSampleRate: 1.0,
      
      // Enable structured logging (beta)
      _experiments: { 
        enableLogs: true 
      },
      
      // Send default PII data
      sendDefaultPii: true,
      
      // Disable Sentry's own debug logging
      debug: false,
      
      // Enhanced error filtering
      beforeSend(event: Sentry.ErrorEvent, hint: Sentry.EventHint): Sentry.ErrorEvent | null {
        const error = hint.originalException;
        const errorMessage = typeof error === 'string' ? error : 
          (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string') ? 
          error.message : '';
        
        const fullErrorText = [
          errorMessage,
          event.message,
          event.exception?.values?.[0]?.value,
          event.exception?.values?.[0]?.type,
        ].filter(Boolean).join(' ').toLowerCase();
        
        // Filter out noise
        const ignoredErrorPatterns = [
          'message port closed',
          'extension context invalidated',
          'worker from blob',
          'csp violation',
          'loading chunk',
          'resizeobserver loop limit exceeded',
          'non-passive event listener',
          'lovable-tagger',
        ];
        
        if (ignoredErrorPatterns.some(pattern => fullErrorText.includes(pattern))) {
          return null;
        }
        
        return event;
      },
      
      // Environment and release info
      environment: import.meta.env.MODE,
      release: import.meta.env.VITE_APP_VERSION || 'unknown',
      
      maxBreadcrumbs: 10,
    });
  }
};

// Simplified error reporting - Sentry handles console integration automatically
export const reportError = (error: Error, context?: Record<string, any>) => {
  if (import.meta.env.PROD || import.meta.env.VITE_ENABLE_SENTRY === 'true') {
    Sentry.withScope(scope => {
      if (context) {
        Object.keys(context).forEach(key => {
          if (context[key] && typeof context[key] === 'string' && context[key].length < 100) {
            scope.setTag(key, context[key]);
          }
        });
      }
      scope.setLevel(context?.severity || 'error');
      Sentry.captureException(error);
    });
  }
};

// Performance monitoring
export const startTransaction = (name: string, operation: string) => {
  if (import.meta.env.PROD || import.meta.env.VITE_ENABLE_SENTRY === 'true') {
    return Sentry.startSpan({ name, op: operation }, () => {});
  }
  return null;
};
