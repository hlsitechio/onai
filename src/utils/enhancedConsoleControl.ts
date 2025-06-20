
import { EnhancedConsoleManager } from './console/EnhancedConsoleManager';

// Initialize enhanced console control with aggressive filtering
const enhancedConsole = new EnhancedConsoleManager();

// Show initial suppression message
console.info('🔇 Enhanced console filtering active - noise reduction enabled');

// Export controls for runtime management
export const enhancedConsoleControls = {
  restore: () => {
    enhancedConsole.restoreConsole();
    console.info('🔊 Console filtering disabled - all messages will show');
  },
  getStats: () => enhancedConsole.getErrorStats(),
  reset: () => {
    enhancedConsole.resetErrorCounts();
    console.info('📊 Error counts reset');
  },
  showStats: () => {
    const stats = enhancedConsole.getErrorStats();
    console.info('📊 Console Stats:', stats);
  }
};

// Make controls available globally in development
if (import.meta.env.DEV && typeof window !== 'undefined') {
  (window as any).consoleControls = enhancedConsoleControls;
  console.info('🛠️ Console controls available: window.consoleControls.showStats()');
}

export default enhancedConsole;
