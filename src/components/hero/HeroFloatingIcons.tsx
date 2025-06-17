
import { motion } from "framer-motion";
import { Brain, Zap, Sparkles } from "lucide-react";

const HeroFloatingIcons = () => {
  const floatingVariants = {
    float: {
      y: ['-10%', '10%'],
      x: ['-5%', '5%'],
      rotate: [0, 5, -5, 0],
      transition: {
        repeat: Infinity,
        repeatType: 'reverse' as const,
        duration: 4,
        ease: 'easeInOut'
      }
    }
  };

  const pulseVariants = {
    pulse: {
      scale: [1, 1.05, 1],
      opacity: [0.7, 1, 0.7],
      transition: {
        repeat: Infinity,
        duration: 2,
        ease: 'easeInOut'
      }
    }
  };

  return (
    <>
      {/* Floating Brain icon */}
      <motion.div 
        className="absolute top-10 left-1/4 z-0"
        variants={floatingVariants}
        animate="float"
      >
        <motion.div variants={pulseVariants} animate="pulse">
          <Brain className="w-8 h-8 text-noteflow-400/60" />
        </motion.div>
      </motion.div>
      
      {/* Floating Zap icon */}
      <motion.div 
        className="absolute top-20 right-1/4 z-0"
        variants={floatingVariants}
        animate="float"
        transition={{ delay: 1 }}
      >
        <motion.div variants={pulseVariants} animate="pulse">
          <Zap className="w-6 h-6 text-purple-400/60" />
        </motion.div>
      </motion.div>

      {/* Sparkles icon in main heading */}
      <motion.div 
        className="absolute -top-4 -right-4"
        variants={floatingVariants}
        animate="float"
      >
        <Sparkles className="w-10 h-10 text-noteflow-400/80" />
      </motion.div>
    </>
  );
};

export default HeroFloatingIcons;
