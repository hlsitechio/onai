
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowDown, Zap, Layers } from "lucide-react";
import HeroTextAnimations from "./HeroTextAnimations";
import HeroFloatingIcons from "./HeroFloatingIcons";

const HeroMainContent = () => {
  const scrollToEditor = () => {
    const editorElement = document.getElementById('editor-section');
    if (editorElement) {
      editorElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  return (
    <div className="flex flex-col items-center text-center relative z-10">
      <HeroFloatingIcons />

      {/* Main heading with enhanced animation */}
      <motion.div 
        className="relative mb-6"
        variants={itemVariants}
      >
        <motion.div 
          className="relative bg-gradient-to-r from-black/40 via-black/20 to-black/40 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-2xl"
          whileHover={{ scale: 1.02, borderColor: 'rgba(120, 60, 255, 0.3)' }}
          transition={{ duration: 0.3 }}
        >
          <HeroTextAnimations className="font-poppins font-bold relative z-10" />
        </motion.div>
      </motion.div>
      
      {/* Enhanced subtitle text with more content */}
      <motion.div 
        className="relative max-w-2xl w-full mb-8 space-y-4"
        variants={itemVariants}
      >
        <motion.div 
          className="relative text-gray-200 text-lg md:text-xl p-4 rounded-2xl bg-gradient-to-r from-black/30 via-black/40 to-black/30 backdrop-blur-xl border border-white/20"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          <motion.p
            className="text-white relative z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <span className="font-medium text-white">AI-Enhanced Notes.</span>{' '}
            <span className="bg-gradient-to-r from-noteflow-400 to-purple-400 bg-clip-text text-transparent font-medium">Pure Simplicity.</span>
          </motion.p>
        </motion.div>

        {/* Additional descriptive text */}
        <motion.div 
          className="relative text-gray-300 text-base md:text-lg p-4 rounded-xl bg-gradient-to-r from-black/20 via-black/30 to-black/20 backdrop-blur-xl border border-white/10"
          whileHover={{ scale: 1.01 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
        >
          <p className="text-gray-200 relative z-10">
            Transform your thoughts into organized, intelligent notes with the power of artificial intelligence. 
            Experience seamless writing, smart suggestions, and effortless organization.
          </p>
        </motion.div>

        {/* Feature highlights */}
        <motion.div 
          className="relative text-sm md:text-base p-3 rounded-lg bg-gradient-to-r from-black/15 via-black/25 to-black/15 backdrop-blur-xl border border-white/5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
        >
          <p className="text-gray-400 relative z-10">
            ✨ Smart AI assistance • 🔒 Secure & private • 📱 Works everywhere • ⚡ Lightning fast
          </p>
        </motion.div>
      </motion.div>
      
      {/* Enhanced call to action button */}
      <motion.div 
        variants={itemVariants}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="mb-6"
      >
        <Button 
          onClick={scrollToEditor} 
          className="relative group overflow-hidden bg-gradient-to-r from-noteflow-600 via-purple-500 to-noteflow-400 hover:from-noteflow-500 hover:via-purple-400 hover:to-noteflow-300 text-white rounded-full px-10 py-6 text-lg font-medium flex items-center gap-3 transition-all duration-500 shadow-2xl shadow-noteflow-500/30 hover:shadow-noteflow-400/40" 
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ transform: 'skewX(-45deg) translateX(-100%)' }}
            animate={{ translateX: ['100%', '-100%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
          
          <motion.span 
            className="relative z-10 flex items-center gap-3 text-white font-semibold"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            Start Creating
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <ArrowDown className="h-5 w-5" />
            </motion.div>
          </motion.span>
        </Button>
      </motion.div>

      {/* Additional buttons for Features and Technologies */}
      <motion.div 
        className="flex flex-wrap items-center justify-center gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1, duration: 0.8 }}
      >
        <Button 
          variant="outline"
          className="border-white/20 text-gray-300 hover:text-white hover:bg-white/10 rounded-full px-6 py-3 flex items-center gap-2 transition-all duration-300"
        >
          <Zap className="h-4 w-4" />
          Features
        </Button>
        
        <Button 
          variant="outline"
          className="border-white/20 text-gray-300 hover:text-white hover:bg-white/10 rounded-full px-6 py-3 flex items-center gap-2 transition-all duration-300"
        >
          <Layers className="h-4 w-4" />
          Technologies
        </Button>
      </motion.div>
    </div>
  );
};

export default HeroMainContent;
