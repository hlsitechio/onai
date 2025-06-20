
import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const documentHeight = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.offsetHeight
      );
      const windowHeight = window.innerHeight;
      const maxScrollablePosition = documentHeight - windowHeight;
      
      // Calculate scroll progress (0 to 100)
      const progress = Math.min(
        Math.max(0, (currentScrollY / maxScrollablePosition) * 100),
        100
      );
      
      setScrollProgress(progress);
      setIsVisible(currentScrollY > 400);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-8 right-8 z-50 group transition-all duration-500 hover:animate-bounce ${
        isVisible 
          ? 'opacity-100 scale-100 translate-y-0' 
          : 'opacity-0 scale-75 translate-y-4 pointer-events-none'
      }`}
      aria-label="Scroll to top"
    >
      {/* Gradient border container */}
      <div className="relative p-1 rounded-full bg-gradient-to-r from-noteflow-400 via-purple-500 to-pink-500 animate-pulse group-hover:animate-none">
        {/* Inner button */}
        <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-black/90 to-gray-900/90 backdrop-blur-lg border border-white/10 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-2xl group-hover:shadow-noteflow-500/30">
          {/* Progress ring */}
          <svg 
            className="absolute inset-0 w-full h-full -rotate-90 transition-all duration-300"
            viewBox="0 0 56 56"
          >
            <circle
              cx="28"
              cy="28"
              r="26"
              stroke="url(#progressGradient)"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${(scrollProgress / 100) * 163.36} 163.36`}
              className="transition-all duration-300"
            />
            <defs>
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#783cff" />
                <stop offset="50%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
            </defs>
          </svg>
          
          {/* Arrow icon with gradient */}
          <div className="relative z-10">
            <ArrowUp 
              size={20} 
              className="text-white transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-0.5" 
            />
          </div>
          
          {/* Glow effect */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-noteflow-400/20 via-purple-500/20 to-pink-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
        </div>
      </div>
    </button>
  );
};

export default ScrollToTop;
