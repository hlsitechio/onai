
import { motion } from "framer-motion";

const HeroBackgroundAnimations = () => {
  return (
    <div className="absolute inset-0 z-0">
      {/* Main gradient */}
      <motion.div 
        className="absolute inset-0"
        animate={{
          background: [
            'radial-gradient(circle at 20% 50%, rgba(120, 60, 255, 0.4) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 60, 120, 0.3) 0%, transparent 50%), radial-gradient(circle at 40% 80%, rgba(60, 255, 200, 0.2) 0%, transparent 50%)',
            'radial-gradient(circle at 80% 30%, rgba(120, 60, 255, 0.4) 0%, transparent 50%), radial-gradient(circle at 20% 70%, rgba(255, 60, 120, 0.3) 0%, transparent 50%), radial-gradient(circle at 60% 20%, rgba(60, 255, 200, 0.2) 0%, transparent 50%)',
            'radial-gradient(circle at 40% 70%, rgba(120, 60, 255, 0.4) 0%, transparent 50%), radial-gradient(circle at 60% 30%, rgba(255, 60, 120, 0.3) 0%, transparent 50%), radial-gradient(circle at 20% 50%, rgba(60, 255, 200, 0.2) 0%, transparent 50%)'
          ]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />
      
      {/* Animated grid overlay */}
      <motion.div 
        className="absolute inset-0 opacity-10"
        animate={{
          backgroundPosition: ['0px 0px', '50px 50px'],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
          backgroundSize: '50px 50px'
        }}
      />
    </div>
  );
};

export default HeroBackgroundAnimations;
