
import React from 'react';
import { motion } from "framer-motion";
import { Zap, ArrowRight, Play } from 'lucide-react';
import HeroTextAnimations from './HeroTextAnimations';

const HeroMainContent: React.FC = () => {
  const ctaVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        delay: 1.2, 
        duration: 0.8,
        type: "spring",
        stiffness: 100
      }
    }
  };

  const buttonHover = {
    scale: 1.05,
    boxShadow: "0 20px 40px rgba(120, 60, 255, 0.3)",
    transition: { duration: 0.3 }
  };

  const secondaryButtonHover = {
    scale: 1.02,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    transition: { duration: 0.3 }
  };

  return (
    <div className="text-center space-y-6">
      {/* Main hero text with enhanced animations */}
      <HeroTextAnimations className="relative" />

      {/* Enhanced CTA section */}
      <motion.div
        variants={ctaVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
      >
        {/* Primary CTA with enhanced styling */}
        <motion.a
          href="#editor-section"
          whileHover={buttonHover}
          whileTap={{ scale: 0.98 }}
          className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-noteflow-600 via-purple-600 to-noteflow-500 hover:from-noteflow-500 hover:via-purple-500 hover:to-noteflow-400 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 shadow-2xl shadow-noteflow-500/30 overflow-hidden"
        >
          {/* Background glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          <Zap className="h-5 w-5 relative z-10" />
          <span className="relative z-10">Start Writing Now</span>
          <ArrowRight className="h-5 w-5 relative z-10 transform group-hover:translate-x-1 transition-transform duration-300" />
        </motion.a>

        {/* Secondary CTA with modern glass effect */}
        <motion.button
          whileHover={secondaryButtonHover}
          whileTap={{ scale: 0.98 }}
          className="group inline-flex items-center gap-3 border border-white/20 backdrop-blur-sm bg-white/5 text-white px-6 py-4 rounded-full font-medium transition-all duration-300 hover:border-white/30"
        >
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
            <Play className="h-4 w-4 ml-0.5" />
          </div>
          <span>Watch Demo</span>
        </motion.button>
      </motion.div>

      {/* Enhanced trust indicators */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.8 }}
        className="flex items-center justify-center gap-8 pt-8 text-sm text-gray-400"
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span>No signup required</span>
        </div>
        <div className="w-1 h-4 bg-white/20" />
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
          <span>Free forever</span>
        </div>
        <div className="w-1 h-4 bg-white/20" />
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
          <span>AI-powered</span>
        </div>
      </motion.div>
    </div>
  );
};

export default HeroMainContent;
