
import * as Sentry from '@sentry/react';

export const initializeSentry = () => {
  const sentryDsn = "https://f8ae6101cc7c15b766842bf72cefd257@o4509521908400128.ingest.us.sentry.io/4509521909252096";
  
  // Only initialize Sentry in production or when explicitly enabled
  if (sentryDsn && (import.meta.env.PROD || import.meta.env.VITE_ENABLE_SENTRY === 'true')) {
    Sentry.init({
      dsn: sentryDsn,
      integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration(),
        Sentry.captureConsoleIntegration({
          levels: ['log', 'info', 'warn', 'error', 'debug'] // capture all levels
        })
      ],
      
      tracesSampleRate: import.meta.env.DEV ? 0.1 : 0.05,
      replaysSessionSampleRate: 0.0,
      replaysOnErrorSampleRate: 1.0,
      
      debug: false,
      
      // Enable structured log capture
      _experiments: {
        enableLogs: true
      },
      
      beforeSend(event: Sentry.ErrorEvent): Sentry.ErrorEvent | null {
        const errorMessage = event.message || event.exception?.values?.[0]?.value || '';
        
        // Filter out noise
        const ignoredPatterns = [
          'message port closed',
          'extension context invalidated',
          'loading chunk',
          'resizeobserver loop limit exceeded'
        ];
        
        if (ignoredPatterns.some(pattern => errorMessage.toLowerCase().includes(pattern))) {
          return null;
        }
        
        return event;
      },
      
      environment: import.meta.env.MODE,
      release: import.meta.env.VITE_APP_VERSION || 'unknown'
    });

    console.log('✅ Sentry initialized with console capture enabled');
  }
};

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
  }
};

// Test function to validate Sentry captures (for development testing)
export const testSentryCapture = () => {
  if (import.meta.env.DEV) {
    console.log('✅ Test log - should be visible only in Sentry');
    console.warn('⚠️ Test warning - captured by Sentry');
    console.error('❌ Test error - should be tracked in Sentry');
    
    Sentry.addBreadcrumb({
      category: 'test',
      message: 'Sentry test breadcrumb',
      level: 'info',
    });
    
    Sentry.captureMessage('Manual Sentry test message', 'info');
    
    console.log('🔍 Check your Sentry dashboard for these test messages');
  }
};
