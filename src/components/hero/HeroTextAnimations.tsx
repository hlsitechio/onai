
import React from 'react';
import { motion } from "framer-motion";

interface HeroTextAnimationsProps {
  className?: string;
}

const HeroTextAnimations: React.FC<HeroTextAnimationsProps> = ({ className = "" }) => {
  const titleVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const wordVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      rotateX: -90,
      scale: 0.8
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
        duration: 0.8
      }
    }
  };

  const subtitleVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        delay: 0.8, 
        duration: 0.8,
        type: "spring",
        stiffness: 100
      }
    },
    glow: {
      textShadow: [
        "0 0 20px rgba(255, 255, 255, 0.8), 0 0 40px rgba(96, 165, 250, 0.6)",
        "0 0 30px rgba(147, 51, 234, 0.8), 0 0 60px rgba(255, 255, 255, 0.6)",
        "0 0 20px rgba(255, 255, 255, 0.8), 0 0 40px rgba(96, 165, 250, 0.6)"
      ],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const words = ["Write", "Smarter", "with", "AI"];
  const subtitle = "The Ultimate Note-Taking Experience";

  return (
    <div className={className}>
      {/* Main Title */}
      <motion.div
        variants={titleVariants}
        initial="hidden"
        animate="visible"
        className="mb-4"
      >
        <div className="text-5xl md:text-7xl lg:text-8xl leading-tight">
          {words.map((word, index) => (
            <motion.span
              key={word}
              variants={wordVariants}
              className={`inline-block mr-4 md:mr-6 font-bold ${
                index === 0 
                  ? "bg-gradient-to-r from-white via-blue-200 to-cyan-300 bg-clip-text text-transparent"
                  : index === 1
                  ? "bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent"
                  : index === 2
                  ? "bg-gradient-to-r from-white via-gray-100 to-blue-200 bg-clip-text text-transparent"
                  : "bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent"
              }`}
              whileHover={{
                scale: 1.1,
                rotate: [0, -2, 2, 0],
                transition: { duration: 0.3 }
              }}
              style={{
                textShadow: index === 1 ? "0 0 30px rgba(96, 165, 250, 0.5)" : "0 0 20px rgba(255, 255, 255, 0.3)"
              }}
            >
              {word}
            </motion.span>
          ))}
        </div>
      </motion.div>

      {/* Animated Subtitle */}
      <motion.div
        variants={subtitleVariants}
        initial="hidden"
        animate={["visible", "glow"]}
        className="text-xl md:text-2xl lg:text-3xl"
      >
        <span className="bg-gradient-to-r from-white via-blue-100 to-cyan-200 bg-clip-text text-transparent font-light tracking-wide">
          {subtitle}
        </span>
      </motion.div>

      {/* Decorative Elements */}
      <motion.div
        className="absolute -top-8 -left-8 w-4 h-4 bg-cyan-400 rounded-full"
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.5, 1, 0.5],
          rotate: [0, 180, 360]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <motion.div
        className="absolute -bottom-6 -right-6 w-3 h-3 bg-purple-400 rounded-full"
        animate={{
          scale: [1, 1.8, 1],
          opacity: [0.4, 0.9, 0.4],
          rotate: [360, 180, 0]
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />

      <motion.div
        className="absolute top-1/2 -right-12 w-2 h-2 bg-pink-400 rounded-full"
        animate={{
          scale: [1, 2, 1],
          opacity: [0.3, 0.8, 0.3],
          x: [0, 10, 0],
          y: [0, -10, 0]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      />
    </div>
  );
};

export default HeroTextAnimations;
