
import * as Sentry from '@sentry/react';

// Sentry configuration for production error monitoring
export const initializeSentry = () => {
  // Only initialize Sentry in production or when DSN is provided
  const sentryDsn = "https://f8ae6101cc7c15b766842bf72cefd257@o4509521908400128.ingest.us.sentry.io/4509521909252096";
  
  if (sentryDsn && (import.meta.env.PROD || import.meta.env.VITE_ENABLE_SENTRY === 'true')) {
    Sentry.init({
      dsn: sentryDsn,
      integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration(),
      ],
      
      // Performance monitoring
      tracesSampleRate: import.meta.env.DEV ? 1.0 : 0.1,
      
      // Session replay
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
      
      // Send default PII data as requested
      sendDefaultPii: true,
      
      // Enhanced error filtering
      beforeSend(event: Sentry.ErrorEvent, hint: Sentry.EventHint): Sentry.ErrorEvent | null {
        const error = hint.originalException;
        const errorMessage = typeof error === 'string' ? error : 
          (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string') ? 
          error.message : '';
        
        // Get error message from various sources
        const fullErrorText = [
          errorMessage,
          event.message,
          event.exception?.values?.[0]?.value,
          event.exception?.values?.[0]?.type,
        ].filter(Boolean).join(' ').toLowerCase();
        
        const ignoredErrorPatterns = [
          // Message port errors (browser extensions)
          'the message port closed before a response was received',
          'message port closed before a response was received',
          'message port closed',
          'port closed',
          
          // CSP Worker violations (Sentry itself)
          'refused to create a worker from \'blob:',
          'refused to create a worker from "blob:',
          'refused to create a worker',
          'violates the following content security policy directive',
          'worker-src',
          'script-src',
          'csp worker-src',
          'worker from blob',
          
          // Minified React errors
          'minified react error #130',
          'react error #130',
          'element type is invalid',
          
          // Additional filtered errors
          'resizeobserver loop limit exceeded',
          'non-passive event listener',
          'failed to load resource',
          'lovable-tagger',
          'componenttagger',
          'unrecognized feature',
          'iframe which has both allow-scripts and allow-same-origin',
          'sandbox attribute can escape its sandboxing',
          'chunkloaderror',
          'loading chunk',
          'loading css chunk',
          'usecontext',
        ];
        
        // Filter out errors that match any of the ignored patterns
        if (ignoredErrorPatterns.some(pattern => 
          fullErrorText.includes(pattern)
        )) {
          return null; // Don't send to Sentry
        }
        
        // Sanitize sensitive data
        return sanitizeErrorEvent(event);
      },
      
      // Environment and release info
      environment: import.meta.env.MODE,
      release: import.meta.env.VITE_APP_VERSION || 'unknown',
      
      // Privacy settings with PII enabled as requested
      beforeBreadcrumb(breadcrumb: Sentry.Breadcrumb): Sentry.Breadcrumb | null {
        // Filter out sensitive breadcrumbs
        if (breadcrumb.category === 'console' && breadcrumb.level === 'log') {
          return null; // Don't log console.log as breadcrumbs
        }
        
        // Filter out breadcrumbs related to the errors we're ignoring
        if (breadcrumb.message) {
          const messageText = breadcrumb.message.toLowerCase();
          const filteredBreadcrumbs = [
            'message port closed',
            'worker from blob',
            'csp violation',
            'refused to create a worker',
          ];
          
          if (filteredBreadcrumbs.some(pattern => messageText.includes(pattern))) {
            return null;
          }
        }
        
        return breadcrumb;
      },
    });

    console.log('Sentry initialized for OneAI Notes with enhanced error filtering');
  } else if (import.meta.env.DEV) {
    console.log('Sentry disabled in development mode');
  }
};

// Sanitize error events to remove sensitive data
const sanitizeErrorEvent = (event: Sentry.ErrorEvent): Sentry.ErrorEvent => {
  // Remove sensitive data from error context
  if (event.contexts?.browser) {
    delete event.contexts.browser.name;
    delete event.contexts.browser.version;
  }
  
  // Sanitize user data
  if (event.user) {
    delete event.user.email;
    delete event.user.username;
    delete event.user.ip_address;
  }
  
  // Remove sensitive tags
  if (event.tags) {
    delete event.tags.user_id;
    delete event.tags.session_id;
  }
  
  // Sanitize exception data
  if (event.exception?.values) {
    event.exception.values.forEach(exception => {
      if (exception.stacktrace?.frames) {
        exception.stacktrace.frames.forEach(frame => {
          // Remove sensitive file paths
          if (frame.filename?.includes('node_modules')) {
            frame.filename = '[node_modules]';
          }
        });
      }
    });
  }
  
  return event;
};

// Manual error reporting with context
export const reportError = (error: Error, context?: Record<string, any>) => {
  if (import.meta.env.PROD || import.meta.env.VITE_ENABLE_SENTRY === 'true') {
    Sentry.withScope(scope => {
      if (context) {
        Object.keys(context).forEach(key => {
          scope.setTag(key, context[key]);
        });
      }
      Sentry.captureException(error);
    });
  } else {
    console.error('Error reported:', error, context);
  }
};

// Performance monitoring
export const startTransaction = (name: string, operation: string) => {
  if (import.meta.env.PROD || import.meta.env.VITE_ENABLE_SENTRY === 'true') {
    return Sentry.startSpan({ name, op: operation }, () => {});
  }
  return null;
};
