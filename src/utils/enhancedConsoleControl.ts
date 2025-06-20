
import { EnhancedConsoleManager } from './console/EnhancedConsoleManager';

// Initialize enhanced console control with maximum suppression
const enhancedConsole = new EnhancedConsoleManager();

// Show clean welcome message only
console.clear();
console.log('%c🎉 Welcome to OnlineNote AI! 🎉', 'color: #4CAF50; font-size: 18px; font-weight: bold; text-shadow: 1px 1px 2px rgba(0,0,0,0.3);');

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
  },
  clearConsole: () => {
    console.clear();
    console.log('%c🎉 Welcome to OnlineNote AI! 🎉', 'color: #4CAF50; font-size: 18px; font-weight: bold; text-shadow: 1px 1px 2px rgba(0,0,0,0.3);');
  }
};

// Make controls available globally in development
if (import.meta.env.DEV && typeof window !== 'undefined') {
  (window as any).consoleControls = enhancedConsoleControls;
}

export default enhancedConsole;
