
/**
 * Maximum console suppression for clean DevTools
 */
export class ProductionSuppression {
  private originalConsole: Partial<Console> = {};
  private isMaximumSuppressed = false;

  constructor() {
    this.storeOriginalMethods();
  }

  private storeOriginalMethods() {
    // Store original console methods
    this.originalConsole = {
      log: console.log,
      warn: console.warn,
      error: console.error,
      debug: console.debug,
      info: console.info,
      trace: console.trace,
      group: console.group,
      groupCollapsed: console.groupCollapsed,
      groupEnd: console.groupEnd,
      time: console.time,
      timeEnd: console.timeEnd,
      timeLog: console.timeLog,
      count: console.count,
      countReset: console.countReset,
      table: console.table,
      dir: console.dir,
      dirxml: console.dirxml,
      assert: console.assert,
      clear: console.clear,
    };
  }

  setupMaximumSuppression() {
    // Suppress ALL console output except our welcome message
    console.log = (...args) => {
      const message = args.join(' ');
      if (message.includes('Welcome to OnlineNote AI')) {
        this.originalConsole.log?.(...args);
      }
    };
    
    console.warn = () => {};
    console.error = () => {};
    console.debug = () => {};
    console.info = (...args) => {
      const message = args.join(' ');
      if (message.includes('Welcome to OnlineNote AI') || 
          message.includes('Console controls available') ||
          message.includes('Sentry initialized')) {
        this.originalConsole.info?.(...args);
      }
    };

    // Suppress all other console methods
    console.trace = () => {};
    console.group = () => {};
    console.groupCollapsed = () => {};
    console.groupEnd = () => {};
    console.time = () => {};
    console.timeEnd = () => {};
    console.timeLog = () => {};
    console.count = () => {};
    console.countReset = () => {};
    console.table = () => {};
    console.dir = () => {};
    console.dirxml = () => {};
    console.assert = () => {};

    this.isMaximumSuppressed = true;
  }

  restoreConsole() {
    Object.assign(console, this.originalConsole);
    this.isMaximumSuppressed = false;
    console.log('Console methods restored');
  }

  getOriginalConsole() {
    return this.originalConsole;
  }

  isSuppressionEnabled() {
    return this.isMaximumSuppressed;
  }
}
