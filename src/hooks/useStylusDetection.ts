
import { useState, useEffect } from 'react';

interface StylusCapabilities {
  hasPressure: boolean;
  hasTilt: boolean;
  hasStylus: boolean;
  pointerTypes: string[];
}

export const useStylusDetection = () => {
  const [capabilities, setCapabilities] = useState<StylusCapabilities>({
    hasPressure: false,
    hasTilt: false,
    hasStylus: false,
    pointerTypes: []
  });

  const [isUsingStylus, setIsUsingStylus] = useState(false);

  useEffect(() => {
    const detectCapabilities = () => {
      const pointerTypes: string[] = [];
      
      // Enhanced Samsung S Pen detection
      const detectSamsungSPen = () => {
        const userAgent = navigator.userAgent.toLowerCase();
        const isSamsung = userAgent.includes('samsung') || 
                         userAgent.includes('sm-') || 
                         userAgent.includes('galaxy');
        
        // Check for Samsung-specific features
        const hasSamsungFeatures = 'SamsungChangiEngine' in window || 
                                  'samsung' in navigator ||
                                  userAgent.includes('samsungbrowser');
        
        if (isSamsung || hasSamsungFeatures) {
          console.log('Samsung device detected, enabling stylus support');
          setCapabilities(prev => ({ 
            ...prev, 
            hasStylus: true,
            hasPressure: true, // S Pen supports pressure
            hasTilt: true // S Pen supports tilt
          }));
          return true;
        }
        return false;
      };

      // Check for pointer events support
      if (window.PointerEvent) {
        // Create a more interactive test element
        const testElement = document.createElement('div');
        testElement.style.position = 'fixed';
        testElement.style.top = '0';
        testElement.style.left = '0';
        testElement.style.width = '1px';
        testElement.style.height = '1px';
        testElement.style.opacity = '0';
        testElement.style.pointerEvents = 'auto';
        testElement.style.zIndex = '-1';
        
        const checkPointerType = (event: PointerEvent) => {
          // Only log stylus events, not mouse events
          if (event.pointerType === 'pen') {
            console.log('Stylus event detected:', {
              pointerType: event.pointerType,
              pressure: event.pressure,
              tiltX: event.tiltX,
              tiltY: event.tiltY,
              isPrimary: event.isPrimary
            });
          }

          if (!pointerTypes.includes(event.pointerType)) {
            pointerTypes.push(event.pointerType);
            // Only log when we discover a new pointer type
            console.log('New pointer type discovered:', event.pointerType);
          }
          
          const hasPressure = event.pressure !== undefined && event.pressure > 0;
          const hasTilt = (event.tiltX !== undefined && event.tiltX !== 0) || 
                         (event.tiltY !== undefined && event.tiltY !== 0);
          const isStylus = event.pointerType === 'pen';
          
          setCapabilities(prev => ({
            ...prev,
            hasPressure: hasPressure || prev.hasPressure,
            hasTilt: hasTilt || prev.hasTilt,
            hasStylus: isStylus || prev.hasStylus,
            pointerTypes: [...new Set([...prev.pointerTypes, ...pointerTypes])]
          }));
          
          if (isStylus) {
            setIsUsingStylus(true);
          }
        };

        // Add event listeners to the test element
        testElement.addEventListener('pointerdown', checkPointerType, { passive: true });
        testElement.addEventListener('pointermove', checkPointerType, { passive: true });
        testElement.addEventListener('pointerenter', checkPointerType, { passive: true });
        
        // Also add to document for better coverage
        document.addEventListener('pointerdown', checkPointerType, { passive: true });
        document.addEventListener('pointermove', checkPointerType, { passive: true });
        
        document.body.appendChild(testElement);
        
        return () => {
          testElement.removeEventListener('pointerdown', checkPointerType);
          testElement.removeEventListener('pointermove', checkPointerType);
          testElement.removeEventListener('pointerenter', checkPointerType);
          document.removeEventListener('pointerdown', checkPointerType);
          document.removeEventListener('pointermove', checkPointerType);
          if (document.body.contains(testElement)) {
            document.body.removeChild(testElement);
          }
        };
      }
    };

    const cleanup = detectCapabilities();
    
    // Enhanced device detection for known stylus devices
    const userAgent = navigator.userAgent.toLowerCase();
    const hasKnownStylus = 
      userAgent.includes('samsung') || 
      userAgent.includes('sm-') ||
      userAgent.includes('galaxy') ||
      userAgent.includes('ipad') || 
      userAgent.includes('surface') ||
      userAgent.includes('wacom') ||
      userAgent.includes('samsungbrowser');
    
    if (hasKnownStylus) {
      console.log('Known stylus device detected:', userAgent);
      setCapabilities(prev => ({ 
        ...prev, 
        hasStylus: true,
        hasPressure: userAgent.includes('samsung') || userAgent.includes('ipad'),
        hasTilt: userAgent.includes('samsung') || userAgent.includes('surface')
      }));
    }

    // Additional check for touch events with pressure (some Samsung devices)
    const handleTouchStart = (event: TouchEvent) => {
      if (event.touches.length > 0) {
        const touch = event.touches[0];
        // Some Samsung devices expose pressure through touch events
        if ('force' in touch && touch.force > 0) {
          console.log('Pressure-sensitive touch detected, likely S Pen');
          setCapabilities(prev => ({ 
            ...prev, 
            hasStylus: true,
            hasPressure: true
          }));
        }
      }
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: true });

    return () => {
      if (cleanup) cleanup();
      document.removeEventListener('touchstart', handleTouchStart);
    };
  }, []);

  // Reset stylus usage when switching between pointer types
  useEffect(() => {
    const resetStylusUsage = (event: PointerEvent) => {
      if (event.pointerType !== 'pen') {
        setIsUsingStylus(false);
      }
    };

    document.addEventListener('pointerdown', resetStylusUsage, { passive: true });
    
    return () => {
      document.removeEventListener('pointerdown', resetStylusUsage);
    };
  }, []);

  return {
    capabilities,
    isUsingStylus,
    hasStylus: capabilities.hasStylus || capabilities.pointerTypes.includes('pen')
  };
};
