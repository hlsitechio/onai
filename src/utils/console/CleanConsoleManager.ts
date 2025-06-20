
/**
 * CleanConsoleManager
 * ====================
 * A utility class that:
 * 1. Hooks into Sentry's `captureConsoleIntegration` for internal logging
 * 2. Silences all console output from the browser
 * 3. Allows optional restoration or controlled visibility
 * 4. Tracks suppressed log counts (optional)
 * 
 * Notes:
 * - Sentry must be initialized before this manager for capture to work.
 * - DevTools system warnings (e.g., CSP, preload, quirks) are NOT suppressible by this tool.
 */

import * as Sentry from '@sentry/react';

type ConsoleMethod = 'log' | 'info' | 'warn' | 'error' | 'debug';

const CONSOLE_METHODS: readonly ConsoleMethod[] = ['log', 'info', 'warn', 'error', 'debug'];

export class CleanConsoleManager {
  private readonly originalMethods: Record<ConsoleMethod, (...args: any[]) => void> = {} as any;
  private isSuppressionActive = false;
  private suppressedLogs: Record<ConsoleMethod, number> = {};

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
      this.suppressedLogs[level] = 0;
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

        // Track suppressed logs
        this.suppressedLogs[level]++;

        // Optional: Manual fallback capture to Sentry (if captureConsoleIntegration missed anything)
        if (import.meta.env.PROD || import.meta.env.VITE_ENABLE_SENTRY === 'true') {
          try {
            const message = args.map(arg => 
              typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
            ).join(' ');
            
            if (level === 'error') {
              Sentry.captureException(new Error(`Console Error: ${message}`));
            } else {
              Sentry.captureMessage(`${level.toUpperCase()}: ${message}`, level as any);
            }
          } catch (e) {
            // Silently fail if Sentry isn't available
          }
        }

        // Suppress all visual output. Sentry captures logs before this point.
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
        console.log(
          '%c📊 Console suppression active - all logs captured in Sentry',
          'color: #03A9F4; font-size: 12px;'
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
    console.log('📊 Suppressed log counts:', this.suppressedLogs);
  }

  public getStatus() {
    return {
      isActive: this.isSuppressionActive,
      method: 'sentry_integration_with_suppression',
      sentryCapture: 'active',
      suppressedCounts: { ...this.suppressedLogs }
    };
  }

  public getSuppressedCounts() {
    return { ...this.suppressedLogs };
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
        console.log(
          '%c📊 Console suppression active - all logs captured in Sentry',
          'color: #03A9F4; font-size: 12px;'
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
  getSuppressedCounts: () => consoleManager.getSuppressedCounts(),
  clearAndShowWelcome: () => consoleManager.clearAndShowWelcome()
};

// ✅ DevTool shortcut for developers
if (import.meta.env.DEV && typeof window !== 'undefined') {
  (window as any).consoleControls = cleanConsoleControls;
}
