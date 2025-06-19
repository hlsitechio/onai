
import { EnhancedConsoleManager } from './console/EnhancedConsoleManager';

// Initialize enhanced console control
const enhancedConsole = new EnhancedConsoleManager();

// Export controls for runtime management
export const enhancedConsoleControls = {
  restore: () => enhancedConsole.restoreConsole(),
  getStats: () => enhancedConsole.getErrorStats(),
  reset: () => enhancedConsole.resetErrorCounts(),
};

// Make controls available globally in development
if (import.meta.env.DEV && typeof window !== 'undefined') {
  (window as any).enhancedConsoleControls = enhancedConsoleControls;
}

export default enhancedConsole;
