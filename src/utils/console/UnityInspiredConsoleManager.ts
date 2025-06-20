
import { AbsoluteConsoleSuppressionManager } from './AbsoluteConsoleSuppressionManager';
import { SentryErrorCaptureLayer } from './SentryErrorCaptureLayer';

/**
 * Unity-inspired console management system
 * Applies the Unity approach: complete suppression + separate error capture
 */
export class UnityInspiredConsoleManager {
  private suppressionManager: AbsoluteConsoleSuppressionManager;
  private errorCaptureLayer: SentryErrorCaptureLayer;

  constructor() {
    // Initialize like Unity's DefaultExecutionOrder(-1000) - before everything else
    this.suppressionManager = AbsoluteConsoleSuppressionManager.getInstance();
    this.errorCaptureLayer = SentryErrorCaptureLayer.getInstance();
    
    this.initializeUnityStyleConsoleControl();
  }

  private initializeUnityStyleConsoleControl() {
    // Step 1: Setup error capture layer first (like Unity's Application.logMessageReceived)
    this.errorCaptureLayer.initializeSilentCapture();
    
    // Step 2: Show welcome message after brief delay (when console is ready)
    setTimeout(() => {
      this.suppressionManager.showWelcomeMessageOnly();
    }, 150);
  }

  restoreForDebugging() {
    this.suppressionManager.restoreConsole();
  }

  getSystemStatus() {
    return {
      suppression: this.suppressionManager.getSuppressionStatus(),
      errorCapture: this.errorCaptureLayer.getStatus(),
      approach: 'unity_inspired_dual_layer'
    };
  }
}
