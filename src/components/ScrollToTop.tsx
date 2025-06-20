
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
      className={`fixed bottom-8 right-8 z-50 group transition-all duration-700 ease-out ${
        isVisible 
          ? 'opacity-100 scale-100 translate-y-0 rotate-0' 
          : 'opacity-0 scale-50 translate-y-8 rotate-45 pointer-events-none'
      }`}
      aria-label="Scroll to top"
    >
      {/* Enhanced gradient border container with animation */}
      <div className="relative p-1 rounded-full bg-gradient-to-r from-noteflow-400 via-purple-500 to-pink-500 animate-spin-slow group-hover:animate-none transition-all duration-500">
        {/* Inner button with enhanced styling */}
        <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-black/95 to-gray-900/95 backdrop-blur-xl border border-white/20 flex items-center justify-center transition-all duration-500 ease-out group-hover:scale-110 group-hover:shadow-2xl group-hover:shadow-noteflow-500/40 group-active:scale-95">
          
          {/* Enhanced progress ring with glow */}
          <svg 
            className="absolute inset-0 w-full h-full -rotate-90 transition-all duration-500 group-hover:scale-105"
            viewBox="0 0 64 64"
          >
            <circle
              cx="32"
              cy="32"
              r="28"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="1"
              fill="none"
            />
            <circle
              cx="32"
              cy="32"
              r="28"
              stroke="url(#enhancedProgressGradient)"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${(scrollProgress / 100) * 175.93} 175.93`}
              className="transition-all duration-300 ease-out drop-shadow-lg"
              style={{
                filter: 'drop-shadow(0 0 4px rgba(120, 60, 255, 0.6))'
              }}
            />
            <defs>
              <linearGradient id="enhancedProgressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#783cff" />
                <stop offset="25%" stopColor="#a855f7" />
                <stop offset="50%" stopColor="#ec4899" />
                <stop offset="75%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
            </defs>
          </svg>
          
          {/* Enhanced arrow icon with multiple animation layers */}
          <div className="relative z-10 transition-transform duration-300 group-hover:scale-125 group-hover:-translate-y-1 group-active:scale-110 group-active:translate-y-0">
            <ArrowUp 
              size={22} 
              className="text-white transition-all duration-300 drop-shadow-lg" 
              style={{
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
              }}
            />
            {/* Animated background glow for arrow */}
            <div className="absolute inset-0 -z-10">
              <ArrowUp 
                size={22} 
                className="text-noteflow-400/60 animate-pulse transition-all duration-300 group-hover:text-noteflow-300/80" 
              />
            </div>
          </div>
          
          {/* Enhanced glow effects with multiple layers */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-noteflow-400/30 via-purple-500/30 to-pink-500/30 blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500 -z-10 animate-pulse" />
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400/20 to-emerald-400/20 blur-2xl opacity-0 group-hover:opacity-70 transition-all duration-700 -z-20" />
          
          {/* Ripple effect on hover */}
          <div className="absolute inset-0 rounded-full border-2 border-white/20 opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-700 ease-out -z-10" />
        </div>
      </div>

      {/* Floating particles effect */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-1 h-1 bg-gradient-to-r from-noteflow-400 to-purple-400 rounded-full opacity-0 group-hover:opacity-70 transition-all duration-700 ease-out`}
            style={{
              top: `${20 + i * 10}%`,
              left: `${20 + i * 10}%`,
              animationDelay: `${i * 100}ms`,
              transform: `translate(${Math.cos(i) * 20}px, ${Math.sin(i) * 20}px)`
            }}
          />
        ))}
      </div>
    </button>
  );
};

export default ScrollToTop;
