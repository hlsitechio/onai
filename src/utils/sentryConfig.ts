import * as Sentry from '@sentry/react';

// Enhanced Sentry configuration with complete console silence
export const initializeSentry = () => {
  const sentryDsn = "https://f8ae6101cc7c15b766842bf72cefd257@o4509521908400128.ingest.us.sentry.io/4509521909252096";
  
  if (sentryDsn && (import.meta.env.PROD || import.meta.env.VITE_ENABLE_SENTRY === 'true')) {
    Sentry.init({
      dsn: sentryDsn,
      integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration(),
      ],
      
      // Performance monitoring - reduced sampling to avoid noise
      tracesSampleRate: import.meta.env.DEV ? 0.1 : 0.05,
      
      // Session replay - only on errors
      replaysSessionSampleRate: 0.0, // No random sampling
      replaysOnErrorSampleRate: 1.0, // Always capture on error
      
      // Send default PII data as requested
      sendDefaultPii: true,
      
      // Disable all Sentry console output
      debug: false,
      
      // Aggressive error filtering to reduce noise
      beforeSend(event: Sentry.ErrorEvent, hint: Sentry.EventHint): Sentry.ErrorEvent | null {
        const error = hint.originalException;
        const errorMessage = typeof error === 'string' ? error : 
          (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string') ? 
          error.message : '';
        
        // Get comprehensive error text for filtering
        const fullErrorText = [
          errorMessage,
          event.message,
          event.exception?.values?.[0]?.value,
          event.exception?.values?.[0]?.type,
          event.tags?.error_message,
          event.fingerprint?.join(' '),
        ].filter(Boolean).join(' ').toLowerCase();
        
        // Comprehensive error patterns to ignore
        const ignoredErrorPatterns = [
          // Browser extension and message port errors
          'message port closed',
          'extension context invalidated',
          'extension_id',
          
          // CSP and worker violations
          'refused to create a worker',
          'worker from blob',
          'csp violation',
          'content security policy',
          'worker-src',
          'script-src',
          
          // React development errors (common noise)
          'minified react error',
          'element type is invalid',
          'react does not recognize',
          'validatedomnesting',
          'received `true` for a non-boolean attribute',
          
          // Resource loading failures (often external)
          'failed to load resource',
          'net::err_',
          'loading chunk',
          'chunkloaderror',
          
          // Browser feature warnings
          'unrecognized feature',
          'deprecated',
          'consider using',
          'vr',
          'ambient-light-sensor',
          'battery',
          'gyroscope',
          'magnetometer',
          
          // Performance and accessibility (non-critical)
          'resizeobserver loop limit exceeded',
          'non-passive event listener',
          'google fonts',
          'font-display',
          
          // Development tools
          'lovable-tagger',
          'componenttagger',
          'hmr',
          'hot module replacement',
          
          // Third-party noise
          'analytics',
          'tracking',
          'advertisement',
          'facebook.com/tr',
          
          // Console spam
          'pointer event detected',
          'stylus event',
          'dev server',
        ];
        
        // Filter out noise aggressively
        if (ignoredErrorPatterns.some(pattern => fullErrorText.includes(pattern))) {
          return null; // Don't send to Sentry
        }
        
        // Only send errors that are likely to be actionable
        const actionablePatterns = [
          'typeerror',
          'referenceerror',
          'syntaxerror',
          'rangeerror',
          'uncaught',
          'unhandled',
          'network error',
          'failed to fetch',
          'authentication',
          'permission denied',
          'database error',
          'api error',
        ];

        const isActionable = actionablePatterns.some(pattern => 
          fullErrorText.includes(pattern)
        );

        if (!isActionable) {
          return null; // Don't send non-actionable errors
        }
        
        // Sanitize the event before sending
        return sanitizeErrorEvent(event);
      },
      
      // Enhanced breadcrumb filtering
      beforeBreadcrumb(breadcrumb: Sentry.Breadcrumb): Sentry.Breadcrumb | null {
        // Filter out noisy breadcrumbs
        if (breadcrumb.category === 'console' && breadcrumb.level === 'log') {
          return null;
        }
        
        if (breadcrumb.message) {
          const messageText = breadcrumb.message.toLowerCase();
          const noisyBreadcrumbs = [
            'pointer event',
            'stylus event',
            'resize observer',
            'message port',
            'worker from blob',
            'csp violation',
            'analytics',
            'tracking',
          ];
          
          if (noisyBreadcrumbs.some(pattern => messageText.includes(pattern))) {
            return null;
          }
        }
        
        return breadcrumb;
      },
      
      // Environment and release info
      environment: import.meta.env.MODE,
      release: import.meta.env.VITE_APP_VERSION || 'unknown',
      
      // Set maximum breadcrumbs to reduce noise
      maxBreadcrumbs: 10,
    });

    // Don't log Sentry initialization to console
  } else if (import.meta.env.DEV) {
    // Don't log anything about Sentry being disabled
  }
};

// Enhanced error event sanitization
const sanitizeErrorEvent = (event: Sentry.ErrorEvent): Sentry.ErrorEvent => {
  // Remove sensitive browser information
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
  
  // Remove noisy tags
  if (event.tags) {
    delete event.tags.user_id;
    delete event.tags.session_id;
  }
  
  // Clean up stack traces
  if (event.exception?.values) {
    event.exception.values.forEach(exception => {
      if (exception.stacktrace?.frames) {
        exception.stacktrace.frames = exception.stacktrace.frames
          .filter(frame => {
            // Remove noisy stack frames
            const filename = frame.filename || '';
            return !filename.includes('node_modules') && 
                   !filename.includes('webpack') &&
                   !filename.includes('vite') &&
                   !filename.includes('extension');
          })
          .slice(-10); // Keep only last 10 frames
      }
    });
  }
  
  return event;
};

// Enhanced error reporting with filtering - completely silent
export const reportError = (error: Error, context?: Record<string, any>) => {
  // Don't report filtered errors
  const message = error.message || '';
  const ignoredPatterns = [
    'message port closed',
    'worker from blob',
    'csp violation',
    'loading chunk',
    'pointer event',
  ];

  if (ignoredPatterns.some(pattern => message.toLowerCase().includes(pattern))) {
    return; // Skip reporting
  }

  if (import.meta.env.PROD || import.meta.env.VITE_ENABLE_SENTRY === 'true') {
    Sentry.withScope(scope => {
      if (context) {
        // Only add meaningful context
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
  // Don't log anything to console - keep it completely silent
};

// Performance monitoring with filtering
export const startTransaction = (name: string, operation: string) => {
  if (import.meta.env.PROD || import.meta.env.VITE_ENABLE_SENTRY === 'true') {
    return Sentry.startSpan({ name, op: operation }, () => {});
  }
  return null;
};
