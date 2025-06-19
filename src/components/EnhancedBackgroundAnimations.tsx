
import React from 'react';
import { motion } from 'framer-motion';

interface EnhancedBackgroundAnimationsProps {
  variant?: 'hero' | 'section' | 'minimal';
  className?: string;
}

const EnhancedBackgroundAnimations: React.FC<EnhancedBackgroundAnimationsProps> = ({ 
  variant = 'section', 
  className = '' 
}) => {
  const getAnimationConfig = () => {
    switch (variant) {
      case 'hero':
        return {
          duration: 20,
          opacity: [0.3, 0.6, 0.3],
          scale: [1, 1.3, 1],
          blur: 'blur-2xl'
        };
      case 'minimal':
        return {
          duration: 15,
          opacity: [0.1, 0.3, 0.1],
          scale: [1, 1.2, 1],
          blur: 'blur-xl'
        };
      default:
        return {
          duration: 18,
          opacity: [0.2, 0.4, 0.2],
          scale: [1, 1.2, 1],
          blur: 'blur-2xl'
        };
    }
  };

  const config = getAnimationConfig();

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* Primary gradient orb - Reduced size */}
      <motion.div
        className={`absolute top-20 left-10 w-64 h-64 rounded-full bg-gradient-to-r from-noteflow-600/25 to-purple-600/25 ${config.blur}`}
        animate={{
          scale: config.scale,
          opacity: config.opacity,
          rotate: [0, 180, 360],
          x: [0, 30, 0],
          y: [0, -20, 0]
        }}
        transition={{
          duration: config.duration,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Secondary gradient orb - Reduced size */}
      <motion.div
        className={`absolute bottom-20 right-10 w-56 h-56 rounded-full bg-gradient-to-r from-pink-500/20 to-cyan-500/20 ${config.blur}`}
        animate={{
          scale: [1.1, 1, 1.1],
          opacity: [0.3, 0.5, 0.3],
          rotate: [360, 180, 0],
          x: [0, -30, 0],
          y: [0, 15, 0]
        }}
        transition={{
          duration: config.duration + 5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Tertiary accent orb - Reduced size */}
      <motion.div
        className={`absolute top-1/2 left-1/2 w-48 h-48 rounded-full bg-gradient-to-r from-yellow-400/15 to-orange-500/15 ${config.blur} transform -translate-x-1/2 -translate-y-1/2`}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.15, 0.35, 0.15],
          rotate: [0, -180, -360],
          x: [-60, 60, -60],
          y: [-30, 30, -30]
        }}
        transition={{
          duration: config.duration + 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Floating particles - Smaller */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          className={`absolute w-2 h-2 rounded-full bg-gradient-to-r from-white/20 to-noteflow-400/30 blur-sm`}
          style={{
            top: `${25 + i * 20}%`,
            left: `${15 + i * 18}%`
          }}
          animate={{
            y: [0, -20, 0],
            x: [0, 15, 0],
            opacity: [0.2, 0.6, 0.2],
            scale: [1, 1.3, 1]
          }}
          transition={{
            duration: 6 + i * 1.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.4
          }}
        />
      ))}

      {/* Mesh gradient overlay - Reduced opacity */}
      <motion.div
        className="absolute inset-0 opacity-15"
        animate={{
          background: [
            'radial-gradient(circle at 20% 30%, rgba(120, 60, 255, 0.2) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(255, 60, 120, 0.15) 0%, transparent 50%)',
            'radial-gradient(circle at 70% 20%, rgba(120, 60, 255, 0.2) 0%, transparent 50%), radial-gradient(circle at 30% 80%, rgba(255, 60, 120, 0.15) 0%, transparent 50%)',
            'radial-gradient(circle at 20% 30%, rgba(120, 60, 255, 0.2) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(255, 60, 120, 0.15) 0%, transparent 50%)'
          ]
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  );
};

export default EnhancedBackgroundAnimations;
