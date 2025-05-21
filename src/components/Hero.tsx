
import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";

const Hero = () => {
  const scrollToEditor = () => {
    const editorElement = document.getElementById('editor-section');
    if (editorElement) {
      editorElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-white to-noteflow-50">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col items-center text-center">
          <h1 className="font-poppins font-bold text-4xl md:text-6xl mb-6 animate-fade-up">
            Take Notes<span className="text-noteflow-600">.</span> Freely<span className="text-noteflow-600">.</span> Anywhere<span className="text-noteflow-600">.</span>
          </h1>
          
          <p className="text-slate-600 text-lg md:text-xl max-w-3xl mb-8 animate-fade-up" style={{ animationDelay: "0.1s" }}>
            Create beautiful notes with our free, Word-style editor. No account needed. 
            Start typing and your notes save automatically.
          </p>
          
          <Button 
            onClick={scrollToEditor} 
            className="bg-noteflow-500 hover:bg-noteflow-600 text-white rounded-full px-8 py-6 text-lg font-medium flex items-center gap-2 animate-fade-up" 
            style={{ animationDelay: "0.2s" }}
          >
            Start Taking Notes
            <ArrowDown className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
