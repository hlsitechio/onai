
import { useState, useEffect, useMemo } from 'react';
import { motion } from "framer-motion";

interface HeroTextAnimationsProps {
  className?: string;
}

const HeroTextAnimations = ({ className }: HeroTextAnimationsProps) => {
  const [displayText, setDisplayText] = useState('');
  const [currentPhrase, setCurrentPhrase] = useState(0);
  const phrases = useMemo(() => [
    'Think Clearly', 
    'Write Brilliantly', 
    'Create Fearlessly'
  ], []);
  const [isTyping, setIsTyping] = useState(true);
  const [cursorVisible, setCursorVisible] = useState(true);
  
  // Handle cursor blinking
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setCursorVisible(prev => !prev);
    }, 530);
    
    return () => clearInterval(cursorInterval);
  }, []);
  
  // Text typing animation
  useEffect(() => {
    const text = phrases[currentPhrase];
    let index = 0;
    let timer: NodeJS.Timeout;

    if (isTyping) {
      timer = setInterval(() => {
        if (index <= text.length) {
          setDisplayText(text.substring(0, index));
          index++;
        } else {
          clearInterval(timer);
          setTimeout(() => {
            setIsTyping(false);
          }, 2000);
        }
      }, 70);
    } else {
      timer = setInterval(() => {
        if (index >= 0) {
          setDisplayText(text.substring(0, index));
          index--;
        } else {
          clearInterval(timer);
          setTimeout(() => {
            setCurrentPhrase((prev) => (prev + 1) % phrases.length);
            setIsTyping(true);
          }, 300);
        }
      }, 30);
    }

    return () => clearInterval(timer);
  }, [currentPhrase, isTyping, phrases]);

  return (
    <motion.h1 
      className={`${className} relative z-10`}
      style={{ color: 'white' }}
    >
      <span className="h-16 md:h-20 flex items-center justify-center text-white">
        <span className="text-white font-bold text-4xl md:text-6xl">
          {displayText}
        </span>
        <motion.span 
          className="text-noteflow-400 ml-1"
          animate={{ opacity: cursorVisible ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >|</motion.span>
      </span>
    </motion.h1>
  );
};

export default HeroTextAnimations;
