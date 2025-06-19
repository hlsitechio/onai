
import { logger } from '../consoleControl';
import { ProductionSuppression } from './ProductionSuppression';
import { ConsoleOverrides } from './ConsoleOverrides';

/**
 * Enhanced console control with production suppression and error reporting
 */
export class EnhancedConsoleManager {
  private productionSuppression: ProductionSuppression;
  private consoleOverrides: ConsoleOverrides;

  constructor() {
    this.productionSuppression = new ProductionSuppression();
    this.consoleOverrides = new ConsoleOverrides(this.productionSuppression.getOriginalConsole());
    this.initializeConsoleOverrides();
  }

  private initializeConsoleOverrides() {
    this.productionSuppression.setupProductionSuppression();
    this.consoleOverrides.setupErrorAggregation();
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
      isProductionSuppressed: this.productionSuppression.isSuppressionEnabled(),
    };
  }

  /**
   * Reset error counts
   */
  resetErrorCounts() {
    this.consoleOverrides.resetErrorCounts();
  }
}
