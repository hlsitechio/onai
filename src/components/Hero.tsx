
import { useState, useEffect, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowDown, Sparkles, Zap, Brain } from "lucide-react";
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
    <section className="pt-32 pb-16 px-4 relative overflow-hidden min-h-screen">
      {/* Enhanced animated background */}
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

      <motion.div 
        className="container mx-auto max-w-4xl relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex flex-col items-center text-center">
          {/* Floating icons */}
          <motion.div 
            className="absolute top-20 left-1/4 z-0"
            variants={floatingVariants}
            animate="float"
          >
            <motion.div variants={pulseVariants} animate="pulse">
              <Brain className="w-8 h-8 text-noteflow-400/60" />
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="absolute top-40 right-1/4 z-0"
            variants={floatingVariants}
            animate="float"
            transition={{ delay: 1 }}
          >
            <motion.div variants={pulseVariants} animate="pulse">
              <Zap className="w-6 h-6 text-purple-400/60" />
            </motion.div>
          </motion.div>

          {/* Main heading with enhanced animation */}
          <motion.div 
            className="relative mb-8"
            variants={itemVariants}
          >
            <motion.div 
              className="relative bg-gradient-to-r from-black/40 via-black/20 to-black/40 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl"
              whileHover={{ scale: 1.02, borderColor: 'rgba(120, 60, 255, 0.3)' }}
              transition={{ duration: 0.3 }}
            >
              <motion.h1 
                className="font-poppins font-bold text-5xl md:text-7xl mb-2 text-transparent bg-clip-text bg-gradient-to-r from-white via-noteflow-200 to-purple-300 relative"
              >
                <span className="h-24 md:h-32 flex items-center justify-center">
                  {displayText}
                  <motion.span 
                    className="text-noteflow-400"
                    animate={{ opacity: cursorVisible ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                  >|</motion.span>
                </span>
              </motion.h1>
              
              <motion.div 
                className="absolute -top-4 -right-4"
                variants={floatingVariants}
                animate="float"
              >
                <Sparkles className="w-10 h-10 text-noteflow-400/80" />
              </motion.div>
            </motion.div>
          </motion.div>
          
          {/* Simplified description with enhanced styling */}
          <motion.div 
            className="relative max-w-xl w-full mb-12"
            variants={itemVariants}
          >
            <motion.div 
              className="relative text-gray-200 text-xl md:text-2xl p-6 rounded-2xl bg-gradient-to-r from-black/30 via-black/40 to-black/30 backdrop-blur-xl border border-white/20"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                <span className="font-medium text-white">AI-Enhanced Notes.</span> 
                <span className="bg-gradient-to-r from-noteflow-400 to-purple-400 bg-clip-text text-transparent font-medium"> Pure Simplicity.</span>
              </motion.p>
            </motion.div>
          </motion.div>
          
          {/* Enhanced call to action button */}
          <motion.div 
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              onClick={scrollToEditor} 
              className="relative group overflow-hidden bg-gradient-to-r from-noteflow-600 via-purple-500 to-noteflow-400 hover:from-noteflow-500 hover:via-purple-400 hover:to-noteflow-300 text-white rounded-full px-12 py-8 text-xl font-medium flex items-center gap-3 transition-all duration-500 shadow-2xl shadow-noteflow-500/30 hover:shadow-noteflow-400/40" 
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ transform: 'skewX(-45deg) translateX(-100%)' }}
                animate={{ translateX: ['100%', '-100%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
              
              <motion.span 
                className="relative z-10 flex items-center gap-3"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                Start Creating
                <motion.div
                  animate={{ y: [0, 6, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <ArrowDown className="h-6 w-6" />
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
