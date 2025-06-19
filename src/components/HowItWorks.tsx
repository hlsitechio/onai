
import React from 'react';
import { motion } from "framer-motion";
import { MousePointer, Type, Sparkles, Save } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: MousePointer,
      title: "Open",
      description: "No signup",
      step: "01"
    },
    {
      icon: Type,
      title: "Write",
      description: "AI adapts",
      step: "02"
    },
    {
      icon: Sparkles,
      title: "Enhance",
      description: "Smart suggestions",
      step: "03"
    },
    {
      icon: Save,
      title: "Save",
      description: "Auto-saved",
      step: "04"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { x: -50, opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 120, damping: 15 }
    }
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-[#0a0518] to-[#050510] relative overflow-hidden">
      {/* Enhanced background effects */}
      <div className="absolute inset-0 z-0">
        <motion.div 
          className="absolute top-1/3 left-1/5 w-72 h-72 rounded-full bg-gradient-to-r from-noteflow-600/8 to-purple-600/8 blur-3xl"
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-1/3 right-1/5 w-64 h-64 rounded-full bg-gradient-to-r from-green-400/8 to-blue-500/8 blur-2xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3],
            rotate: [360, 180, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.h2 
            className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-noteflow-200 to-purple-300 bg-clip-text text-transparent mb-6"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            How It Works
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-300 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Start in seconds
          </motion.p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {steps.map((step, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group relative text-center"
              whileHover={{ 
                scale: 1.05,
                transition: { duration: 0.3 }
              }}
            >
              <div className="relative p-8 rounded-3xl bg-gradient-to-br from-black/40 via-black/20 to-black/40 backdrop-blur-xl border border-white/10 hover:border-noteflow-400/50 transition-all duration-500 h-full overflow-hidden">
                {/* Step number with enhanced styling */}
                <motion.div 
                  className="w-12 h-12 mx-auto mb-6 rounded-full bg-gradient-to-r from-noteflow-400 to-purple-500 flex items-center justify-center text-lg font-bold text-white shadow-lg group-hover:scale-110 transition-transform duration-300"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  {step.step}
                </motion.div>

                {/* Icon with enhanced effects */}
                <motion.div 
                  className="w-14 h-14 mx-auto mb-6 rounded-xl bg-gradient-to-r from-noteflow-600/20 to-purple-600/20 border border-noteflow-400/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <step.icon className="h-7 w-7 text-noteflow-300" />
                </motion.div>

                {/* Content */}
                <motion.h3 
                  className="text-xl font-bold text-white mb-3 group-hover:text-noteflow-300 transition-colors duration-300"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  {step.title}
                </motion.h3>
                
                <p className="text-gray-400 text-base leading-relaxed">
                  {step.description}
                </p>

                {/* Animated background glow */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-noteflow-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl blur-xl"
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0, 0.1, 0]
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                />

                {/* Connection line for desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-noteflow-400 to-transparent opacity-30" />
                )}

                {/* Floating particles */}
                <div className="absolute inset-0 pointer-events-none">
                  {[...Array(2)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 bg-noteflow-400/40 rounded-full"
                      style={{
                        top: `${25 + i * 30}%`,
                        left: `${20 + i * 40}%`
                      }}
                      animate={{
                        y: [0, -10, 0],
                        opacity: [0.2, 0.6, 0.2],
                        scale: [1, 1.3, 1]
                      }}
                      transition={{
                        duration: 2.5 + i * 0.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: i * 0.8
                      }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Enhanced call-to-action */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <motion.a 
            href="#editor-section"
            className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-noteflow-600 to-purple-600 hover:from-noteflow-500 hover:to-purple-500 text-white px-8 py-4 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-noteflow-500/25"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <Sparkles className="h-5 w-5" />
            Try It Now
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
