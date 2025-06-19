
/**
 * Production console suppression utilities
 */
export class ProductionSuppression {
  private originalConsole: Partial<Console> = {};
  private isProductionSuppressed = false;

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
    };
  }

  setupProductionSuppression() {
    if (import.meta.env.PROD) {
      // Suppress non-critical console output in production
      console.log = () => {};
      console.debug = () => {};
      console.info = (...args) => {
        // Only allow important info messages
        const message = args.join(' ');
        if (this.isImportantMessage(message)) {
          this.originalConsole.info?.(...args);
        }
      };

      this.isProductionSuppressed = true;
      this.originalConsole.log?.('Production console suppression enabled');
    }
  }

  private isImportantMessage(message: string): boolean {
    const importantKeywords = [
      'authentication',
      'security',
      'critical',
      'fatal',
      'initialization',
      'migration',
      'deployment',
    ];

    return importantKeywords.some(keyword =>
      message.toLowerCase().includes(keyword)
    );
  }

  restoreConsole() {
    Object.assign(console, this.originalConsole);
    this.isProductionSuppressed = false;
    console.log('Console methods restored');
  }

  getOriginalConsole() {
    return this.originalConsole;
  }

  isSuppressionEnabled() {
    return this.isProductionSuppressed;
  }
}
