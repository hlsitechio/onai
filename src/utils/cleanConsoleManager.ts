
/**
 * Clean console manager using official Sentry integration approach
 * 1. Sentry's captureConsoleIntegration captures logs before suppression
 * 2. Override console methods to suppress visual output
 * 3. Show welcome message only
 */
export class CleanConsoleManager {
  private originalMethods: Record<string, (...args: any[]) => void> = {};
  private isSuppressionActive = false;

  constructor() {
    this.initializeCleanConsole();
  }

  private initializeCleanConsole() {
    // Store original methods for welcome message and potential restoration
    (['log', 'info', 'warn', 'error', 'debug'] as const).forEach(level => {
      this.originalMethods[level] = console[level].bind(console);
    });

    // Apply console suppression - Sentry captures before this override
    this.suppressConsoleOutput();
    
    // Show welcome message after brief delay
    setTimeout(() => {
      this.showWelcomeMessage();
    }, 200);

    this.isSuppressionActive = true;
  }

  private suppressConsoleOutput() {
    // Override all console methods - Sentry's integration captures before this suppression
    (['log', 'info', 'warn', 'error', 'debug'] as const).forEach(level => {
      (console as any)[level] = (...args: any[]) => {
        // Optional: Filter specific third-party logs
        const firstArg = args[0];
        if (typeof firstArg === 'string') {
          // Skip Facebook and other third-party SDK logs
          if (firstArg.includes('facebook.com/tr') || 
              firstArg.includes('gtag') || 
              firstArg.includes('ga.js')) {
            return;
          }
        }
        
        // Completely suppress console output - Sentry still captures due to captureConsoleIntegration
        // No console output will be shown
      };
    });
  }

  private showWelcomeMessage() {
    if (!this.isSuppressionActive) return;
    
    // Temporarily restore console.log for welcome message only
    const originalLog = this.originalMethods.log;
    if (originalLog) {
      // Clear console first
      if (console.clear) console.clear();
      
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
    if (console.clear) console.clear();
    setTimeout(() => {
      const originalLog = this.originalMethods.log;
      if (originalLog) {
        console.log = originalLog;
        console.log('%c🎉 Welcome to OnlineNote AI! 🎉', 'color: #4CAF50; font-size: 18px; font-weight: bold; text-shadow: 1px 1px 2px rgba(0,0,0,0.3);');
        console.log = () => {};
      }
    }, 100);
  }
}

// Export simple controls for runtime management
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
