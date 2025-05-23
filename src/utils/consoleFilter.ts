
// Console filter to hide tracking and ad-blocking related messages
// This helps keep the development console clean while preserving important logs

interface ConsoleMethods {
  log: typeof console.log;
  warn: typeof console.warn;
  error: typeof console.error;
}

// Store original console methods
const originalConsole: ConsoleMethods = {
  log: console.log,
  warn: console.warn,
  error: console.error
};

// Patterns to filter out (tracking, ads, analytics)
const filterPatterns = [
  'Tracking Prevention blocked',
  'ERR_BLOCKED_BY_CLIENT',
  'facebook.net',
  'analytics.tiktok.com',
  'google-analytics.com',
  'googlesyndication.com',
  'googleadservices.com',
  'doubleclick.net',
  'ttq.load',
  'adsbygoogle',
  'gtag',
  'fbevents',
  'was preloaded using link preload but not used',
  'The resource https://www.facebook.com',
  'pagead/viewthroughconversion',
  'We\'re hiring! https://lovable.dev/careers', // ASCII art + hiring message
  'Unrecognized feature: \'vr\'',
  'Unrecognized feature: \'battery\'',
  'Tracking Prevention blocked a Script resource',
  'Tracking Prevention blocked an Image resource',
  'Tracking Prevention blocked an IFrame resource',
  'Tracking Prevention blocked an XHR request',
  'Tracking Prevention blocked access to storage',
  'Images loaded lazily and replaced with placeholders',
  'go.microsoft.com/fwlink/?linkid=2048113',
  'AdSense: window.adsbygoogle is not defined',
  'The resource <URL> was preloaded using link preload',
  'pagead2.googlesyndication.com',
  'connect.facebook.net',
  'form_start',
  'form_submit',
  'scroll',
  'page_view'
];

// Check if a message should be filtered
const shouldFilter = (message: string): boolean => {
  return filterPatterns.some(pattern => 
    message.toLowerCase().includes(pattern.toLowerCase())
  );
};

// Create filtered console methods
const createFilteredMethod = (originalMethod: Function) => {
  return (...args: any[]) => {
    const message = args.join(' ');
    if (!shouldFilter(message)) {
      originalMethod.apply(console, args);
    }
  };
};

// Apply console filtering
export const enableConsoleFiltering = () => {
  console.log = createFilteredMethod(originalConsole.log);
  console.warn = createFilteredMethod(originalConsole.warn);
  console.error = createFilteredMethod(originalConsole.error);
  
  console.log('Console filtering enabled - tracking messages will be hidden');
};

// Restore original console methods
export const disableConsoleFiltering = () => {
  console.log = originalConsole.log;
  console.warn = originalConsole.warn;
  console.error = originalConsole.error;
  
  console.log('Console filtering disabled - all messages will be shown');
};

// Auto-enable in development mode
if (import.meta.env.DEV) {
  enableConsoleFiltering();
}
