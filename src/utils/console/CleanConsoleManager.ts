
/**
 * CleanConsoleManager v2 – Enhanced for 2025
 * ==========================================
 * 1. Captures and suppresses noisy logs
 * 2. Supports selective method suppression
 * 3. Integrates tightly with Sentry
 * 4. Provides dev console controls and enhanced UX
 * 5. Tracks suppressed counts with optional buffer storage
 */

import * as Sentry from '@sentry/react';

type ConsoleMethod = 'log' | 'info' | 'warn' | 'error' | 'debug';
type ConsoleArgs = any[];

const CONSOLE_METHODS: readonly ConsoleMethod[] = ['log', 'info', 'warn', 'error', 'debug'];

interface CleanConsoleOptions {
  enableBuffer?: boolean;
  suppressMethods?: ConsoleMethod[];
  enableSentryCapture?: boolean;
}

interface SuppressedLog {
  method: ConsoleMethod;
  args: ConsoleArgs;
  timestamp: number;
}

export class CleanConsoleManager {
  private readonly originalMethods: Record<ConsoleMethod, (...args: any[]) => void> = {} as any;
  private isSuppressionActive = false;
  private suppressedLogs: Record<ConsoleMethod, number> = {
    log: 0, info: 0, warn: 0, error: 0, debug: 0
  };
  private logBuffer: SuppressedLog[] = [];

  private readonly ignorePatterns: RegExp[] = [
    /facebook\.com\/tr/,
    /gtag/,
    /googletagmanager/,
    /doubleclick\.net/,
    /InterestGroups/,
    /deprecated/i
  ];

  private readonly options: Required<CleanConsoleOptions>;

  constructor(options?: CleanConsoleOptions) {
    this.options = {
      enableBuffer: options?.enableBuffer ?? false,
      suppressMethods: options?.suppressMethods ?? [...CONSOLE_METHODS],
      enableSentryCapture: options?.enableSentryCapture ?? true
    };
    this.init();
  }

  private init() {
    CONSOLE_METHODS.forEach(method => {
      this.originalMethods[method] = console[method].bind(console);
    });
    this.suppress();
    this.welcomeBanner();
    this.isSuppressionActive = true;
  }

  private shouldIgnore(arg: any): boolean {
    if (typeof arg !== 'string') return false;
    return this.ignorePatterns.some(pattern => pattern.test(arg));
  }

  private suppress() {
    this.options.suppressMethods.forEach(method => {
      console[method] = (...args: ConsoleArgs) => {
        if (this.shouldIgnore(args[0])) return;

        this.suppressedLogs[method]++;

        if (this.options.enableBuffer) {
          this.logBuffer.push({ method, args, timestamp: Date.now() });
        }

        if (this.options.enableSentryCapture && (import.meta.env.PROD || import.meta.env.VITE_ENABLE_SENTRY === 'true')) {
          try {
            const msg = args.map(arg => (typeof arg === 'object' ? JSON.stringify(arg) : String(arg))).join(' ');
            if (method === 'error') {
              Sentry.captureException(new Error(`Console Error: ${msg}`));
            } else {
              Sentry.captureMessage(`[${method.toUpperCase()}] ${msg}`, method as any);
            }
          } catch (_) {
            // Fail silently
          }
        }

        // No visual output
      };
    });
  }

  private welcomeBanner() {
    setTimeout(() => {
      if (!this.originalMethods.log) return;
      console.clear?.();
      this.originalMethods.log?.(
        '%c🎉 Welcome to OnlineNote AI – Logging Suppressed',
        'color:#4CAF50;font-size:16px;font-weight:bold;text-shadow:1px 1px 2px rgba(0,0,0,0.2)'
      );
      this.originalMethods.log?.(
        '%c🔒 Console output is suppressed. Logs sent to Sentry (if enabled).',
        'color:#58A6D0;font-size:13px;'
      );
    }, 100);
  }

  public restoreConsole() {
    if (!this.isSuppressionActive) return;

    this.options.suppressMethods.forEach(method => {
      console[method] = this.originalMethods[method];
    });

    this.isSuppressionActive = false;
    this.originalMethods.log?.('%c🔊 Console restored.', 'color:#03A9F4;font-weight:bold;');
    this.originalMethods.log?.('📊 Suppressed counts:', this.suppressedLogs);
  }

  public getStatus() {
    return {
      isActive: this.isSuppressionActive,
      suppressedCounts: { ...this.suppressedLogs },
      hasBuffer: this.options.enableBuffer,
      bufferedLogs: this.options.enableBuffer ? this.logBuffer.length : undefined,
      method: 'sentry_capture_and_suppress',
    };
  }

  public getSuppressedCounts() {
    return { ...this.suppressedLogs };
  }

  public flushBuffer() {
    if (!this.options.enableBuffer || this.logBuffer.length === 0) return;

    this.originalMethods.log?.('%c🔁 Flushing buffered logs:', 'color:#FF9800; font-weight:bold;');
    this.logBuffer.forEach(({ method, args }) => {
      this.originalMethods[method]?.(...args);
    });
    this.logBuffer = [];
  }

  public clearBuffer() {
    this.logBuffer = [];
  }
}

// ✅ Singleton Manager Instance
const consoleManager = new CleanConsoleManager({
  enableBuffer: true,
  suppressMethods: ['log', 'warn', 'error', 'info', 'debug'],
  enableSentryCapture: true
});

// ✅ Runtime Dev Controls
export const cleanConsoleControls = {
  restore: () => consoleManager.restoreConsole(),
  getStatus: () => consoleManager.getStatus(),
  getSuppressedCounts: () => consoleManager.getSuppressedCounts(),
  flushBuffer: () => consoleManager.flushBuffer(),
  clearBuffer: () => consoleManager.clearBuffer()
};

// ✅ Dev Shortcut for Browser Console
if (import.meta.env.DEV && typeof window !== 'undefined') {
  (window as any).consoleControls = cleanConsoleControls;
}
