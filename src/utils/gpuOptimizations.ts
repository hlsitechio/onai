
/**
 * Enhanced GPU Optimization Utilities
 * 
 * This file contains utilities to optimize GPU rendering for enhanced visual effects.
 * Optimized for high-performance animated backgrounds and visual effects.
 */

// Force hardware acceleration with enhanced settings
export const enableHardwareAcceleration = () => {
  // Apply enhanced hardware acceleration hints to the body element
  document.body.style.setProperty('transform', 'translateZ(0)'); // Force GPU acceleration
  document.body.style.setProperty('backface-visibility', 'hidden'); // Reduce composite layers
  document.body.style.setProperty('perspective', '1000px'); // Enhance 3D acceleration
  document.body.style.setProperty('will-change', 'transform, opacity'); // Signal future transforms
  document.body.style.setProperty('transform-style', 'preserve-3d'); // Enhanced 3D rendering
  
  // Apply to main content container if it exists
  const rootElement = document.getElementById('root');
  if (rootElement) {
    rootElement.style.setProperty('transform', 'translateZ(0)');
    rootElement.style.setProperty('backface-visibility', 'hidden');
    rootElement.style.setProperty('will-change', 'transform, opacity');
    rootElement.style.setProperty('transform-style', 'preserve-3d');
  }
  
  // Optimize animated elements
  const animatedElements = document.querySelectorAll('[class*="animate-"], [class*="motion-"]');
  animatedElements.forEach(element => {
    const htmlElement = element as HTMLElement;
    htmlElement.style.setProperty('transform', 'translateZ(0)');
    htmlElement.style.setProperty('will-change', 'transform, opacity');
    htmlElement.style.setProperty('backface-visibility', 'hidden');
  });
  
  console.log('Enhanced GPU acceleration enabled with visual effects optimization');
};

// Enhanced configuration for visual effects
export const optimizeForVisualEffects = () => {
  // Enable CSS containment for better performance
  document.body.style.setProperty('contain', 'layout style paint');
  
  // Optimize for smooth animations
  const style = document.createElement('style');
  style.textContent = `
    * {
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    
    .enhanced-gpu-layer {
      transform: translateZ(0);
      will-change: transform, opacity;
      backface-visibility: hidden;
      perspective: 1000px;
    }
    
    .smooth-animation {
      animation-fill-mode: both;
      animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    }
  `;
  document.head.appendChild(style);
  
  // Enable hardware acceleration for background elements
  const backgroundElements = document.querySelectorAll('[class*="background"], [class*="grid"], [class*="dot"]');
  backgroundElements.forEach(element => {
    const htmlElement = element as HTMLElement;
    htmlElement.classList.add('enhanced-gpu-layer');
  });
};

// Call optimization functions
if (typeof window !== 'undefined') {
  if (document.readyState === 'complete') {
    enableHardwareAcceleration();
    optimizeForVisualEffects();
  } else {
    window.addEventListener('load', () => {
      enableHardwareAcceleration();
      optimizeForVisualEffects();
    });
  }
  
  // Re-optimize when new elements are added
  const observer = new MutationObserver(() => {
    enableHardwareAcceleration();
    optimizeForVisualEffects();
  });
  
  observer.observe(document.body, { childList: true, subtree: true });
}

// Export enhanced configuration
export default {
  // Enable advanced visual features based on device capability
  enableAdvancedEffects: () => {
    const canvas = document.createElement('canvas');
    let isWebGLSupported = false;
    let hasHighPerformance = false;
    
    try {
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      isWebGLSupported = !!gl;
      
      // Check for high-performance GPU features
      if (gl) {
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        if (debugInfo) {
          const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
          hasHighPerformance = !renderer.toLowerCase().includes('software');
        }
      }
    } catch (e) {
      isWebGLSupported = false;
    }
    
    // Set data attributes on body to control CSS effects based on GPU capability
    document.body.setAttribute('data-gpu-capable', isWebGLSupported.toString());
    document.body.setAttribute('data-high-performance', hasHighPerformance.toString());
    
    // Enable enhanced effects for capable devices
    if (isWebGLSupported && hasHighPerformance) {
      document.body.classList.add('enhanced-effects-enabled');
    }
    
    return { webGL: isWebGLSupported, highPerformance: hasHighPerformance };
  },
  
  // Monitor performance and adjust effects accordingly
  performanceMonitor: () => {
    let frameCount = 0;
    let lastTime = performance.now();
    
    const measureFPS = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime - lastTime >= 1000) {
        const fps = Math.round(frameCount * 1000 / (currentTime - lastTime));
        
        // Adjust effects based on performance
        if (fps < 30) {
          document.body.classList.add('reduced-effects');
          console.log('Performance optimization: Reduced effects enabled');
        } else if (fps > 50) {
          document.body.classList.remove('reduced-effects');
        }
        
        frameCount = 0;
        lastTime = currentTime;
      }
      
      requestAnimationFrame(measureFPS);
    };
    
    requestAnimationFrame(measureFPS);
  }
};
