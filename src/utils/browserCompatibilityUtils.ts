/**
 * Browser compatibility utilities to handle deprecated APIs and improve cross-browser support
 */

import { initializeStandardsModeMonitoring, auditStandardsMode } from './standardsModeValidator';

/**
 * Feature detection for modern browser APIs
 */
export const detectBrowserFeatures = () => {
  return {
    supportsPageHide: 'onpagehide' in window,
    supportsVisibilityAPI: 'visibilityState' in document,
    supportsBeforeUnload: 'onbeforeunload' in window,
    supportsUnload: 'onunload' in window, // Still supported but deprecated
    supportsPageLifecycle: 'onfreeze' in document,
  };
};

/**
 * Logs browser compatibility warnings
 */
export const checkBrowserCompatibility = () => {
  const features = detectBrowserFeatures();
  const warnings: string[] = [];
  
  if (!features.supportsPageHide) {
    warnings.push('pagehide event not supported, falling back to beforeunload');
  }
  
  if (!features.supportsVisibilityAPI) {
    warnings.push('Page Visibility API not supported');
  }
  
  // Check for Quirks Mode using the new validator
  const standardsReport = auditStandardsMode();
  if (!standardsReport.isStandardsMode) {
    warnings.push('Document is in Quirks Mode - ensure proper DOCTYPE is set');
  }
  
  if (warnings.length > 0) {
    console.warn('Browser compatibility issues detected:', warnings);
  } else {
    console.log('Browser compatibility check passed');
  }
  
  return { compatible: warnings.length === 0, warnings, standardsReport };
};

/**
 * Polyfill for older browsers that don't support modern page lifecycle events
 */
export const addPageLifecyclePolyfill = () => {
  const features = detectBrowserFeatures();
  
  // If pagehide is not supported, create a polyfill using beforeunload
  if (!features.supportsPageHide && features.supportsBeforeUnload) {
    console.log('Adding pagehide polyfill using beforeunload');
    
    // Create a custom pagehide event for older browsers
    const createPageHideEvent = () => {
      return new CustomEvent('pagehide', {
        bubbles: false,
        cancelable: false,
        detail: { persisted: false }
      });
    };
    
    // Dispatch pagehide when beforeunload fires
    window.addEventListener('beforeunload', () => {
      const event = createPageHideEvent();
      window.dispatchEvent(event);
    });
  }
};

/**
 * Check for and warn about deprecated API usage
 */
export const checkDeprecatedAPIs = () => {
  const deprecatedWarnings: string[] = [];
  
  // Check for unload event listeners (deprecated)
  const unloadListeners = (window as any)._unloadListeners || [];
  if (unloadListeners.length > 0) {
    deprecatedWarnings.push(`Found ${unloadListeners.length} unload event listeners - consider using pagehide instead`);
  }
  
  // Check for deprecated Google Fonts usage patterns
  const linkElements = document.querySelectorAll('link[href*="fonts.googleapis.com"]');
  linkElements.forEach((link) => {
    const href = link.getAttribute('href');
    if (href && !href.includes('display=swap')) {
      deprecatedWarnings.push('Google Fonts link missing display=swap parameter for better performance');
    }
  });
  
  if (deprecatedWarnings.length > 0) {
    console.warn('Deprecated API usage detected:', deprecatedWarnings);
  }
  
  return deprecatedWarnings;
};

/**
 * Initialize all browser compatibility checks and polyfills
 */
export const initializeBrowserCompatibility = () => {
  console.log('Initializing browser compatibility checks...');
  
  // Run feature detection
  const features = detectBrowserFeatures();
  console.log('Browser features detected:', features);
  
  // Check compatibility (now includes Standards Mode validation)
  const compatibility = checkBrowserCompatibility();
  
  // Add polyfills if needed
  addPageLifecyclePolyfill();
  
  // Check for deprecated API usage
  checkDeprecatedAPIs();
  
  // Initialize Standards Mode monitoring
  const cleanupStandardsMonitoring = initializeStandardsModeMonitoring();
  
  // Store cleanup function globally for potential later use
  (window as any).cleanupStandardsMonitoring = cleanupStandardsMonitoring;
  
  return { features, compatibility };
};
