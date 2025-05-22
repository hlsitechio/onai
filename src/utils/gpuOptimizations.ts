/**
 * GPU Optimization Utilities
 * 
 * This file contains utilities to optimize GPU rendering in modern browsers.
 * Based on latest research and best practices for high-performance web applications.
 */

// Force hardware acceleration where possible
export const enableHardwareAcceleration = () => {
  // Apply hardware acceleration hints to the body element
  document.body.style.setProperty('transform', 'translateZ(0)'); // Force GPU acceleration
  document.body.style.setProperty('backface-visibility', 'hidden'); // Reduce composite layers
  document.body.style.setProperty('perspective', '1000px'); // Enhance 3D acceleration
  document.body.style.setProperty('will-change', 'transform'); // Signal future transforms to browser
  
  // Apply to main content container if it exists
  const rootElement = document.getElementById('root');
  if (rootElement) {
    rootElement.style.setProperty('transform', 'translateZ(0)');
    rootElement.style.setProperty('backface-visibility', 'hidden');
    rootElement.style.setProperty('will-change', 'transform');
  }
  
  console.log('GPU acceleration enabled');
};

// Call this function immediately to enable hardware acceleration as soon as possible
if (typeof window !== 'undefined') {
  // Execute after DOM is fully loaded
  if (document.readyState === 'complete') {
    enableHardwareAcceleration();
  } else {
    window.addEventListener('load', enableHardwareAcceleration);
  }
}

// Export default configuration
export default {
  // Enable advanced visual features based on device capability
  enableAdvancedEffects: () => {
    const canvas = document.createElement('canvas');
    let isWebGLSupported = false;
    
    try {
      isWebGLSupported = !!(window.WebGLRenderingContext && 
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch (e) {
      isWebGLSupported = false;
    }
    
    // Set a data attribute on body to control CSS effects based on GPU capability
    document.body.setAttribute('data-gpu-capable', isWebGLSupported.toString());
    
    return isWebGLSupported;
  }
};
