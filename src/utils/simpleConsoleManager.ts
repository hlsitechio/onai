// Simple console manager that doesn't interfere with React initialization
export class SimpleConsoleManager {
  private static instance: SimpleConsoleManager;
  private originalMethods: Record<string, (...args: any[]) => void> = {};
  private isActive = false;

  static getInstance(): SimpleConsoleManager {
    if (!SimpleConsoleManager.instance) {
      SimpleConsoleManager.instance = new SimpleConsoleManager();
    }
    return SimpleConsoleManager.instance;
  }

  initializeAfterReact() {
    // Only initialize after React is fully loaded
    setTimeout(() => {
      this.storeOriginalMethods();
      this.suppressConsoleOutput();
      this.isActive = true;
    }, 1000); // Give React plenty of time to initialize
  }

  private storeOriginalMethods() {
    (['log', 'info', 'warn', 'error', 'debug'] as const).forEach(level => {
      this.originalMethods[level] = console[level].bind(console);
    });
  }

  private suppressConsoleOutput() {
    (['log', 'info', 'warn', 'error', 'debug'] as const).forEach(level => {
      (console as any)[level] = (...args: any[]) => {
        // Filter out specific noise but allow React errors through during initialization
        const firstArg = args[0];
        if (typeof firstArg === 'string') {
          if (firstArg.includes('facebook.com/tr') || 
              firstArg.includes('gtag') || 
              firstArg.includes('ga.js')) {
            return;
          }
        }
        // Suppress most output but keep critical errors visible in development
        if (import.meta.env.DEV && level === 'error') {
          this.originalMethods[level]?.(...args);
        }
      };
    });
  }

  restore() {
    if (!this.isActive) return;
    
    Object.assign(console, this.originalMethods);
    this.isActive = false;
    console.log('🔊 Console restored');
  }

  getStatus() {
    return {
      active: this.isActive,
      method: 'simple_suppression'
    };
  }
}

// Export simple controls
export const consoleControls = {
  restore: () => SimpleConsoleManager.getInstance().restore(),
  getStatus: () => SimpleConsoleManager.getInstance().getStatus()
};

// Make available globally in development
if (import.meta.env.DEV && typeof window !== 'undefined') {
  (window as any).consoleControls = consoleControls;
}
