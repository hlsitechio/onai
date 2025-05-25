
import React from 'react';
import { motion } from 'framer-motion';

const DotGridBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 z-[-2] overflow-hidden pointer-events-none">
      {/* Base background color with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#050510] via-[#0A0A1B] to-[#050510]"></div>
      
      {/* Animated dot grid background */}
      <div className="absolute inset-0">
        {/* Grid dots pattern with subtle animation */}
        <motion.svg 
          className="w-full h-full opacity-25" 
          xmlns="http://www.w3.org/2000/svg" 
          width="100%" 
          height="100%"
          animate={{ y: [0, 4, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        >
          <defs>
            <pattern 
              id="dotGrid" 
              width="30" 
              height="30" 
              patternUnits="userSpaceOnUse"
            >
              <circle 
                cx="15" 
                cy="15" 
                r="1.5" 
                fill="rgba(120, 90, 220, 0.6)" 
              />
            </pattern>
            
            {/* Larger dots overlay pattern */}
            <pattern 
              id="dotGridLarge" 
              width="80" 
              height="80" 
              patternUnits="userSpaceOnUse"
            >
              <circle 
                cx="40" 
                cy="40" 
                r="2" 
                fill="rgba(150, 120, 255, 0.4)" 
              />
            </pattern>
            
            {/* Radial gradient for a subtle glow effect */}
            <radialGradient id="glow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
              <stop offset="0%" stopColor="rgba(120, 90, 220, 0.15)" />
              <stop offset="100%" stopColor="rgba(0, 0, 0, 0)" />
            </radialGradient>
          </defs>
          
          {/* Background rectangle with dot patterns */}
          <rect width="100%" height="100%" fill="url(#dotGrid)" />
          <rect width="100%" height="100%" fill="url(#dotGridLarge)" />
          
          {/* Central glow effect */}
          <rect width="100%" height="100%" fill="url(#glow)" />
        </motion.svg>
      </div>
      
      {/* Subtle color overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-noteflow-950/10"></div>
    </div>
  );
};

export default DotGridBackground;
