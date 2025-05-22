
import { useState, useEffect, useRef, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";

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

  return (
    <section className="py-32 px-4 relative overflow-hidden min-h-[90vh] flex items-center">
      {/* Animated gradient background */}
      <div 
        ref={gradientRef}
        className="absolute inset-0 z-0 bg-gradient-to-br from-black via-[#0A0C15] to-[#121631] overflow-hidden"
      >
        {/* Animated particles/stars */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_var(--mouse-x,_50%)_var(--mouse-y,_50%),_rgba(120,_60,_255,_0.1)_0%,_transparent_65%)] transition-opacity duration-500"></div>
        
        {/* Animated gradient orbs */}
        <div className="absolute -top-[20%] -left-[10%] w-[40%] h-[40%] rounded-full bg-gradient-to-r from-noteflow-600/20 to-noteflow-400/10 blur-[120px] animate-float-slow"></div>
        <div className="absolute -bottom-[15%] -right-[5%] w-[35%] h-[35%] rounded-full bg-gradient-to-l from-noteflow-400/20 to-purple-500/10 blur-[100px] animate-float-medium"></div>
        <div className="absolute top-[30%] right-[10%] w-[25%] h-[25%] rounded-full bg-gradient-to-tl from-blue-500/10 to-purple-600/5 blur-[80px] animate-float-fast"></div>
      </div>
      
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="flex flex-col items-center text-center">
          {/* Enhanced heading with text animation */}
          <div className="relative mb-8">
            <div className="absolute -inset-1 bg-gradient-to-r from-noteflow-400/30 to-purple-600/30 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
            <h1 className="font-poppins font-bold text-5xl md:text-7xl mb-2 text-transparent bg-clip-text bg-gradient-to-r from-white to-noteflow-200 relative">
              <span className="block h-28">
                {displayText}
                <span className={`${cursorVisible ? 'opacity-100' : 'opacity-0'} text-noteflow-400 transition-opacity duration-100`}>|</span>
              </span>
            </h1>
          </div>
          
          {/* Enhanced paragraph with premium design */}
          <div className="relative max-w-3xl w-full mb-12 group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-noteflow-600/30 to-purple-600/30 rounded-xl blur-lg opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse-slow"></div>
            <p className="relative text-gray-200 text-xl md:text-2xl p-8 rounded-xl bg-black/30 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.37)] group-hover:border-noteflow-400/20 transition-all">
              <span className="font-medium text-white">Create beautiful notes</span> with our free, Word-style editor. <span className="bg-gradient-to-r from-noteflow-400 to-purple-400 bg-clip-text text-transparent font-medium">No account needed</span>. 
              Start typing and your notes save automatically.
            </p>
          </div>
          
          {/* Enhanced button with animation */}
          <Button 
            onClick={scrollToEditor} 
            className="relative group overflow-hidden bg-gradient-to-r from-noteflow-600 to-noteflow-400 hover:from-noteflow-500 hover:to-noteflow-300 text-white rounded-full px-8 py-6 text-lg font-medium flex items-center gap-2 transition-all duration-300 shadow-lg shadow-noteflow-500/20 hover:shadow-noteflow-400/30 border border-noteflow-400/30 hover:border-noteflow-300/50" 
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-noteflow-400 to-noteflow-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></span>
            <span className="relative z-10 flex items-center gap-2">
              Start Taking Notes
              <ArrowDown className="h-5 w-5 group-hover:translate-y-1 transition-transform duration-300" />
            </span>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
