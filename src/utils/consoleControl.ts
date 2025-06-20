
// Minimal console control - completely silent except for welcome message
const isDevelopment = import.meta.env.DEV;
const isProduction = import.meta.env.PROD;

// Store original console methods
const originalConsole = {
  log: console.log.bind(console),
  warn: console.warn.bind(console),
  error: console.error.bind(console),
  debug: console.debug.bind(console),
  info: console.info.bind(console),
};

// Completely suppress all console output
console.log = () => {};
console.warn = () => {};
console.error = () => {};
console.debug = () => {};
console.info = () => {};

// Create a controlled logger that stays silent but accepts arguments
export const logger = {
  debug: (...args: any[]) => {},
  info: (...args: any[]) => {},
  warn: (...args: any[]) => {},
  error: (...args: any[]) => {},
  log: (...args: any[]) => {}
};

// Runtime console control for development - completely silent by default
export const consoleControls = {
  enableAll: () => {
    Object.assign(console, originalConsole);
    console.log('All console logging enabled');
  },
  
  enableErrorsOnly: () => {
    console.log = () => {};
    console.warn = () => {};
    console.debug = () => {};
    console.info = () => {};
    console.error = originalConsole.error;
    console.log('Only errors will be logged');
  },
  
  enableWarningsAndErrors: () => {
    console.log = () => {};
    console.debug = () => {};
    console.info = () => {};
    console.warn = originalConsole.warn;
    console.error = originalConsole.error;
    console.log('Warnings and errors will be logged');
  },
  
  disable: () => {
    console.log = () => {};
    console.warn = () => {};
    console.error = () => {};
    console.debug = () => {};
    console.info = () => {};
  }
};

// Don't expose controls globally - keep console clean
