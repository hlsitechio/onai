
import { logger } from '../consoleControl';
import { ProductionSuppression } from './ProductionSuppression';
import { ConsoleOverrides } from './ConsoleOverrides';

/**
 * Maximum console suppression for clean DevTools
 */
export class EnhancedConsoleManager {
  private productionSuppression: ProductionSuppression;
  private consoleOverrides: ConsoleOverrides;

  constructor() {
    this.productionSuppression = new ProductionSuppression();
    this.consoleOverrides = new ConsoleOverrides(this.productionSuppression.getOriginalConsole());
    this.initializeMaximumSuppression();
  }

  private initializeMaximumSuppression() {
    // Clear console first
    console.clear();
    
    // Setup maximum suppression
    this.productionSuppression.setupMaximumSuppression();
    this.consoleOverrides.setupErrorAggregation();
    
    // Show welcome message
    setTimeout(() => {
      console.clear();
      console.log('%c🎉 Welcome to OnlineNote AI! 🎉', 'color: #4CAF50; font-size: 18px; font-weight: bold; text-shadow: 1px 1px 2px rgba(0,0,0,0.3);');
    }, 100);
  }

  /**
   * Restore original console methods (for debugging)
   */
  restoreConsole() {
    this.productionSuppression.restoreConsole();
  }

  /**
   * Get error statistics
   */
  getErrorStats() {
    return {
      ...this.consoleOverrides.getErrorStats(),
      isMaximumSuppressed: true,
    };
  }

  /**
   * Reset error counts
   */
  resetErrorCounts() {
    this.consoleOverrides.resetErrorCounts();
  }
}
