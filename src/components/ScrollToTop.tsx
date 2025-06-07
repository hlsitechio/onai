import React, { useState, useEffect, useRef } from 'react';
import { ArrowUp } from 'lucide-react';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const maxScroll = useRef(0);

  // Show button when page is scrolled down and track scroll position
  useEffect(() => {
    const handleScroll = () => {
      // Get current scroll position and document height
      const currentScrollY = window.scrollY;
      const documentHeight = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.offsetHeight
      );
      const windowHeight = window.innerHeight;
      const maxScrollablePosition = documentHeight - windowHeight;
      
      // Update max scroll position seen
      if (currentScrollY > maxScroll.current) {
        maxScroll.current = currentScrollY;
      }
      
      // Calculate scroll percentage (0 to 100)
      const scrollPercentage = Math.min(
        Math.max(0, Math.round((currentScrollY / maxScrollablePosition) * 100)),
        100
      );
      
      setScrollPosition(scrollPercentage);
      setIsVisible(currentScrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top smoothly
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Calculate position based on scroll percentage
  // Button starts at bottom-20 and moves up to bottom-6 as user scrolls to bottom
  const buttonBottomPosition = 20 - ((scrollPosition / 100) * 14);

  return (
    <button
      onClick={scrollToTop}
      style={{ bottom: `${buttonBottomPosition}rem` }}
      className={`fixed right-6 z-50 p-3 rounded-full bg-indigo-600 hover:bg-indigo-700 shadow-lg border border-indigo-400/30 transition-all duration-200 backdrop-blur-sm ${
        isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75 pointer-events-none'
      }`}
      aria-label="Scroll to top"
    >
      <ArrowUp size={22} className="text-white" />
    </button>
  );
};

export default ScrollToTop;
