
import log from 'loglevel';

// Configure loglevel based on environment
const isDevelopment = import.meta.env.DEV;
const isProduction = import.meta.env.PROD;

// Set default log level based on environment
if (isProduction) {
  log.setLevel('warn'); // Only show warnings and errors in production
} else {
  log.setLevel('debug'); // Show all logs in development
}

// Create a controlled logger
export const logger = {
  debug: (...args: any[]) => {
    if (isDevelopment) {
      log.debug(...args);
    }
  },
  info: (...args: any[]) => {
    log.info(...args);
  },
  warn: (...args: any[]) => {
    log.warn(...args);
  },
  error: (...args: any[]) => {
    log.error(...args);
  },
  log: (...args: any[]) => {
    if (isDevelopment) {
      log.info(...args);
    }
  }
};

// Override console methods to reduce noise
const originalError = console.error;
const originalWarn = console.warn;

// Override console.log and console.debug to be silent in production
if (isProduction) {
  console.log = () => {};
  console.debug = () => {};
  console.info = () => {};
}

// Enhanced console.error filtering
console.error = (...args: any[]) => {
  const message = args.join(' ');
  
  // Filter out known non-critical errors and browser warnings
  const ignoredErrors = [
    'ResizeObserver loop limit exceeded',
    'Non-passive event listener',
    'Failed to load resource',
    'lovable-tagger',
    'componentTagger',
    'Unrecognized feature',
    'iframe which has both allow-scripts and allow-same-origin',
    'sandbox attribute can escape its sandboxing',
    'can escape its sandboxing',
    'vr',
    'ambient-light-sensor',
    'battery',
    'was preloaded using link preload but not used',
    'facebook.com/tr',
    'preloaded intentionally',
    'understand this warning',
    'understand this error',
    'about:blank',
  ];
  
  const shouldIgnore = ignoredErrors.some(ignored => 
    message.toLowerCase().includes(ignored.toLowerCase())
  );
  
  if (!shouldIgnore) {
    originalError(...args);
  }
};

// Enhanced console.warn filtering
console.warn = (...args: any[]) => {
  const message = args.join(' ');
  
  // Filter out known non-critical warnings and browser warnings
  const ignoredWarnings = [
    'React does not recognize',
    'Warning: Each child in a list should have a unique "key" prop',
    'lovable-tagger could not be loaded',
    'Unrecognized feature',
    'iframe which has both allow-scripts and allow-same-origin',
    'sandbox attribute can escape its sandboxing',
    'can escape its sandboxing',
    'vr',
    'ambient-light-sensor',
    'battery',
    'was preloaded using link preload but not used',
    'facebook.com/tr',
    'preloaded intentionally',
    'understand this warning',
    'understand this error',
    'about:blank',
    'Google Fonts link missing display=swap',
    'Deprecated API usage detected',
    'Form validation found',
    'accessibility issues',
    'Missing ID attribute',
    'Missing name attribute',
    'Missing label or aria-label',
  ];
  
  const shouldIgnore = ignoredWarnings.some(ignored => 
    message.toLowerCase().includes(ignored.toLowerCase())
  );
  
  if (!shouldIgnore) {
    originalWarn(...args);
  }
};

// Runtime console control for development
export const consoleControls = {
  enableAll: () => {
    log.setLevel('debug');
    console.log('All console logging enabled');
  },
  
  enableErrorsOnly: () => {
    log.setLevel('error');
    console.log('Only errors will be logged');
  },
  
  enableWarningsAndErrors: () => {
    log.setLevel('warn');
    console.log('Warnings and errors will be logged');
  },
  
  disable: () => {
    log.setLevel('silent');
    console.log('Console logging disabled');
  }
};

// Make controls available globally in development
if (isDevelopment && typeof window !== 'undefined') {
  (window as any).consoleControls = consoleControls;
  console.log('Console controls available at window.consoleControls');
}
