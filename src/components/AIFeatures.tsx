import React from 'react';
import { Sparkles, Zap, BrainCircuit, Lightbulb, PenSquare, Stars } from 'lucide-react';
import { Button } from "@/components/ui/button";

const AIFeatures = () => {
  const features = [
    {
      icon: <Lightbulb className="h-10 w-10 text-amber-400" />,
      title: "Smart Suggestions",
      description: "Get intelligent recommendations to improve your writing in real-time",
      color: "from-amber-500/20 to-amber-700/20 border-amber-500/30",
      textColor: "text-amber-400",
      buttonColor: "bg-amber-500/20 hover:bg-amber-500/30 text-amber-300"
    },
    {
      icon: <BrainCircuit className="h-10 w-10 text-purple-400" />,
      title: "AI-Powered Summaries",
      description: "Quickly generate concise summaries of your lengthy notes with a single click",
      color: "from-purple-500/20 to-purple-700/20 border-purple-500/30",
      textColor: "text-purple-400",
      buttonColor: "bg-purple-500/20 hover:bg-purple-500/30 text-purple-300"
    },
    {
      icon: <PenSquare className="h-10 w-10 text-blue-400" />,
      title: "Content Generation",
      description: "Create drafts, outlines, and complete sections based on your initial ideas",
      color: "from-blue-500/20 to-blue-700/20 border-blue-500/30",
      textColor: "text-blue-400",
      buttonColor: "bg-blue-500/20 hover:bg-blue-500/30 text-blue-300"
    },
    {
      icon: <Stars className="h-10 w-10 text-indigo-400" />,
      title: "Style Enhancement",
      description: "Transform your writing with different tones and styles to match your audience",
      color: "from-indigo-500/20 to-indigo-700/20 border-indigo-500/30",
      textColor: "text-indigo-400",
      buttonColor: "bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300"
    }
  ];

  return (
    <section className="py-20 px-4 relative overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0 opacity-10 bg-blend-overlay">
        <img 
          src="/lovable-uploads/background.png" 
          alt="AI Background" 
          className="object-cover w-full h-full"
        />
      </div>
      
      {/* Gradient overlays for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/70 pointer-events-none"></div>
      
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center space-x-2 mb-3 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full px-4 py-1 border border-purple-500/30">
            <Sparkles className="h-4 w-4 text-purple-400" />
            <span className="text-sm font-medium text-blue-300">Powered by Google Gemini 2.5 Flash</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-blue-400 to-indigo-400">
            AI-Enhanced Note Taking
          </h2>
          
          <p className="text-gray-300 max-w-2xl mx-auto text-lg">
            Experience the power of advanced artificial intelligence to transform your note-taking experience.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="glass-panel-dark rounded-xl p-6 border border-white/5 relative group overflow-hidden"
            >
              {/* Gradient background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-20 group-hover:opacity-30 transition-opacity duration-500`}></div>
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="p-3 mb-4 rounded-lg bg-black/30 w-max">
                  {feature.icon}
                </div>
                
                <h3 className={`text-2xl font-bold mb-2 ${feature.textColor}`}>{feature.title}</h3>
                <p className="text-gray-300 mb-6 flex-grow">{feature.description}</p>
                
                <Button variant="outline" className={`mt-auto w-full justify-center ${feature.buttonColor} border-white/10`}>
                  Try It Now <Zap className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-center">
          <Button className="gradient-button text-white font-medium px-8 py-6 rounded-xl text-lg">
            <Sparkles className="mr-2 h-5 w-5" /> Upgrade to Pro for All AI Features
          </Button>
        </div>
      </div>
    </section>
  );
};

export default AIFeatures;
