import React from 'react';
import { PenLine, Save, Share2, Sparkles } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: <PenLine className="h-6 w-6 text-blue-400" />,
      title: "Create Notes",
      description: "Start typing your thoughts in our beautiful editor with support for rich formatting and markdown."
    },
    {
      icon: <Sparkles className="h-6 w-6 text-purple-400" />,
      title: "AI Enhancement",
      description: "Use our AI features to improve your writing, get suggestions, or generate content based on your input."
    },
    {
      icon: <Save className="h-6 w-6 text-green-400" />,
      title: "Auto-Save",
      description: "Your notes are automatically saved as you type, so you never have to worry about losing your work."
    },
    {
      icon: <Share2 className="h-6 w-6 text-amber-400" />,
      title: "Share Instantly",
      description: "Share your notes with anyone using a simple link - no sign-up required for your recipients."
    }
  ];

  return (
    <section className="py-16 px-4 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-indigo-950/5 to-black/0 pointer-events-none"></div>
      
      <div className="container mx-auto max-w-6xl relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-3 text-white">
          How It Works
        </h2>
        <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
          Our platform makes note-taking effortless with these simple steps
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className="glass-panel-dark p-6 rounded-xl text-center relative group"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-700"></div>
              <div className="relative h-full flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-black/50 flex items-center justify-center mb-4 border border-white/10">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{step.title}</h3>
                <p className="text-gray-400">{step.description}</p>
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                  {index + 1}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
