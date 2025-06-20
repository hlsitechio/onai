
/**
 * Maximum console suppression - completely silent except for welcome message
 */
export class MaximumConsoleSuppressionManager {
  private originalConsole: Partial<Console> = {};
  private welcomeShown = false;

  constructor() {
    this.storeOriginalMethods();
    this.setupCompleteSuppressionImmediately();
  }

  private storeOriginalMethods() {
    this.originalConsole = {
      log: console.log.bind(console),
      warn: console.warn.bind(console),
      error: console.error.bind(console),
      debug: console.debug.bind(console),
      info: console.info.bind(console),
      trace: console.trace.bind(console),
      group: console.group.bind(console),
      groupCollapsed: console.groupCollapsed.bind(console),
      groupEnd: console.groupEnd.bind(console),
      time: console.time.bind(console),
      timeEnd: console.timeEnd.bind(console),
      timeLog: console.timeLog.bind(console),
      count: console.count.bind(console),
      countReset: console.countReset.bind(console),
      table: console.table.bind(console),
      dir: console.dir.bind(console),
      dirxml: console.dirxml.bind(console),
      assert: console.assert.bind(console),
      clear: console.clear.bind(console),
    };
  }

  private setupCompleteSuppressionImmediately() {
    // Clear console first
    console.clear();

    // Completely suppress ALL console methods
    console.log = (...args) => {
      const message = args.join(' ');
      // Only allow our specific welcome message
      if (message.includes('🎉 Welcome to OnlineNote AI! 🎉') && !this.welcomeShown) {
        this.welcomeShown = true;
        this.originalConsole.log?.(...args);
      }
    };

    console.warn = () => {}; // Completely silent
    console.error = () => {}; // Completely silent - redirect to Sentry only
    console.debug = () => {}; // Completely silent
    console.info = (...args) => {
      const message = args.join(' ');
      // Only allow our specific welcome message
      if (message.includes('🎉 Welcome to OnlineNote AI! 🎉') && !this.welcomeShown) {
        this.welcomeShown = true;
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

    // Override window.onerror to suppress error reporting to console
    window.onerror = () => true; // Suppress all window errors from console
    window.addEventListener('unhandledrejection', (e) => {
      e.preventDefault(); // Suppress unhandled promise rejections from console
    });
  }

  showWelcomeMessage() {
    if (!this.welcomeShown) {
      console.clear();
      setTimeout(() => {
        console.log('%c🎉 Welcome to OnlineNote AI! 🎉', 'color: #4CAF50; font-size: 18px; font-weight: bold; text-shadow: 1px 1px 2px rgba(0,0,0,0.3);');
        this.welcomeShown = true;
      }, 100);
    }
  }

  restoreConsole() {
    Object.assign(console, this.originalConsole);
    console.log('🔊 Console restored - all messages will now show');
  }

  getSuppressionStats() {
    return {
      isMaximallySuppressed: true,
      welcomeShown: this.welcomeShown,
    };
  }
}
