
import React from 'react';
import { useFocusMode } from '@/contexts';
import { 
  Target, 
  Sparkles, 
  CloudUpload, 
  Share, 
  Paintbrush, 
  Zap,
  Star,
  Rocket
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
      icon: <Target className="h-8 w-8" />,
      title: "Focus Mode",
      description: "Eliminate distractions with our immersive focus mode that highlights only your note panel for maximum productivity",
      color: "from-violet-900/30 to-purple-900/40",
      borderColor: "border-violet-400/30 hover:border-violet-300/50",
      iconColor: "text-violet-300",
      glowColor: "hover:shadow-violet-400/25",
      bgDark: "bg-gray-900/60",
      isNew: true
    },
    {
      icon: <Sparkles className="h-8 w-8" />,
      title: "AI Assistant",
      description: "Smart AI tools that help you summarize, analyze, and enhance your writing with advanced language processing capabilities",
      color: "from-cyan-900/30 to-blue-900/40",
      borderColor: "border-cyan-400/30 hover:border-cyan-300/50",
      iconColor: "text-cyan-300",
      glowColor: "hover:shadow-cyan-400/25",
      bgDark: "bg-slate-900/60"
    },
    {
      icon: <CloudUpload className="h-8 w-8" />,
      title: "Instant Cloud Sync",
      description: "Your notes are automatically saved and synced across all devices with real-time backup protection and seamless access",
      color: "from-emerald-900/30 to-teal-900/40",
      borderColor: "border-emerald-400/30 hover:border-emerald-300/50",
      iconColor: "text-emerald-300",
      glowColor: "hover:shadow-emerald-400/25",
      bgDark: "bg-emerald-950/60"
    },
    {
      icon: <Share className="h-8 w-8" />,
      title: "One-Click Sharing",
      description: "Share your notes instantly with secure links - no account required for recipients to view your content effortlessly",
      color: "from-orange-900/30 to-red-900/40",
      borderColor: "border-orange-400/30 hover:border-orange-300/50",
      iconColor: "text-orange-300",
      glowColor: "hover:shadow-orange-400/25",
      bgDark: "bg-orange-950/60"
    },
    {
      icon: <Paintbrush className="h-8 w-8" />,
      title: "Modern Design",
      description: "Enjoy our premium interface with elegant transparency, smooth animations, and beautiful gradients for a delightful experience",
      color: "from-pink-900/30 to-rose-900/40",
      borderColor: "border-pink-400/30 hover:border-pink-300/50",
      iconColor: "text-pink-300",
      glowColor: "hover:shadow-pink-400/25",
      bgDark: "bg-pink-950/60",
      isNew: true
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Keyboard Shortcuts",
      description: "Boost productivity with powerful shortcuts for formatting, navigation, and all common actions to work at lightning speed",
      color: "from-yellow-900/30 to-amber-900/40",
      borderColor: "border-yellow-400/30 hover:border-yellow-300/50",
      iconColor: "text-yellow-300",
      glowColor: "hover:shadow-yellow-400/25",
      bgDark: "bg-amber-950/60"
    }
  ];

  return (
    <section className="pt-0 pb-20 px-4 relative">
      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Enhanced header with better spacing */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-purple-900/40 to-blue-900/40 border border-purple-400/30 mb-8 backdrop-blur-sm">
            <Star className="h-5 w-5 text-purple-300 animate-pulse" />
            <span className="text-purple-200 text-sm font-semibold tracking-wide">FEATURE SHOWCASE</span>
            <Star className="h-5 w-5 text-purple-300 animate-pulse" />
          </div>
          
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent leading-tight">
            Powerful Features
          </h2>
          <p className="text-gray-300 text-xl max-w-3xl mx-auto leading-relaxed font-medium">
            Discover the innovative tools designed to revolutionize your note-taking experience with cutting-edge technology
          </p>
        </div>

        {/* Enhanced feature grid with better spacing */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className={cn(
                "group relative overflow-hidden transition-all duration-700 ease-out transform hover:scale-105",
                "backdrop-blur-md border-2",
                feature.bgDark,
                feature.borderColor,
                "hover:shadow-2xl shadow-lg",
                feature.glowColor,
                "animate-fade-in"
              )}
              style={{
                animationDelay: `${index * 200}ms`,
                animationFillMode: 'both'
              }}
            >
              {/* Enhanced animated background gradient */}
              <div className={cn(
                "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-all duration-700",
                feature.color
              )} />
              
              {/* Subtle border glow effect */}
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r opacity-0 group-hover:opacity-30 transition-opacity duration-500 blur-sm" 
                   style={{
                     background: `linear-gradient(45deg, ${feature.iconColor.replace('text-', '')}, transparent, ${feature.iconColor.replace('text-', '')})`
                   }} />
              
              {/* Content with better spacing */}
              <div className="relative z-10">
                <CardHeader className="pb-6 pt-8">
                  <div className="flex items-start justify-between mb-6">
                    <div className={cn(
                      "p-4 rounded-2xl backdrop-blur-sm transition-all duration-500 border",
                      "group-hover:scale-110 group-hover:rotate-3",
                      "bg-black/40 border-white/10 group-hover:bg-black/60 group-hover:border-white/20",
                      feature.iconColor
                    )}>
                      {feature.icon}
                    </div>
                    {feature.isNew && (
                      <div className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full shadow-lg animate-pulse">
                        <span className="text-white text-xs font-bold tracking-wider">NEW</span>
                      </div>
                    )}
                  </div>
                  
                  <CardTitle className={cn(
                    "text-2xl font-bold transition-all duration-300 mb-2",
                    "text-white group-hover:text-gray-50",
                    "group-hover:transform group-hover:translate-x-1"
                  )}>
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="pt-0 pb-8 px-8">
                  <CardDescription className="text-gray-200 leading-relaxed text-base font-medium group-hover:text-gray-100 transition-all duration-300 line-height-loose">
                    {feature.description}
                  </CardDescription>
                  
                  {/* Enhanced interactive indicator */}
                  <div className="mt-6 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                    <div className={cn(
                      "h-2 w-12 rounded-full transition-all duration-500",
                      feature.iconColor.replace('text-', 'bg-'),
                      "group-hover:w-16"
                    )} />
                    <Rocket className="h-4 w-4 text-gray-300 group-hover:text-white transition-colors duration-300" />
                    <span className="text-sm text-gray-300 group-hover:text-white font-semibold transition-colors duration-300">
                      Available Now
                    </span>
                  </div>
                </CardContent>
              </div>
              
              {/* Enhanced hover effect overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700" />
            </Card>
          ))}
        </div>
        
        {/* Enhanced bottom section */}
        <div className="text-center mt-20">
          <div className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-green-900/40 to-emerald-900/40 border border-green-400/30 backdrop-blur-sm shadow-lg">
            <Sparkles className="h-5 w-5 text-green-300 animate-bounce" />
            <span className="text-green-200 font-bold text-lg">All features are completely free forever</span>
            <Sparkles className="h-5 w-5 text-green-300 animate-bounce" style={{animationDelay: '0.5s'}} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureShowcase;
