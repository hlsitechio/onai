
import React, { useState } from 'react';
import { motion } from "framer-motion";
import { Zap, ArrowRight, Play, X } from 'lucide-react';
import { toast } from 'sonner';
import HeroTextAnimations from './HeroTextAnimations';
import { Dialog, DialogContent, DialogOverlay } from '@/components/ui/dialog';

const HeroMainContent: React.FC = () => {
  const [showComingSoonDialog, setShowComingSoonDialog] = useState(false);

  const ctaVariants = {
    hidden: {
      opacity: 0,
      y: 30
    },
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
    transition: {
      duration: 0.3
    }
  };

  const secondaryButtonHover = {
    scale: 1.02,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    transition: {
      duration: 0.3
    }
  };

  const handleWatchDemo = () => {
    setShowComingSoonDialog(true);
  };

  return (
    <div className="text-center space-y-6">
      {/* Main hero text with enhanced animations */}
      <HeroTextAnimations className="relative" />

      {/* Enhanced CTA section */}
      <motion.div variants={ctaVariants} initial="hidden" animate="visible" className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        {/* Primary CTA with enhanced styling */}
        <motion.a href="/auth" whileHover={buttonHover} whileTap={{
        scale: 0.98
      }} className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-noteflow-600 via-purple-600 to-noteflow-500 hover:from-noteflow-500 hover:via-purple-500 hover:to-noteflow-400 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 shadow-2xl shadow-noteflow-500/30 overflow-hidden">
          {/* Background glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          <Zap className="h-5 w-5 relative z-10" />
          <span className="relative z-10">Start Writing Now</span>
          <ArrowRight className="h-5 w-5 relative z-10 transform group-hover:translate-x-1 transition-transform duration-300" />
        </motion.a>

        {/* Secondary CTA with modern glass effect */}
        <motion.button 
          onClick={handleWatchDemo}
          whileHover={secondaryButtonHover} 
          whileTap={{
            scale: 0.98
          }} 
          className="group inline-flex items-center gap-3 border border-white/20 backdrop-blur-sm bg-white/5 text-white px-6 py-4 rounded-full font-medium transition-all duration-300 hover:border-white/30"
        >
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
            <Play className="h-4 w-4 ml-0.5" />
          </div>
          <span>Watch Demo</span>
        </motion.button>
      </motion.div>

      {/* Enhanced trust indicators */}
      <motion.div initial={{
      opacity: 0
    }} animate={{
      opacity: 1
    }} transition={{
      delay: 1.6,
      duration: 0.8
    }} className="flex items-center justify-center gap-8 pt-8 text-sm text-gray-400">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span>Easy Sign Up</span>
          </div>
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

      {/* Coming Soon Dialog */}
      <Dialog open={showComingSoonDialog} onOpenChange={setShowComingSoonDialog}>
        <DialogContent className="max-w-md mx-auto bg-gradient-to-br from-gray-900 to-black border border-white/20 text-white">
          <div className="text-center py-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-noteflow-500 to-purple-600 flex items-center justify-center">
              <Play className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-noteflow-400 to-purple-400 bg-clip-text text-transparent">
              Coming Soon!
            </h3>
            <p className="text-gray-300 mb-6">
              We're working hard to create an amazing demo video for you. Stay tuned for the big reveal!
            </p>
            <button
              onClick={() => setShowComingSoonDialog(false)}
              className="px-6 py-3 bg-gradient-to-r from-noteflow-600 to-purple-600 hover:from-noteflow-500 hover:to-purple-500 text-white rounded-full font-medium transition-all duration-300 shadow-lg"
            >
              Got it!
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HeroMainContent;
