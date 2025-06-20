
/**
 * Clean console manager using official Sentry integration approach
 * 1. Suppress all console output in browser
 * 2. Let Sentry's captureConsoleIntegration handle forwarding to Sentry
 */
export class CleanConsoleManager {
  private originalMethods: Record<string, Function> = {};
  private isSuppressionActive = false;

  constructor() {
    this.initializeCleanConsole();
  }

  private initializeCleanConsole() {
    // Store original methods for potential restoration
    (['log', 'info', 'warn', 'error', 'debug'] as const).forEach(level => {
      this.originalMethods[level] = console[level].bind(console);
    });

    // Suppress all console output immediately
    this.suppressConsoleOutput();
    
    // Show welcome message after brief delay
    setTimeout(() => {
      this.showWelcomeMessage();
    }, 200);

    this.isSuppressionActive = true;
  }

  private suppressConsoleOutput() {
    // Suppress all console methods - Sentry's integration captures before this suppression
    (['log', 'info', 'warn', 'error', 'debug'] as const).forEach(level => {
      (console as any)[level] = () => {};
    });
  }

  private showWelcomeMessage() {
    if (!this.isSuppressionActive) return;
    
    // Temporarily restore console.log for welcome message
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

  getStatus() {
    return {
      isActive: this.isSuppressionActive,
      method: 'sentry_integration_with_suppression',
      sentryCapture: 'active'
    };
  }

  clearAndShowWelcome() {
    console.clear();
    setTimeout(() => {
      console.log('%c🎉 Welcome to OnlineNote AI! 🎉', 'color: #4CAF50; font-size: 18px; font-weight: bold; text-shadow: 1px 1px 2px rgba(0,0,0,0.3);');
    }, 100);
  }
}

// Export controls for runtime management
export const cleanConsoleControls = {
  restore: () => {
    const manager = new CleanConsoleManager();
    manager.restoreConsole();
  },
  getStatus: () => {
    const manager = new CleanConsoleManager();
    return manager.getStatus();
  },
  clearAndShowWelcome: () => {
    const manager = new CleanConsoleManager();
    manager.clearAndShowWelcome();
  }
};

// Make controls available globally in development
if (import.meta.env.DEV && typeof window !== 'undefined') {
  (window as any).consoleControls = cleanConsoleControls;
}
