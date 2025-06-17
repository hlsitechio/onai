
import { motion } from "framer-motion";
import HeroBackgroundAnimations from "./hero/HeroBackgroundAnimations";
import HeroMainContent from "./hero/HeroMainContent";

const Hero = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  return (
    <section className="pt-20 pb-8 px-4 relative overflow-hidden min-h-[70vh] flex items-center">
      <HeroBackgroundAnimations />

      <motion.div 
        className="container mx-auto max-w-4xl relative z-10 w-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <HeroMainContent />
      </motion.div>
    </section>
  );
};

export default Hero;
