
import React from 'react';
import { motion } from 'framer-motion';

const HeroBackgroundAnimations: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Main gradient orbs with enhanced effects */}
      <motion.div
        className="absolute top-20 left-10 w-80 h-80 rounded-full bg-gradient-to-r from-noteflow-600/20 to-purple-600/20 blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
          rotate: [0, 180, 360],
          x: [0, 50, 0],
          y: [0, -30, 0]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <motion.div
        className="absolute bottom-20 right-10 w-72 h-72 rounded-full bg-gradient-to-r from-pink-500/20 to-cyan-500/20 blur-3xl"
        animate={{
          scale: [1.1, 1, 1.1],
          opacity: [0.4, 0.7, 0.4],
          rotate: [360, 180, 0],
          x: [0, -40, 0],
          y: [0, 20, 0]
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Enhanced center orb */}
      <motion.div
        className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full bg-gradient-to-r from-yellow-400/15 to-orange-500/15 blur-2xl transform -translate-x-1/2 -translate-y-1/2"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
          rotate: [0, -180, -360],
          x: [-80, 80, -80],
          y: [-40, 40, -40]
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Enhanced floating particles */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-gradient-to-r from-white/30 to-noteflow-400/40 blur-sm"
          style={{
            top: `${25 + i * 8}%`,
            left: `${15 + i * 7}%`
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, 20, 0],
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.5, 1]
          }}
          transition={{
            duration: 6 + i * 1.2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.3
          }}
        />
      ))}

      {/* Enhanced mesh gradient overlay */}
      <motion.div
        className="absolute inset-0 opacity-20"
        animate={{
          background: [
            'radial-gradient(circle at 30% 40%, rgba(120, 60, 255, 0.2) 0%, transparent 50%), radial-gradient(circle at 70% 60%, rgba(255, 60, 120, 0.15) 0%, transparent 50%)',
            'radial-gradient(circle at 60% 30%, rgba(120, 60, 255, 0.2) 0%, transparent 50%), radial-gradient(circle at 40% 70%, rgba(255, 60, 120, 0.15) 0%, transparent 50%)',
            'radial-gradient(circle at 30% 40%, rgba(120, 60, 255, 0.2) 0%, transparent 50%), radial-gradient(circle at 70% 60%, rgba(255, 60, 120, 0.15) 0%, transparent 50%)'
          ]
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Additional accent elements */}
      <motion.div
        className="absolute top-1/4 right-1/4 w-32 h-32 rounded-full bg-gradient-to-r from-emerald-400/10 to-teal-500/10 blur-xl"
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.2, 0.5, 0.2],
          rotate: [0, 90, 180]
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      />
    </div>
  );
};

export default HeroBackgroundAnimations;
