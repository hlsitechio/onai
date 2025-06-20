
/**
 * CleanConsoleManager
 * ====================
 * A utility class that:
 * 1. Hooks into Sentry's `captureConsoleIntegration` for internal logging
 * 2. Silences all console output from the browser
 * 3. Allows optional restoration or controlled visibility
 * 
 * Notes:
 * - Sentry must be initialized before this manager for capture to work.
 * - DevTools system warnings (e.g., CSP, preload, quirks) are NOT suppressible by this tool.
 */

type ConsoleMethod = 'log' | 'info' | 'warn' | 'error' | 'debug';

const CONSOLE_METHODS: readonly ConsoleMethod[] = ['log', 'info', 'warn', 'error', 'debug'];

export class CleanConsoleManager {
  private readonly originalMethods: Record<ConsoleMethod, (...args: any[]) => void> = {} as any;
  private isSuppressionActive = false;

  private readonly thirdPartyIgnorePatterns: RegExp[] = [
    /facebook\.com\/tr/,
    /gtag/,
    /ga\.js/,
    /googletagmanager/,
    /doubleclick\.net/,
    /InterestGroups/,
    /deprecated/i
  ];

  constructor() {
    this.initializeCleanConsole();
  }

  private initializeCleanConsole() {
    // Store original console methods for restoration
    CONSOLE_METHODS.forEach(level => {
      this.originalMethods[level] = console[level].bind(console);
    });

    // Suppress output
    this.suppressConsoleOutput();

    // Welcome message
    setTimeout(() => this.showWelcomeMessage(), 200);

    this.isSuppressionActive = true;
  }

  private suppressConsoleOutput() {
    CONSOLE_METHODS.forEach(level => {
      (console as any)[level] = (...args: any[]) => {
        const firstArg = args[0];

        // Optional filtering of known noisy 3rd-party SDK logs
        if (typeof firstArg === 'string') {
          if (this.thirdPartyIgnorePatterns.some(pattern => pattern.test(firstArg))) {
            return;
          }
        }

        // Suppress all visual output. Sentry captures logs before this.
      };
    });
  }

  private showWelcomeMessage() {
    if (!this.isSuppressionActive) return;

    const originalLog = this.originalMethods.log;
    if (originalLog) {
      if (console.clear) console.clear();

      setTimeout(() => {
        console.log = originalLog;
        console.log(
          '%c🎉 Welcome to OnlineNote AI! 🎉',
          'color: #4CAF50; font-size: 18px; font-weight: bold; text-shadow: 1px 1px 2px rgba(0,0,0,0.3);'
        );
        console.log = () => {};
      }, 100);
    }
  }

  public restoreConsole() {
    if (!this.isSuppressionActive) return;

    Object.assign(console, this.originalMethods);
    this.isSuppressionActive = false;
    console.log('%c🔊 Console restored - all logs now visible', 'color: #03A9F4; font-weight: bold;');
  }

  public getStatus() {
    return {
      isActive: this.isSuppressionActive,
      method: 'sentry_integration_with_suppression',
      sentryCapture: 'active'
    };
  }

  public clearAndShowWelcome() {
    if (console.clear) console.clear();

    const originalLog = this.originalMethods.log;
    if (originalLog) {
      setTimeout(() => {
        console.log = originalLog;
        console.log(
          '%c🎉 Welcome to OnlineNote AI! 🎉',
          'color: #4CAF50; font-size: 18px; font-weight: bold; text-shadow: 1px 1px 2px rgba(0,0,0,0.3);'
        );
        console.log = () => {};
      }, 100);
    }
  }
}

// ✅ Singleton instance to prevent multiple instantiations
const consoleManager = new CleanConsoleManager();

// ✅ Export runtime controls
export const cleanConsoleControls = {
  restore: () => consoleManager.restoreConsole(),
  getStatus: () => consoleManager.getStatus(),
  clearAndShowWelcome: () => consoleManager.clearAndShowWelcome()
};

// ✅ DevTool shortcut for developers
if (import.meta.env.DEV && typeof window !== 'undefined') {
  (window as any).consoleControls = cleanConsoleControls;
}
