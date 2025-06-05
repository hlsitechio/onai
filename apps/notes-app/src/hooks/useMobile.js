import { useState, useEffect } from 'react';

/**
 * Custom hook for mobile responsiveness
 * 
 * Provides utilities for detecting mobile devices, screen sizes,
 * and managing mobile-specific state.
 */
export const useMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [screenSize, setScreenSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0
  });
  const [orientation, setOrientation] = useState('portrait');
  const [isTouch, setIsTouch] = useState(false);

  // Mobile breakpoints
  const breakpoints = {
    mobile: 768,
    tablet: 1024,
    desktop: 1280
  };

  useEffect(() => {
    const checkMobile = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setScreenSize({ width, height });
      setIsMobile(width <= breakpoints.mobile);
      setOrientation(width > height ? 'landscape' : 'portrait');
      
      // Check for touch capability
      setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };

    // Initial check
    checkMobile();

    // Listen for resize events
    window.addEventListener('resize', checkMobile);
    window.addEventListener('orientationchange', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('orientationchange', checkMobile);
    };
  }, []);

  // Helper functions
  const isSmallMobile = screenSize.width <= 375;
  const isTablet = screenSize.width > breakpoints.mobile && screenSize.width <= breakpoints.tablet;
  const isDesktop = screenSize.width > breakpoints.tablet;

  return {
    isMobile,
    isSmallMobile,
    isTablet,
    isDesktop,
    isTouch,
    screenSize,
    orientation,
    breakpoints
  };
};

/**
 * Custom hook for managing mobile sidebar state
 */
export const useMobileSidebar = () => {
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const { isMobile } = useMobile();

  const toggleNotes = () => {
    setIsNotesOpen(!isNotesOpen);
    if (isAIOpen) setIsAIOpen(false); // Close AI when opening notes
  };

  const toggleAI = () => {
    setIsAIOpen(!isAIOpen);
    if (isNotesOpen) setIsNotesOpen(false); // Close notes when opening AI
  };

  const closeAll = () => {
    setIsNotesOpen(false);
    setIsAIOpen(false);
  };

  // Auto-close sidebars when switching to desktop
  useEffect(() => {
    if (!isMobile) {
      closeAll();
    }
  }, [isMobile]);

  return {
    isNotesOpen,
    isAIOpen,
    toggleNotes,
    toggleAI,
    closeAll,
    setIsNotesOpen,
    setIsAIOpen
  };
};

/**
 * Custom hook for mobile-friendly touch gestures
 */
export const useTouchGestures = (element, options = {}) => {
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const minSwipeDistance = options.minSwipeDistance || 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && options.onSwipeLeft) {
      options.onSwipeLeft();
    }
    if (isRightSwipe && options.onSwipeRight) {
      options.onSwipeRight();
    }
  };

  useEffect(() => {
    if (!element) return;

    element.addEventListener('touchstart', onTouchStart);
    element.addEventListener('touchmove', onTouchMove);
    element.addEventListener('touchend', onTouchEnd);

    return () => {
      element.removeEventListener('touchstart', onTouchStart);
      element.removeEventListener('touchmove', onTouchMove);
      element.removeEventListener('touchend', onTouchEnd);
    };
  }, [element, touchStart, touchEnd]);

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd
  };
};

