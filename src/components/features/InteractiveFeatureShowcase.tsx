
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Sparkles, Send, Zap, Shield, Globe, Lock, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const InteractiveFeatureShowcase = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const features = [
    {
      id: 'ai-command',
      title: 'Enhanced AI Command Center',
      subtitle: 'Experience our new unified AI interface!',
      description: 'Select text in the editor or use Ctrl+Shift+A to access quick actions, smart suggestions, and advanced processing.',
      icon: <Sparkles className="w-8 h-8" />,
      color: 'from-blue-500 to-purple-500',
      mockup: (
        <div className="relative bg-black/40 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-5 h-5 text-noteflow-400" />
            <h3 className="text-white font-medium">AI Assistant</h3>
            <div className="ml-auto w-4 h-4 rounded-full bg-red-400"></div>
          </div>
          
          <div className="bg-white/5 rounded-lg p-3 mb-4 text-sm text-gray-300">
            Selected: "1..."
          </div>
          
          <div className="bg-white/5 rounded-xl p-4 mb-4 border border-blue-400/30">
            <div className="text-gray-300 text-sm mb-3">Ask AI to help with your writing...</div>
            <div className="h-16 bg-white/10 rounded-lg"></div>
          </div>
          
          <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white mb-4">
            <Send className="w-4 h-4 mr-2" />
            Send
          </Button>
          
          <div className="text-xs text-gray-400 mb-2">Quick actions:</div>
          <div className="flex gap-2">
            {['Improve writing', 'Fix grammar', 'Summarize'].map((action) => (
              <div key={action} className="px-3 py-1 bg-white/10 rounded-full text-xs text-gray-300">
                {action}
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'sign-in',
      title: 'Seamless Authentication',
      subtitle: 'Welcome Back - Sign in to your account',
      description: 'Secure, fast authentication with encrypted data protection and cross-device sync.',
      icon: <Shield className="w-8 h-8" />,
      color: 'from-purple-500 to-pink-500',
      mockup: (
        <div className="relative bg-gradient-to-br from-purple-900/40 to-blue-900/40 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl mx-auto mb-3 flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Welcome Back</h3>
            <p className="text-gray-300 text-sm">Sign in to your account or create a new one</p>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-300 mb-2 block">Email</label>
              <div className="h-10 bg-white/10 rounded-lg border border-white/20"></div>
            </div>
            <div>
              <label className="text-sm text-gray-300 mb-2 block">Password</label>
              <div className="h-10 bg-white/10 rounded-lg border border-white/20"></div>
            </div>
            <Button className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
              Sign In
            </Button>
          </div>
        </div>
      )
    },
    {
      id: 'hero-section',
      title: 'Think Clearly',
      subtitle: 'Transform your thoughts into organized, intelligent notes',
      description: 'Experience seamless writing, smart suggestions, and effortless organization with the power of artificial intelligence.',
      icon: <Brain className="w-8 h-8" />,
      color: 'from-noteflow-500 to-purple-500',
      mockup: (
        <div className="relative bg-gradient-to-br from-purple-900/40 to-blue-900/40 backdrop-blur-sm rounded-2xl p-8 border border-white/10 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-noteflow-400 to-purple-500 rounded-2xl mx-auto mb-4 flex items-center justify-center">
            <Brain className="w-8 h-8 text-white" />
          </div>
          
          <h2 className="text-3xl font-bold text-white mb-4">Think Clearly</h2>
          
          <p className="text-gray-300 mb-6 max-w-md mx-auto">
            Transform your thoughts into organized, intelligent notes with the power of artificial intelligence. 
            Experience seamless writing, smart suggestions, and effortless organization.
          </p>
          
          <div className="flex items-center justify-center gap-6 text-sm text-gray-400 mb-6">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span>Smart AI assistance</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-green-400" />
              <span>Secure & private</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-400" />
              <span>Works everywhere</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-purple-400" />
              <span>Lightning fast</span>
            </div>
          </div>
          
          <Button 
            className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-8 py-3 rounded-full font-medium"
            size="lg"
          >
            Start Creating
          </Button>
        </div>
      )
    }
  ];

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 4000);
    
    return () => clearInterval(interval);
  }, [isAutoPlaying, features.length]);

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-[#0a0518] to-[#050510] relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-noteflow-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white to-noteflow-200 bg-clip-text text-transparent mb-6">
            Everything You Need in One
            <br />
            <span className="bg-gradient-to-r from-noteflow-400 to-purple-400 bg-clip-text text-transparent">
              Seamless Experience
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Discover the power of AI-enhanced note-taking with our unified interface that adapts to your workflow
          </p>
        </motion.div>

        {/* Interactive Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Feature Navigation */}
          <div className="space-y-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.id}
                className={`relative cursor-pointer transition-all duration-300 ${
                  activeFeature === index ? 'scale-105' : 'hover:scale-102'
                }`}
                onClick={() => {
                  setActiveFeature(index);
                  setIsAutoPlaying(false);
                }}
                whileHover={{ x: 10 }}
              >
                <Card className={`overflow-hidden border-2 transition-all duration-300 ${
                  activeFeature === index 
                    ? 'border-noteflow-400 bg-gradient-to-r from-noteflow-900/20 to-purple-900/20 shadow-2xl shadow-noteflow-500/20' 
                    : 'border-white/10 bg-black/20 hover:border-white/20'
                }`}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${feature.color} shadow-lg`}>
                        {feature.icon}
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                          {feature.title}
                          {activeFeature === index && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-2 h-2 bg-noteflow-400 rounded-full"
                            />
                          )}
                        </h3>
                        <p className="text-noteflow-300 font-medium mb-2">{feature.subtitle}</p>
                        <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                      </div>
                      
                      <ExternalLink className={`w-5 h-5 transition-colors ${
                        activeFeature === index ? 'text-noteflow-400' : 'text-gray-500'
                      }`} />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Feature Display */}
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFeature}
                initial={{ opacity: 0, x: 50, rotateY: -15 }}
                animate={{ opacity: 1, x: 0, rotateY: 0 }}
                exit={{ opacity: 0, x: -50, rotateY: 15 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="transform-gpu"
              >
                {features[activeFeature].mockup}
              </motion.div>
            </AnimatePresence>

            {/* Progress Indicators */}
            <div className="flex justify-center gap-2 mt-8">
              {features.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setActiveFeature(index);
                    setIsAutoPlaying(false);
                  }}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    activeFeature === index 
                      ? 'bg-noteflow-400 scale-125' 
                      : 'bg-white/20 hover:bg-white/40'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Auto-play Toggle */}
        <div className="text-center mt-12">
          <Button
            variant="outline"
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className="border-noteflow-400/30 text-noteflow-300 hover:bg-noteflow-400/10"
          >
            {isAutoPlaying ? 'Pause Auto-play' : 'Resume Auto-play'}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default InteractiveFeatureShowcase;
