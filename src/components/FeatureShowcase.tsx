
import React from 'react';
import { motion } from "framer-motion";
import { CheckCircle, Star, Shield, Zap } from 'lucide-react';

const FeatureShowcase = () => {
  const showcaseFeatures = [
    "No registration required - start immediately",
    "Advanced AI writing assistance",
    "Real-time collaboration features",
    "Offline mode with auto-sync",
    "Military-grade encryption",
    "Cross-platform compatibility",
    "Smart organization and tagging",
    "Export to multiple formats"
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-[#050510] to-[#0a0518] relative overflow-hidden">
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-noteflow-600/20 border border-noteflow-400/30 text-noteflow-300 text-sm font-medium">
                <Star className="h-4 w-4" />
                Premium Features
              </span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-noteflow-200 bg-clip-text text-transparent mb-6">
              Everything You Need, Nothing You Don't
            </h2>
            
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              While others overwhelm you with features, we focus on what matters most: 
              fast, intelligent, and secure note-taking that gets out of your way.
            </p>

            <div className="space-y-4 mb-8">
              {showcaseFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex items-center gap-3 group"
                >
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-gray-300 group-hover:text-white transition-colors">
                    {feature}
                  </span>
                </motion.div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href="#editor-section"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-noteflow-600 to-purple-600 hover:from-noteflow-500 hover:to-purple-500 text-white px-8 py-4 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-noteflow-500/25"
              >
                <Zap className="h-5 w-5" />
                Get Started Free
              </a>
              <a 
                href="#sponsors"
                className="inline-flex items-center justify-center gap-2 border border-noteflow-400 text-noteflow-400 hover:bg-noteflow-400 hover:text-white px-8 py-4 rounded-xl font-medium transition-all duration-300"
              >
                <Shield className="h-5 w-5" />
                View Security
              </a>
            </div>
          </motion.div>

          {/* Right side - Visual */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative p-8 rounded-2xl bg-black/40 backdrop-blur-sm border border-white/10 shadow-2xl">
              {/* Mock editor interface */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  <span className="text-gray-400 text-sm ml-4">Online Note AI</span>
                </div>
                
                <div className="space-y-3">
                  <div className="h-4 bg-gradient-to-r from-white/20 to-transparent rounded w-3/4"></div>
                  <div className="h-4 bg-gradient-to-r from-white/15 to-transparent rounded w-full"></div>
                  <div className="h-4 bg-gradient-to-r from-white/20 to-transparent rounded w-5/6"></div>
                  <div className="h-4 bg-gradient-to-r from-noteflow-400/30 to-transparent rounded w-2/3"></div>
                  <div className="h-4 bg-gradient-to-r from-white/15 to-transparent rounded w-4/5"></div>
                </div>

                {/* AI suggestion popup */}
                <div className="relative mt-6">
                  <div className="absolute -top-2 right-4 p-3 bg-gradient-to-r from-noteflow-600 to-purple-600 rounded-lg shadow-lg border border-noteflow-400/30">
                    <div className="flex items-center gap-2 text-white text-sm">
                      <Zap className="h-4 w-4" />
                      AI Suggestion
                    </div>
                  </div>
                </div>
              </div>

              {/* Glowing effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-noteflow-600/10 to-purple-600/10 blur-xl"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FeatureShowcase;
