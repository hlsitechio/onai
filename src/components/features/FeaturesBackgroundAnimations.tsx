
import React from 'react';
import { motion } from "framer-motion";

const FeaturesBackgroundAnimations = () => {
  return (
    <>
      <motion.div 
        className="absolute top-20 left-10 w-32 h-32 rounded-full bg-gradient-to-r from-noteflow-400/20 to-purple-400/20 blur-xl"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
          rotate: [0, 180, 360]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <motion.div 
        className="absolute bottom-20 right-10 w-40 h-40 rounded-full bg-gradient-to-r from-green-400/20 to-blue-400/20 blur-xl"
        animate={{ 
          scale: [1.2, 1, 1.2],
          opacity: [0.4, 0.7, 0.4],
          rotate: [360, 180, 0]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
    </>
  );
};

export default FeaturesBackgroundAnimations;
