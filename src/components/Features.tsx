
import React from 'react';
import { motion } from "framer-motion";
import { Zap, Brain, Shield, Smartphone, Globe, Sparkles } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Start writing instantly. No loading screens, no delays. Your thoughts flow directly to the page.",
      gradient: "from-yellow-400 to-orange-500"
    },
    {
      icon: Brain,
      title: "AI-Powered",
      description: "Smart suggestions, grammar fixes, and content enhancement powered by advanced AI technology.",
      gradient: "from-noteflow-400 to-purple-500"
    },
    {
      icon: Shield,
      title: "Privacy First", 
      description: "Your notes stay private. Local storage with optional cloud sync that you control completely.",
      gradient: "from-green-400 to-blue-500"
    },
    {
      icon: Smartphone,
      title: "Mobile Ready",
      description: "Perfect experience on any device. Write on your phone, continue on your laptop seamlessly.",
      gradient: "from-pink-400 to-red-500"
    },
    {
      icon: Globe,
      title: "Always Available",
      description: "Works offline, syncs online. Your notes are accessible wherever you are, whenever you need them.",
      gradient: "from-blue-400 to-cyan-500"
    },
    {
      icon: Sparkles,
      title: "Zero Setup",
      description: "No accounts, no configuration. Open and start writing. It's that simple and powerful.",
      gradient: "from-purple-400 to-pink-500"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  return (
    <section className="py-20 px-4 relative overflow-hidden">
      <div className="container mx-auto max-w-6xl relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-noteflow-200 bg-clip-text text-transparent mb-6">
            Why Choose Online Note AI?
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Everything you need for productive note-taking, nothing you don't. 
            Simple by design, powerful by nature.
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group relative"
            >
              <div className="relative p-8 rounded-2xl bg-black/40 backdrop-blur-sm border border-white/10 hover:border-noteflow-400/50 transition-all duration-300 h-full hover:shadow-[0_0_30px_rgba(120,60,255,0.15)]">
                {/* Icon with gradient background */}
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${feature.gradient} p-0.5 mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <div className="w-full h-full bg-black/90 rounded-xl flex items-center justify-center">
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-4 group-hover:text-noteflow-300 transition-colors">
                  {feature.title}
                </h3>
                
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-noteflow-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
