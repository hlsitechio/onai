
import { CleanConsoleManager } from './console/CleanConsoleManager';

// Initialize clean console control immediately - maximum suppression
const cleanConsole = new CleanConsoleManager();

// Export controls for runtime management
export const enhancedConsoleControls = {
  restore: () => {
    cleanConsole.restoreConsole();
    console.info('🔊 Console filtering disabled - all messages will show');
  },
  getStats: () => cleanConsole.getStats(),
  clearAndShowWelcome: () => cleanConsole.clearAndShowWelcome(),
  showWelcome: () => {
    console.clear();
    console.log('%c🎉 Welcome to OnlineNote AI! 🎉', 'color: #4CAF50; font-size: 18px; font-weight: bold; text-shadow: 1px 1px 2px rgba(0,0,0,0.3);');
  }
};

// Make controls available globally in development
if (import.meta.env.DEV && typeof window !== 'undefined') {
  (window as any).consoleControls = enhancedConsoleControls;
}

export default cleanConsole;
