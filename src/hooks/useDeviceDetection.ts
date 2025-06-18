
import { useState, useEffect } from 'react';

export const useDeviceDetection = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      const userAgent = navigator.userAgent;
      
      // Check for mobile devices
      const mobileCheck = width < 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
      
      // Check for tablets
      const tabletCheck = width >= 768 && width < 1024;
      
      // Check for desktop
      const desktopCheck = width >= 1024;

      setIsMobile(mobileCheck && width < 768);
      setIsTablet(tabletCheck);
      setIsDesktop(desktopCheck);
    };

    // Initial check
    checkDevice();

    // Listen for resize events
    window.addEventListener('resize', checkDevice);

    return () => {
      window.removeEventListener('resize', checkDevice);
    };
  }, []);

  return {
    isMobile,
    isTablet,
    isDesktop,
    // Helper properties
    isTouchDevice: isMobile || isTablet,
    screenSize: isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop',
  };
};
