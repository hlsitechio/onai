
import React from 'react';
import { motion } from "framer-motion";
import { Zap, Brain, Shield } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Start writing instantly. No delays, no setup.",
      gradient: "from-yellow-400 to-orange-500"
    },
    {
      icon: Brain,
      title: "AI-Powered",
      description: "Smart suggestions and content enhancement.",
      gradient: "from-noteflow-400 to-purple-500"
    },
    {
      icon: Shield,
      title: "Privacy First", 
      description: "Your notes stay private. Local storage with optional sync.",
      gradient: "from-green-400 to-blue-500"
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
    <section className="py-16 px-4 relative overflow-hidden">
      <div className="container mx-auto max-w-4xl relative z-10">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-noteflow-200 bg-clip-text text-transparent mb-4">
            Why Choose Online Note AI?
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Everything you need for productive note-taking.
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
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
              <div className="relative p-6 rounded-2xl bg-black/40 backdrop-blur-sm border border-white/10 hover:border-noteflow-400/50 transition-all duration-300 h-full hover:shadow-[0_0_30px_rgba(120,60,255,0.15)]">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.gradient} p-0.5 mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <div className="w-full h-full bg-black/90 rounded-xl flex items-center justify-center">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                
                <h3 className="text-lg font-bold text-white mb-3 group-hover:text-noteflow-300 transition-colors">
                  {feature.title}
                </h3>
                
                <p className="text-gray-400 text-sm leading-relaxed">
                  {feature.description}
                </p>

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
