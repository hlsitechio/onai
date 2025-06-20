
import { MaximumConsoleSuppressionManager } from './MaximumConsoleSuppressionManager';
import { SilentErrorReporter } from './SilentErrorReporter';

/**
 * Clean console manager - achieves 0 errors, 0 warnings, only welcome message
 */
export class CleanConsoleManager {
  private suppressionManager: MaximumConsoleSuppressionManager;
  private errorReporter: SilentErrorReporter;

  constructor() {
    // Initialize immediately for maximum suppression
    this.suppressionManager = new MaximumConsoleSuppressionManager();
    this.errorReporter = SilentErrorReporter.getInstance();
    
    this.initializeCleanConsole();
  }

  private initializeCleanConsole() {
    // Setup silent error reporting to Sentry
    this.errorReporter.setupSilentErrorCapture();
    
    // Clear console and show welcome message after a brief delay
    setTimeout(() => {
      this.suppressionManager.showWelcomeMessage();
    }, 200);
  }

  restoreConsole() {
    this.suppressionManager.restoreConsole();
  }

  getStats() {
    return this.suppressionManager.getSuppressionStats();
  }

  clearAndShowWelcome() {
    console.clear();
    setTimeout(() => {
      console.log('%c🎉 Welcome to OnlineNote AI! 🎉', 'color: #4CAF50; font-size: 18px; font-weight: bold; text-shadow: 1px 1px 2px rgba(0,0,0,0.3);');
    }, 100);
  }
}
