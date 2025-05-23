
import { useState, useEffect, useRef, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowDown, Sparkles, FileText } from "lucide-react";
import { motion } from "framer-motion";

const Hero = () => {
  const [displayText, setDisplayText] = useState('');
  const [currentPhrase, setCurrentPhrase] = useState(0);
  const phrases = useMemo(() => ['Take Notes.', 'Think Clearly.', 'Stay Organized.', 'Boost Productivity.'], []);
  const [isTyping, setIsTyping] = useState(true);
  const [cursorVisible, setCursorVisible] = useState(true);
  const gradientRef = useRef<HTMLDivElement>(null);
  
  // Handle cursor blinking
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setCursorVisible(prev => !prev);
    }, 530);
    
    return () => clearInterval(cursorInterval);
  }, []);
  
  // Handle gradient animation on mouse move
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (gradientRef.current) {
        const rect = gradientRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        gradientRef.current.style.setProperty('--mouse-x', `${x}px`);
        gradientRef.current.style.setProperty('--mouse-y', `${y}px`);
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
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
          }, 2000); // Longer pause at the end of typing
        }
      }, 70); // Slightly faster typing
    } else {
      timer = setInterval(() => {
        if (index >= 0) {
          setDisplayText(text.substring(0, index));
          index--;
        } else {
          clearInterval(timer);
          setTimeout(() => {
            // Move to the next phrase with a cycle limit
            setCurrentPhrase((prev) => (prev + 1) % phrases.length);
            setIsTyping(true);
          }, 300);
        }
      }, 30); // Even faster erasing
    }

    return () => clearInterval(timer);
  }, [currentPhrase, isTyping, phrases]);

  const scrollToEditor = () => {
    const editorElement = document.getElementById('editor-section');
    if (editorElement) {
      editorElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Animation variants for staggered animations
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

  // Floating animation for decorative elements
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
    <section className="pt-32 pb-0 px-4 relative overflow-hidden min-h-[90vh] flex items-center">
      {/* Hero-specific overlay for mouse interaction */}
      <div 
        ref={gradientRef}
        className="absolute inset-0 z-0 overflow-hidden pointer-events-none"
      >
        {/* Interactive mouse-follow gradient effect */}
        <motion.div 
          className="absolute inset-0 bg-[radial-gradient(circle_at_var(--mouse-x,_50%)_var(--mouse-y,_50%),_rgba(120,_60,_255,_0.1)_0%,_transparent_45%)]" 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        />
      </div>
      
      <motion.div 
        className="container mx-auto max-w-6xl relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex flex-col items-center text-center">
          {/* Enhanced heading with advanced text animation */}
          <motion.div 
            className="relative mb-8"
            variants={itemVariants}
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-noteflow-400/30 to-purple-600/30 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
            <div className="relative bg-black/20 backdrop-blur-sm p-6 rounded-2xl border border-white/5 shadow-[0_10px_50px_rgba(76,29,149,0.1)]">
              <motion.h1 
                className="font-poppins font-bold text-6xl md:text-8xl mb-2 text-transparent bg-clip-text bg-gradient-to-r from-white to-noteflow-200 relative"
                animate={{ filter: ["brightness(1)", "brightness(1.2)", "brightness(1)"] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              >
                <span className="h-32 md:h-36 flex items-center justify-center">
                  {displayText}
                  <motion.span 
                    className={`text-noteflow-400`}
                    animate={{ opacity: cursorVisible ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                  >|</motion.span>
                </span>
              </motion.h1>
              
              {/* Floating sparkles decoration */}
              <motion.div 
                className="absolute -top-3 -right-3"
                variants={floatingVariants}
                animate="float"
              >
                <Sparkles className="w-8 h-8 text-noteflow-400/80" />
              </motion.div>
              
              <motion.div 
                className="absolute -bottom-3 -left-3"
                variants={floatingVariants}
                animate="float"
                transition={{ delay: 0.5 }}
              >
                <FileText className="w-7 h-7 text-noteflow-400/70" />
              </motion.div>
            </div>
          </motion.div>
          
          {/* Enhanced paragraph with premium design and animation */}
          <motion.div 
            className="relative max-w-3xl w-full mb-12 group"
            variants={itemVariants}
          >
            <motion.div 
              className="absolute -inset-0.5 bg-gradient-to-r from-noteflow-600/30 to-purple-600/30 rounded-xl blur-lg opacity-75"
              animate={{ opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            ></motion.div>
            <div className="relative text-gray-200 text-xl md:text-2xl p-8 rounded-xl bg-black/30 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.37)] group-hover:border-noteflow-400/20 transition-all">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                <span className="font-medium text-white">Create beautiful notes</span> with our free, Word-style editor. <span className="bg-gradient-to-r from-noteflow-400 to-purple-400 bg-clip-text text-transparent font-medium">No account needed</span>. 
                Start typing and your notes save automatically.
              </motion.p>
            </div>
          </motion.div>
          
          {/* Enhanced button with advanced animation */}
          <motion.div variants={itemVariants}>
            <Button 
              onClick={scrollToEditor} 
              className="relative group overflow-hidden bg-gradient-to-r from-noteflow-600 to-noteflow-400 hover:from-noteflow-500 hover:to-noteflow-300 text-white rounded-full px-8 py-6 text-lg font-medium flex items-center gap-2 transition-all duration-300 shadow-lg shadow-noteflow-500/20 hover:shadow-noteflow-400/30 border border-noteflow-400/30 hover:border-noteflow-300/50" 
            >
              <motion.span 
                className="absolute inset-0 w-full h-full bg-gradient-to-r from-noteflow-400 to-noteflow-600 opacity-0 group-hover:opacity-100 blur-xl"
                animate={{ 
                  background: [
                    "linear-gradient(to right, rgba(120, 60, 255, 0.5), rgba(150, 90, 255, 0.5))",
                    "linear-gradient(to right, rgba(150, 90, 255, 0.5), rgba(180, 120, 255, 0.5))",
                    "linear-gradient(to right, rgba(120, 60, 255, 0.5), rgba(150, 90, 255, 0.5))"
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              ></motion.span>
              <motion.span 
                className="relative z-10 flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                Start Taking Notes
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
