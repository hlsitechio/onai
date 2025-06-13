
import React from 'react';
import { useFocusMode } from '@/contexts';
import { 
  EyeOff, 
  BrainCircuit, 
  Cloud, 
  Share2, 
  Palette, 
  Keyboard,
  Sparkles,
  Zap
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from '@/lib/utils';

const FeatureShowcase = () => {
  // Use focus mode context to determine visibility
  const { isFocusMode } = useFocusMode();
  
  // Don't render anything when focus mode is active
  if (isFocusMode) return null;

  const features = [
    {
      icon: <EyeOff className="h-8 w-8" />,
      title: "Focus Mode",
      description: "Eliminate distractions with our immersive focus mode that highlights only your note panel",
      color: "from-purple-600/10 to-purple-800/10",
      borderColor: "border-purple-500/20 hover:border-purple-400/40",
      iconColor: "text-purple-400",
      glowColor: "hover:shadow-purple-500/20",
      isNew: true
    },
    {
      icon: <BrainCircuit className="h-8 w-8" />,
      title: "AI Assistant",
      description: "Smart AI tools that help you summarize, analyze, and enhance your writing with advanced language processing",
      color: "from-blue-600/10 to-blue-800/10",
      borderColor: "border-blue-500/20 hover:border-blue-400/40",
      iconColor: "text-blue-400",
      glowColor: "hover:shadow-blue-500/20"
    },
    {
      icon: <Cloud className="h-8 w-8" />,
      title: "Instant Cloud Sync",
      description: "Your notes are automatically saved and synced across all devices with real-time backup protection",
      color: "from-indigo-600/10 to-indigo-800/10",
      borderColor: "border-indigo-500/20 hover:border-indigo-400/40",
      iconColor: "text-indigo-400",
      glowColor: "hover:shadow-indigo-500/20"
    },
    {
      icon: <Share2 className="h-8 w-8" />,
      title: "One-Click Sharing",
      description: "Share your notes instantly with secure links - no account required for recipients to view your content",
      color: "from-emerald-600/10 to-emerald-800/10",
      borderColor: "border-emerald-500/20 hover:border-emerald-400/40",
      iconColor: "text-emerald-400",
      glowColor: "hover:shadow-emerald-500/20"
    },
    {
      icon: <Palette className="h-8 w-8" />,
      title: "Modern Design",
      description: "Enjoy our premium interface with elegant transparency, subtle animations, and beautiful gradients",
      color: "from-amber-600/10 to-amber-800/10",
      borderColor: "border-amber-500/20 hover:border-amber-400/40",
      iconColor: "text-amber-400",
      glowColor: "hover:shadow-amber-500/20",
      isNew: true
    },
    {
      icon: <Keyboard className="h-8 w-8" />,
      title: "Keyboard Shortcuts",
      description: "Boost productivity with powerful shortcuts for formatting, navigation, and all common actions",
      color: "from-cyan-600/10 to-cyan-800/10",
      borderColor: "border-cyan-500/20 hover:border-cyan-400/40",
      iconColor: "text-cyan-400",
      glowColor: "hover:shadow-cyan-500/20"
    }
  ];

  return (
    <section className="pt-0 pb-16 px-4 relative">
      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Header with improved styling */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 mb-6">
            <Sparkles className="h-4 w-4 text-purple-400" />
            <span className="text-purple-300 text-sm font-medium">Feature Showcase</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
            Powerful Features
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Discover the innovative tools designed to revolutionize your note-taking experience
          </p>
        </div>

        {/* Feature grid with enhanced cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className={cn(
                "group relative overflow-hidden transition-all duration-500 ease-out",
                "bg-gradient-to-br from-black/40 to-black/60 backdrop-blur-sm",
                feature.borderColor,
                "hover:scale-[1.02] hover:shadow-2xl",
                feature.glowColor,
                // Staggered animation delay
                "animate-fade-in"
              )}
              style={{
                animationDelay: `${index * 150}ms`,
                animationFillMode: 'both'
              }}
            >
              {/* Animated background gradient */}
              <div className={cn(
                "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500",
                feature.color
              )} />
              
              {/* Content */}
              <div className="relative z-10">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className={cn(
                      "p-3 rounded-xl bg-black/30 backdrop-blur-sm transition-all duration-300",
                      "group-hover:scale-110 group-hover:bg-black/40",
                      feature.iconColor
                    )}>
                      {feature.icon}
                    </div>
                    {feature.isNew && (
                      <div className="px-3 py-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full">
                        <span className="text-white text-xs font-semibold">NEW</span>
                      </div>
                    )}
                  </div>
                  
                  <CardTitle className={cn(
                    "text-xl font-semibold transition-colors duration-300",
                    "text-white group-hover:text-gray-100",
                    feature.iconColor
                  )}>
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <CardDescription className="text-gray-300 leading-relaxed text-sm group-hover:text-gray-200 transition-colors duration-300">
                    {feature.description}
                  </CardDescription>
                  
                  {/* Interactive indicator */}
                  <div className="mt-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <div className={cn("h-1 w-8 rounded-full", feature.iconColor.replace('text-', 'bg-'))} />
                    <span className="text-xs text-gray-400">Available now</span>
                  </div>
                </CardContent>
              </div>
              
              {/* Hover effect overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </Card>
          ))}
        </div>
        
        {/* Bottom section with call to action */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30">
            <Zap className="h-4 w-4 text-yellow-400" />
            <span className="text-gray-300 font-medium">All features are completely free</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureShowcase;
