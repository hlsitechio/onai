
import React from 'react';
import { useFocusMode } from '@/contexts';
import { 
  Lightbulb, 
  BrainCircuit, 
  EyeOff, 
  Palette, 
  Share2, 
  Cloud, 
  Sparkles, 
  Zap, 
  ArrowUpRight,
  Layout,
  Keyboard
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';

const FeatureShowcase = () => {
  // Use focus mode context to determine visibility
  const { isFocusMode } = useFocusMode();
  
  // Don't render anything when focus mode is active
  if (isFocusMode) return null;

  const features = [
    {
      category: "Essential Features",
      items: [
        {
          icon: <EyeOff className="h-10 w-10 text-purple-400" />,
          title: "Focus Mode",
          description: "Eliminate distractions with our immersive focus mode that highlights only your note panel",
          color: "from-purple-600/20 to-purple-800/20 border-purple-600/30",
          textColor: "text-purple-400",
          buttonColor: "bg-purple-600/20 hover:bg-purple-500/30 text-purple-300",
          isNew: true
        },
        {
          icon: <BrainCircuit className="h-10 w-10 text-purple-400" />,
          title: "AI Assistant",
          description: "Smart AI tools that help you summarize, analyze, and enhance your writing",
          color: "from-purple-500/20 to-purple-700/20 border-purple-500/30",
          textColor: "text-purple-400",
          buttonColor: "bg-purple-500/20 hover:bg-purple-500/30 text-purple-300"
        },
        {
          icon: <Sparkles className="h-10 w-10 text-blue-400" />,
          title: "Content Generation",
          description: "Create drafts, outlines, and complete sections based on your initial ideas",
          color: "from-blue-500/20 to-blue-700/20 border-blue-500/30",
          textColor: "text-blue-400",
          buttonColor: "bg-blue-500/20 hover:bg-blue-500/30 text-blue-300"
        },
        {
          icon: <Cloud className="h-10 w-10 text-indigo-400" />,
          title: "Instant Cloud Sync",
          description: "Your notes are automatically saved and available on any device, no account required",
          color: "from-indigo-500/20 to-indigo-700/20 border-indigo-500/30",
          textColor: "text-indigo-400", 
          buttonColor: "bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300"
        }
      ]
    },
    {
      category: "Advanced Features",
      items: [
        {
          icon: <Palette className="h-10 w-10 text-amber-400" />,
          title: "Modern Design",
          description: "Enjoy our premium interface with subtle blur effects and elegant transparency",
          color: "from-amber-500/20 to-amber-700/20 border-amber-500/30",
          textColor: "text-amber-400",
          buttonColor: "bg-amber-500/20 hover:bg-amber-500/30 text-amber-300",
          isNew: true
        },
        {
          icon: <Share2 className="h-10 w-10 text-emerald-400" />,
          title: "One-Click Sharing",
          description: "Share your notes with anyone using a secure link - recipients don't need an account",
          color: "from-emerald-500/20 to-emerald-700/20 border-emerald-500/30",
          textColor: "text-emerald-400",
          buttonColor: "bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300"
        },
        {
          icon: <Layout className="h-10 w-10 text-pink-400" />,
          title: "Customizable Layout",
          description: "Arrange your workspace exactly how you want it with our flexible and intuitive interface",
          color: "from-pink-500/20 to-pink-700/20 border-pink-500/30",
          textColor: "text-pink-400",
          buttonColor: "bg-pink-500/20 hover:bg-pink-500/30 text-pink-300"
        },
        {
          icon: <Keyboard className="h-10 w-10 text-cyan-400" />,
          title: "Keyboard Shortcuts",
          description: "Boost your productivity with powerful keyboard shortcuts for all common actions",
          color: "from-cyan-500/20 to-cyan-700/20 border-cyan-500/30",
          textColor: "text-cyan-400",
          buttonColor: "bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300"
        }
      ]
    }
  ];

  return (
    <section className="pt-0 pb-16 px-4 relative">
      {/* Removed gradient background for seamless look */}
      
      <div className="container mx-auto max-w-6xl relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-3 text-white">
          Feature Showcase
        </h2>
        <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
          Discover our latest innovations designed to enhance your note-taking experience
        </p>

        {/* Feature categories */}
        {features.map((category, categoryIndex) => (
          <div key={categoryIndex} className="mb-16">
            <h3 className="text-2xl font-semibold text-white mb-8 relative inline-block">
              {category.category}
              {category.category.includes("New") && (
                <span className="absolute -top-2 -right-12 bg-gradient-to-r from-purple-600 to-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                  New
                </span>
              )}
            </h3>
            
            <div className={cn(
              "grid gap-6",
              // Mobile-friendly grid: 2 columns for Advanced Features to reduce scrolling
              categoryIndex === 1 
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" 
                : "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
            )}>
              {category.items.map((feature, index) => (
                <div 
                  key={index} 
                  className={cn(
                    "p-6 transition-all duration-300 hover:translate-y-[-2px]",
                    feature.isNew ? "" : ""
                  )}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={cn("p-3 rounded-full bg-black/20", feature.textColor)}>
                      {feature.icon}
                    </div>
                    {feature.isNew && (
                      <span className="px-2 py-1 bg-purple-500/20 rounded-full text-purple-300 text-xs font-medium">
                        New
                      </span>
                    )}
                  </div>
                  <h4 className={cn("text-xl font-semibold mb-2", feature.textColor)}>
                    {feature.title}
                  </h4>
                  <p className="text-gray-300 mb-4 text-sm">
                    {feature.description}
                  </p>
                  {/* Feature is already available in the app */}
                </div>
              ))}
            </div>
          </div>
        ))}
        
        {/* All features are completely free - no Pro version needed */}
      </div>
    </section>
  );
};

export default FeatureShowcase;
