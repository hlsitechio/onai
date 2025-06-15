
import { useState, useEffect, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowDown, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const Hero = () => {
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

  const scrollToEditor = () => {
    const editorElement = document.getElementById('editor-section');
    if (editorElement) {
      editorElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

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

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  const floatingVariants = {
    float: {
      y: ['-5%', '5%'],
      transition: {
        repeat: Infinity,
        repeatType: 'reverse' as const,
        duration: 2,
        ease: 'easeInOut'
      }
    }
  };

  return (
    <section className="pt-32 pb-16 px-4 relative overflow-hidden">
      <motion.div 
        className="container mx-auto max-w-4xl relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex flex-col items-center text-center">
          {/* Simplified heading */}
          <motion.div 
            className="relative mb-8"
            variants={itemVariants}
          >
            <div className="relative bg-black/20 backdrop-blur-sm p-6 rounded-2xl border border-white/5">
              <motion.h1 
                className="font-poppins font-bold text-5xl md:text-7xl mb-2 text-transparent bg-clip-text bg-gradient-to-r from-white to-noteflow-200 relative"
              >
                <span className="h-24 md:h-32 flex items-center justify-center">
                  {displayText}
                  <motion.span 
                    className={`text-noteflow-400`}
                    animate={{ opacity: cursorVisible ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                  >|</motion.span>
                </span>
              </motion.h1>
              
              <motion.div 
                className="absolute -top-3 -right-3"
                variants={floatingVariants}
                animate="float"
              >
                <Sparkles className="w-8 h-8 text-noteflow-400/80" />
              </motion.div>
            </div>
          </motion.div>
          
          {/* Simplified description */}
          <motion.div 
            className="relative max-w-2xl w-full mb-8"
            variants={itemVariants}
          >
            <div className="relative text-gray-200 text-lg md:text-xl p-6 rounded-xl bg-black/30 backdrop-blur-xl border border-white/10">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                <span className="font-medium text-white">Simple. Fast. Powerful.</span> 
                <span className="bg-gradient-to-r from-noteflow-400 to-purple-400 bg-clip-text text-transparent font-medium"> AI-enhanced notes that just work.</span>
              </motion.p>
            </div>
          </motion.div>
          
          {/* Call to action button */}
          <motion.div variants={itemVariants}>
            <Button 
              onClick={scrollToEditor} 
              className="relative group overflow-hidden bg-gradient-to-r from-noteflow-600 to-noteflow-400 hover:from-noteflow-500 hover:to-noteflow-300 text-white rounded-full px-8 py-6 text-lg font-medium flex items-center gap-2 transition-all duration-300 shadow-lg shadow-noteflow-500/20 hover:shadow-noteflow-400/30" 
            >
              <motion.span 
                className="relative z-10 flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                Start Writing
                <motion.div
                  animate={{ y: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <ArrowDown className="h-5 w-5" />
                </motion.div>
              </motion.span>
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
