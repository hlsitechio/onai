
import { motion } from "framer-motion";
import HeroBackgroundAnimations from "./hero/HeroBackgroundAnimations";
import HeroMainContent from "./hero/HeroMainContent";

const Hero = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.1
      }
    }
  };

  return (
    <section className="pt-16 pb-12 px-4 relative overflow-hidden min-h-[80vh] flex items-center">
      <HeroBackgroundAnimations />

      <motion.div 
        className="container mx-auto max-w-5xl relative z-10 w-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <HeroMainContent />
      </motion.div>

      {/* Enhanced scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.8 }}
      >
        <motion.div
          className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center"
          animate={{ borderColor: ["rgba(255,255,255,0.3)", "rgba(120,60,255,0.6)", "rgba(255,255,255,0.3)"] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div
            className="w-1 h-3 bg-white/60 rounded-full mt-2"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
