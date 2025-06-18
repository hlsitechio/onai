
/**
 * Utility to replace deprecated unload event listeners with pagehide
 * This addresses browser deprecation warnings and improves reliability
 */

type EventCallback = (event: Event) => void;

/**
 * Add a page lifecycle event listener using the modern pagehide event
 * instead of the deprecated unload event
 */
export const addPageHideListener = (callback: EventCallback): (() => void) => {
  // Use pagehide instead of unload for better reliability
  window.addEventListener('pagehide', callback);
  
  // Return cleanup function
  return () => {
    window.removeEventListener('pagehide', callback);
  };
};

/**
 * Add a beforeunload listener for cases where user confirmation is needed
 * This is still supported and appropriate for preventing accidental navigation
 */
export const addBeforeUnloadListener = (callback: (event: BeforeUnloadEvent) => void): (() => void) => {
  window.addEventListener('beforeunload', callback);
  
  return () => {
    window.removeEventListener('beforeunload', callback);
  };
};

/**
 * Add a visibility change listener for handling tab switching
 * This is useful for pausing/resuming activities when tab becomes hidden
 */
export const addVisibilityChangeListener = (callback: () => void): (() => void) => {
  document.addEventListener('visibilitychange', callback);
  
  return () => {
    document.removeEventListener('visibilitychange', callback);
  };
};

/**
 * Comprehensive page lifecycle handler that covers multiple scenarios
 */
export const addPageLifecycleListeners = (handlers: {
  onPageHide?: EventCallback;
  onBeforeUnload?: (event: BeforeUnloadEvent) => void;
  onVisibilityChange?: () => void;
}) => {
  const cleanupFunctions: (() => void)[] = [];
  
  if (handlers.onPageHide) {
    cleanupFunctions.push(addPageHideListener(handlers.onPageHide));
  }
  
  if (handlers.onBeforeUnload) {
    cleanupFunctions.push(addBeforeUnloadListener(handlers.onBeforeUnload));
  }
  
  if (handlers.onVisibilityChange) {
    cleanupFunctions.push(addVisibilityChangeListener(handlers.onVisibilityChange));
  }
  
  // Return function to cleanup all listeners
  return () => {
    cleanupFunctions.forEach(cleanup => cleanup());
  };
};
