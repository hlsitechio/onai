
import React from 'react';
import { motion } from 'framer-motion';

const DotGridBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Ultra dark base background with enhanced depth */}
      <div className="absolute inset-0 bg-black"></div>
      
      {/* Multi-layered dark gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-950 to-black"></div>
      <div className="absolute inset-0 bg-gradient-to-tl from-black via-gray-900 to-black opacity-80"></div>
      
      {/* Enhanced animated grid lines - Horizontal with varying opacities */}
      <motion.div 
        className="absolute inset-0 opacity-40"
        animate={{ 
          backgroundPosition: ['0px 0px', '0px 40px'],
        }}
        transition={{ 
          duration: 6, 
          repeat: Infinity, 
          ease: "linear" 
        }}
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 39px,
            rgba(75, 85, 99, 0.6) 40px,
            rgba(75, 85, 99, 0.6) 41px
          )`
        }}
      />
      
      {/* Enhanced animated grid lines - Vertical with glow */}
      <motion.div 
        className="absolute inset-0 opacity-40"
        animate={{ 
          backgroundPosition: ['0px 0px', '40px 0px'],
        }}
        transition={{ 
          duration: 8, 
          repeat: Infinity, 
          ease: "linear" 
        }}
        style={{
          backgroundImage: `repeating-linear-gradient(
            90deg,
            transparent,
            transparent 39px,
            rgba(75, 85, 99, 0.6) 40px,
            rgba(75, 85, 99, 0.6) 41px
          )`
        }}
      />
      
      {/* Enhanced diagonal grip lines with stronger colors */}
      <motion.div 
        className="absolute inset-0 opacity-30"
        animate={{ 
          backgroundPosition: ['0px 0px', '80px 80px'],
        }}
        transition={{ 
          duration: 12, 
          repeat: Infinity, 
          ease: "linear" 
        }}
        style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 79px,
            rgba(120, 90, 220, 0.5) 80px,
            rgba(120, 90, 220, 0.5) 82px
          )`
        }}
      />
      
      {/* Secondary diagonal lines for cross-hatch effect */}
      <motion.div 
        className="absolute inset-0 opacity-25"
        animate={{ 
          backgroundPosition: ['0px 0px', '-80px -80px'],
        }}
        transition={{ 
          duration: 15, 
          repeat: Infinity, 
          ease: "linear" 
        }}
        style={{
          backgroundImage: `repeating-linear-gradient(
            -45deg,
            transparent,
            transparent 79px,
            rgba(220, 90, 120, 0.4) 80px,
            rgba(220, 90, 120, 0.4) 82px
          )`
        }}
      />
      
      {/* Enhanced pulsing dot overlay with multiple layers */}
      <motion.div 
        className="absolute inset-0 opacity-50"
        animate={{ 
          opacity: [0.3, 0.8, 0.3],
        }}
        transition={{ 
          duration: 3, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(120, 90, 220, 0.2) 1px, transparent 1px),
                           radial-gradient(circle at 75% 75%, rgba(120, 90, 220, 0.2) 1px, transparent 1px),
                           radial-gradient(circle at 50% 50%, rgba(220, 120, 90, 0.15) 1px, transparent 1px)`,
          backgroundSize: '50px 50px, 50px 50px, 25px 25px'
        }}
      />
      
      {/* Additional scattered dot pattern */}
      <motion.div 
        className="absolute inset-0 opacity-30"
        animate={{ 
          opacity: [0.2, 0.6, 0.2],
          backgroundPosition: ['0px 0px', '25px 25px'],
        }}
        transition={{ 
          duration: 5, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        style={{
          backgroundImage: `radial-gradient(circle at 33% 66%, rgba(90, 220, 120, 0.1) 1px, transparent 1px),
                           radial-gradient(circle at 66% 33%, rgba(220, 220, 90, 0.1) 1px, transparent 1px)`,
          backgroundSize: '75px 75px'
        }}
      />
      
      {/* Enhanced floating light effects - Multiple orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full"
        animate={{
          x: [0, 120, -60, 0],
          y: [0, -120, 60, 0],
          scale: [1, 1.3, 0.7, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          background: 'radial-gradient(circle, rgba(120, 90, 220, 0.15) 0%, rgba(120, 90, 220, 0.05) 50%, transparent 80%)',
          filter: 'blur(40px)'
        }}
      />
      
      <motion.div
        className="absolute top-3/4 right-1/4 w-80 h-80 rounded-full"
        animate={{
          x: [0, -100, 80, 0],
          y: [0, 100, -50, 0],
          scale: [1, 0.8, 1.2, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          background: 'radial-gradient(circle, rgba(100, 60, 255, 0.12) 0%, rgba(100, 60, 255, 0.04) 50%, transparent 80%)',
          filter: 'blur(50px)'
        }}
      />
      
      {/* Additional floating orb */}
      <motion.div
        className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full"
        animate={{
          x: [0, 80, -40, 0],
          y: [0, -80, 40, 0],
          scale: [1, 1.1, 0.9, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          background: 'radial-gradient(circle, rgba(220, 120, 90, 0.1) 0%, rgba(220, 120, 90, 0.03) 50%, transparent 80%)',
          filter: 'blur(45px)'
        }}
      />
      
      {/* Enhanced noise texture overlay with stronger effect */}
      <div 
        className="absolute inset-0 opacity-8"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
      
      {/* Enhanced vignette effect with multiple layers */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at center, transparent 20%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0.9) 100%),
            radial-gradient(ellipse 150% 100% at center top, transparent 40%, rgba(0,0,0,0.6) 100%)
          `
        }}
      />
      
      {/* Subtle animated scanlines for extra tech feel */}
      <motion.div
        className="absolute inset-0 opacity-5"
        animate={{
          backgroundPosition: ['0px 0px', '0px 100px'],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 3px,
            rgba(120, 90, 220, 0.1) 4px,
            rgba(120, 90, 220, 0.1) 4px
          )`
        }}
      />
    </div>
  );
};

export default DotGridBackground;
