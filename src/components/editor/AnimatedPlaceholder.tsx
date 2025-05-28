
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AnimatedPlaceholderProps {
  isVisible?: boolean;
  isFocusMode?: boolean;
}

const AnimatedPlaceholder: React.FC<AnimatedPlaceholderProps> = ({ isVisible = true, isFocusMode = false }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const writingIdeas = [
    "Start typing your note here... 💡",
    "Write about your goals for this week...",
    "Capture that brilliant idea you just had...",
    "Jot down your thoughts on today's meeting...",
    "Plan your next big project...",
    "Write a letter to your future self...",
    "Document what you learned today...",
    "Brainstorm solutions to a challenge...",
    "Record your creative inspiration...",
    "Outline your next adventure..."
  ];

  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % writingIdeas.length);
    }, 3000); // Change every 3 seconds

    return () => clearInterval(interval);
  }, [isVisible, writingIdeas.length]);

  if (!isVisible) return null;

  return (
    <div className="absolute top-6 left-6 pointer-events-none">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ 
            duration: 0.5,
            ease: "easeInOut"
          }}
          className="text-slate-400 text-lg select-none"
        >
          {writingIdeas[currentIndex]}
        </motion.div>
      </AnimatePresence>
      
      {/* Typing indicator */}
      <motion.div
        className="inline-block w-0.5 h-5 bg-slate-400 ml-1"
        animate={{ opacity: [1, 0, 1] }}
        transition={{ 
          duration: 1,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  );
};

export default AnimatedPlaceholder;
