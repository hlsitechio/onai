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

// Override console methods in production to reduce noise
if (isProduction) {
  // Keep only essential console methods active
  const originalError = console.error;
  const originalWarn = console.warn;
  
  // Override console.log and console.debug to be silent in production
  console.log = () => {};
  console.debug = () => {};
  console.info = () => {};
  
  // Keep error and warn but filter out known non-critical messages
  console.error = (...args: any[]) => {
    const message = args.join(' ');
    
    // Filter out known non-critical errors
    const ignoredErrors = [
      'ResizeObserver loop limit exceeded',
      'Non-passive event listener',
      'Failed to load resource',
      'lovable-tagger',
      'componentTagger'
    ];
    
    const shouldIgnore = ignoredErrors.some(ignored => 
      message.toLowerCase().includes(ignored.toLowerCase())
    );
    
    if (!shouldIgnore) {
      originalError(...args);
    }
  };
  
  console.warn = (...args: any[]) => {
    const message = args.join(' ');
    
    // Filter out known non-critical warnings
    const ignoredWarnings = [
      'React does not recognize',
      'Warning: Each child in a list should have a unique "key" prop',
      'lovable-tagger could not be loaded'
    ];
    
    const shouldIgnore = ignoredWarnings.some(ignored => 
      message.toLowerCase().includes(ignored.toLowerCase())
    );
    
    if (!shouldIgnore) {
      originalWarn(...args);
    }
  };
}

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
