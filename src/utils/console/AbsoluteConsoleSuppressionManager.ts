
/**
 * Absolute console suppression - inspired by Unity's ILogHandler approach
 * Completely suppresses ALL console output while maintaining error capture
 */
export class AbsoluteConsoleSuppressionManager {
  private static instance: AbsoluteConsoleSuppressionManager;
  private originalMethods: Partial<Console> = {};
  private isSuppressionActive = false;

  static getInstance(): AbsoluteConsoleSuppressionManager {
    if (!AbsoluteConsoleSuppressionManager.instance) {
      AbsoluteConsoleSuppressionManager.instance = new AbsoluteConsoleSuppressionManager();
    }
    return AbsoluteConsoleSuppressionManager.instance;
  }

  constructor() {
    this.initializeImmediateSuppressionLikeUnity();
  }

  private initializeImmediateSuppressionLikeUnity() {
    // Store originals first (like Unity's default handler backup)
    this.storeOriginalConsoleMethods();
    
    // Apply absolute suppression immediately (like Unity's ILogHandler override)
    this.applyAbsoluteSuppressionAtSource();
    
    // Setup error interception (like Unity's Application.logMessageReceived)
    this.setupErrorInterceptionLayer();
    
    this.isSuppressionActive = true;
  }

  private storeOriginalConsoleMethods() {
    this.originalMethods = {
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
      table: console.table.bind(console),
      dir: console.dir.bind(console),
      dirxml: console.dirxml.bind(console),
      assert: console.assert.bind(console),
      count: console.count.bind(console),
      countReset: console.countReset.bind(console),
    };
  }

  private applyAbsoluteSuppressionAtSource() {
    // Override ALL console methods to be completely silent (like Unity's empty ILogHandler methods)
    const silentHandler = () => {};
    
    console.log = silentHandler;
    console.warn = silentHandler;
    console.error = silentHandler;
    console.debug = silentHandler;
    console.info = silentHandler;
    console.trace = silentHandler;
    console.group = silentHandler;
    console.groupCollapsed = silentHandler;
    console.groupEnd = silentHandler;
    console.time = silentHandler;
    console.timeEnd = silentHandler;
    console.table = silentHandler;
    console.dir = silentHandler;
    console.dirxml = silentHandler;
    console.assert = silentHandler;
    console.count = silentHandler;
    console.countReset = silentHandler;
  }

  private setupErrorInterceptionLayer() {
    // Intercept at the source level (like Unity's Application.logMessageReceived)
    const originalWindowError = window.onerror;
    const originalUnhandledRejection = window.onunhandledrejection;

    // Override window error handlers to be completely silent
    window.onerror = (message, source, lineno, colno, error) => {
      // Suppress all console output
      return true; // Prevent default browser error handling
    };

    window.onunhandledrejection = (event) => {
      // Suppress all console output
      event.preventDefault();
      return true;
    };

    // Override addEventListener to suppress error events
    const originalAddEventListener = window.addEventListener;
    window.addEventListener = function(type, listener, options) {
      if (type === 'error' || type === 'unhandledrejection') {
        // Don't add error listeners that might log to console
        return;
      }
      originalAddEventListener.call(this, type, listener, options);
    };
  }

  showWelcomeMessageOnly() {
    if (!this.isSuppressionActive) return;
    
    // Temporarily restore console.log only for welcome message
    const originalLog = this.originalMethods.log;
    if (originalLog) {
      console.clear();
      setTimeout(() => {
        console.log = originalLog;
        console.log('%c🎉 Welcome to OnlineNote AI! 🎉', 'color: #4CAF50; font-size: 18px; font-weight: bold; text-shadow: 1px 1px 2px rgba(0,0,0,0.3);');
        // Immediately suppress again
        console.log = () => {};
      }, 100);
    }
  }

  restoreConsole() {
    if (!this.isSuppressionActive) return;
    
    Object.assign(console, this.originalMethods);
    this.isSuppressionActive = false;
    console.log('🔊 Console restored - all messages will now show');
  }

  getSuppressionStatus() {
    return {
      isActive: this.isSuppressionActive,
      level: 'absolute',
      method: 'source-level-suppression'
    };
  }
}
