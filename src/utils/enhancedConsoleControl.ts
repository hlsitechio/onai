
import { UnityInspiredConsoleManager } from './console/UnityInspiredConsoleManager';

// Initialize Unity-inspired console control immediately - maximum suppression with error capture
const unityStyleConsole = new UnityInspiredConsoleManager();

// Export controls for runtime management
export const enhancedConsoleControls = {
  restore: () => {
    unityStyleConsole.restoreForDebugging();
    console.info('🔊 Console filtering disabled - all messages will show');
  },
  getStats: () => unityStyleConsole.getSystemStatus(),
  clearAndShowWelcome: () => {
    console.clear();
    setTimeout(() => {
      console.log('%c🎉 Welcome to OnlineNote AI! 🎉', 'color: #4CAF50; font-size: 18px; font-weight: bold; text-shadow: 1px 1px 2px rgba(0,0,0,0.3);');
    }, 100);
  },
  showWelcome: () => {
    console.clear();
    console.log('%c🎉 Welcome to OnlineNote AI! 🎉', 'color: #4CAF50; font-size: 18px; font-weight: bold; text-shadow: 1px 1px 2px rgba(0,0,0,0.3);');
  }
};

// Make controls available globally in development
if (import.meta.env.DEV && typeof window !== 'undefined') {
  (window as any).consoleControls = enhancedConsoleControls;
}

export default unityStyleConsole;
