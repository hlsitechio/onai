
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
          opacity: [0.4, 0.8, 0.4],
          scale: [1, 1.5, 1],
          blur: 'blur-3xl'
        };
      case 'minimal':
        return {
          duration: 15,
          opacity: [0.2, 0.4, 0.2],
          scale: [1, 1.2, 1],
          blur: 'blur-2xl'
        };
      default:
        return {
          duration: 18,
          opacity: [0.3, 0.6, 0.3],
          scale: [1, 1.3, 1],
          blur: 'blur-3xl'
        };
    }
  };

  const config = getAnimationConfig();

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* Primary gradient orb */}
      <motion.div
        className={`absolute top-20 left-10 w-96 h-96 rounded-full bg-gradient-to-r from-noteflow-600/30 to-purple-600/30 ${config.blur}`}
        animate={{
          scale: config.scale,
          opacity: config.opacity,
          rotate: [0, 180, 360],
          x: [0, 50, 0],
          y: [0, -30, 0]
        }}
        transition={{
          duration: config.duration,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Secondary gradient orb */}
      <motion.div
        className={`absolute bottom-20 right-10 w-80 h-80 rounded-full bg-gradient-to-r from-pink-500/25 to-cyan-500/25 ${config.blur}`}
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.4, 0.7, 0.4],
          rotate: [360, 180, 0],
          x: [0, -40, 0],
          y: [0, 20, 0]
        }}
        transition={{
          duration: config.duration + 5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Tertiary accent orb */}
      <motion.div
        className={`absolute top-1/2 left-1/2 w-64 h-64 rounded-full bg-gradient-to-r from-yellow-400/20 to-orange-500/20 ${config.blur} transform -translate-x-1/2 -translate-y-1/2`}
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.2, 0.5, 0.2],
          rotate: [0, -180, -360],
          x: [-100, 100, -100],
          y: [-50, 50, -50]
        }}
        transition={{
          duration: config.duration + 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className={`absolute w-4 h-4 rounded-full bg-gradient-to-r from-white/30 to-noteflow-400/40 blur-sm`}
          style={{
            top: `${20 + i * 15}%`,
            left: `${10 + i * 12}%`
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, 20, 0],
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.5, 1]
          }}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.5
          }}
        />
      ))}

      {/* Mesh gradient overlay */}
      <motion.div
        className="absolute inset-0 opacity-20"
        animate={{
          background: [
            'radial-gradient(circle at 20% 30%, rgba(120, 60, 255, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(255, 60, 120, 0.2) 0%, transparent 50%)',
            'radial-gradient(circle at 70% 20%, rgba(120, 60, 255, 0.3) 0%, transparent 50%), radial-gradient(circle at 30% 80%, rgba(255, 60, 120, 0.2) 0%, transparent 50%)',
            'radial-gradient(circle at 20% 30%, rgba(120, 60, 255, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(255, 60, 120, 0.2) 0%, transparent 50%)'
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
