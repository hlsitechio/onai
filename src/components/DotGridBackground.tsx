
import React from 'react';
import { motion } from 'framer-motion';

const DotGridBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Ultra dark base background */}
      <div className="absolute inset-0 bg-black"></div>
      
      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-950 to-black"></div>
      
      {/* Animated grid lines - Horizontal */}
      <motion.div 
        className="absolute inset-0 opacity-30"
        animate={{ 
          backgroundPosition: ['0px 0px', '0px 40px'],
        }}
        transition={{ 
          duration: 8, 
          repeat: Infinity, 
          ease: "linear" 
        }}
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 39px,
            rgba(75, 85, 99, 0.4) 40px,
            rgba(75, 85, 99, 0.4) 41px
          )`
        }}
      />
      
      {/* Animated grid lines - Vertical */}
      <motion.div 
        className="absolute inset-0 opacity-30"
        animate={{ 
          backgroundPosition: ['0px 0px', '40px 0px'],
        }}
        transition={{ 
          duration: 10, 
          repeat: Infinity, 
          ease: "linear" 
        }}
        style={{
          backgroundImage: `repeating-linear-gradient(
            90deg,
            transparent,
            transparent 39px,
            rgba(75, 85, 99, 0.4) 40px,
            rgba(75, 85, 99, 0.4) 41px
          )`
        }}
      />
      
      {/* Animated diagonal grip lines */}
      <motion.div 
        className="absolute inset-0 opacity-20"
        animate={{ 
          backgroundPosition: ['0px 0px', '80px 80px'],
        }}
        transition={{ 
          duration: 15, 
          repeat: Infinity, 
          ease: "linear" 
        }}
        style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 79px,
            rgba(120, 90, 220, 0.3) 80px,
            rgba(120, 90, 220, 0.3) 82px
          )`
        }}
      />
      
      {/* Pulsing dot overlay */}
      <motion.div 
        className="absolute inset-0 opacity-40"
        animate={{ 
          opacity: [0.2, 0.6, 0.2],
        }}
        transition={{ 
          duration: 4, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(120, 90, 220, 0.1) 1px, transparent 1px),
                           radial-gradient(circle at 75% 75%, rgba(120, 90, 220, 0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      />
      
      {/* Floating light effects */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full"
        animate={{
          x: [0, 100, -50, 0],
          y: [0, -100, 50, 0],
          scale: [1, 1.2, 0.8, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          background: 'radial-gradient(circle, rgba(120, 90, 220, 0.1) 0%, transparent 70%)',
          filter: 'blur(40px)'
        }}
      />
      
      <motion.div
        className="absolute top-3/4 right-1/4 w-80 h-80 rounded-full"
        animate={{
          x: [0, -80, 60, 0],
          y: [0, 80, -40, 0],
          scale: [1, 0.9, 1.1, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          background: 'radial-gradient(circle, rgba(100, 60, 255, 0.08) 0%, transparent 70%)',
          filter: 'blur(50px)'
        }}
      />
      
      {/* Noise texture overlay */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
      
      {/* Subtle vignette effect */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.8) 100%)'
        }}
      />
    </div>
  );
};

export default DotGridBackground;
