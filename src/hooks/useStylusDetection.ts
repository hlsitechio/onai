
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
      
      // Check for pointer events support
      if (window.PointerEvent) {
        // Modern approach - check for different pointer types through events
        const testElement = document.createElement('div');
        
        const checkPointerType = (event: PointerEvent) => {
          if (!pointerTypes.includes(event.pointerType)) {
            pointerTypes.push(event.pointerType);
          }
          
          setCapabilities(prev => ({
            ...prev,
            hasPressure: event.pressure !== undefined && event.pressure > 0,
            hasTilt: event.tiltX !== undefined || event.tiltY !== undefined,
            hasStylus: event.pointerType === 'pen',
            pointerTypes: [...pointerTypes]
          }));
          
          setIsUsingStylus(event.pointerType === 'pen');
        };

        testElement.addEventListener('pointerdown', checkPointerType);
        testElement.addEventListener('pointermove', checkPointerType);
        
        document.body.appendChild(testElement);
        
        return () => {
          testElement.removeEventListener('pointerdown', checkPointerType);
          testElement.removeEventListener('pointermove', checkPointerType);
          document.body.removeChild(testElement);
        };
      }
    };

    const cleanup = detectCapabilities();
    
    // Also check for known devices
    const userAgent = navigator.userAgent.toLowerCase();
    const hasKnownStylus = 
      userAgent.includes('samsung') || 
      userAgent.includes('ipad') || 
      userAgent.includes('surface') ||
      userAgent.includes('wacom');
    
    if (hasKnownStylus) {
      setCapabilities(prev => ({ ...prev, hasStylus: true }));
    }

    return cleanup;
  }, []);

  return {
    capabilities,
    isUsingStylus,
    hasStylus: capabilities.hasStylus || capabilities.pointerTypes.includes('pen')
  };
};
