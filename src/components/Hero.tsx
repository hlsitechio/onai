
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";

const Hero = () => {
  const [displayText, setDisplayText] = useState('');
  const [currentPhrase, setCurrentPhrase] = useState(0);
  const phrases = ['Take Notes.', 'Freely.', 'Anywhere.'];
  const [isTyping, setIsTyping] = useState(true);
  
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
          }, 1000);
        }
      }, 100);
    } else {
      timer = setInterval(() => {
        if (index >= 0) {
          setDisplayText(text.substring(0, index));
          index--;
        } else {
          clearInterval(timer);
          setCurrentPhrase((prev) => (prev + 1) % phrases.length);
          setTimeout(() => {
            setIsTyping(true);
          }, 500);
        }
      }, 50);
    }

    return () => clearInterval(timer);
  }, [currentPhrase, isTyping]);

  const scrollToEditor = () => {
    const editorElement = document.getElementById('editor-section');
    if (editorElement) {
      editorElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-32 px-4 bg-black relative overflow-hidden min-h-[90vh] flex items-center">
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/lovable-uploads/2f5a493f-874d-4e1c-ab7d-50348b0f2c40.png" 
          alt="ONAI background" 
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
      </div>
      
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="flex flex-col items-center text-center">
          <h1 className="font-poppins font-bold text-5xl md:text-7xl mb-8 text-white">
            <span className="block h-28 text-noteflow-400">{displayText}<span className="animate-pulse">|</span></span>
          </h1>
          
          <p className="text-gray-300 text-xl md:text-2xl max-w-3xl mb-12 animate-fade-up glass-card p-8 rounded-lg bg-white/5 backdrop-blur-lg border border-white/10" style={{ animationDelay: "0.1s" }}>
            Create beautiful notes with our free, Word-style editor. No account needed. 
            Start typing and your notes save automatically.
          </p>
          
          <Button 
            onClick={scrollToEditor} 
            className="bg-noteflow-500/80 hover:bg-noteflow-600 text-white rounded-full px-8 py-6 text-lg font-medium flex items-center gap-2 animate-fade-up backdrop-blur-md border border-noteflow-400/30" 
            style={{ animationDelay: "0.2s" }}
          >
            Start Taking Notes
            <ArrowDown className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
