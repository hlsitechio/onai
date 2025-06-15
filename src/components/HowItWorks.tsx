
import React from 'react';
import { motion } from "framer-motion";
import { MousePointer, Type, Sparkles, Save } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: MousePointer,
      title: "Open & Start",
      description: "Simply open the app and start typing. No registration, no setup required.",
      step: "01"
    },
    {
      icon: Type,
      title: "Write Naturally",
      description: "Type your thoughts naturally. The editor adapts to your writing style.",
      step: "02"
    },
    {
      icon: Sparkles,
      title: "AI Enhancement",
      description: "Select text for AI suggestions, improvements, and smart formatting.",
      step: "03"
    },
    {
      icon: Save,
      title: "Auto-Save",
      description: "Your work is automatically saved locally and synced if you choose.",
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
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-[#0a0518] to-[#050510] relative overflow-hidden">
      <div className="container mx-auto max-w-6xl relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-noteflow-200 bg-clip-text text-transparent mb-6">
            How It Works
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Get started in seconds. Our streamlined process makes note-taking effortless and productive.
          </p>
        </motion.div>

        <motion.div 
          className="space-y-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {steps.map((step, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="flex flex-col md:flex-row items-center gap-8 group"
            >
              {/* Step Number */}
              <div className="flex-shrink-0 w-20 h-20 rounded-full bg-gradient-to-r from-noteflow-400 to-purple-500 flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                {step.step}
              </div>

              {/* Icon */}
              <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-gradient-to-r from-noteflow-600/20 to-purple-600/20 border border-noteflow-400/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <step.icon className="h-8 w-8 text-noteflow-300" />
              </div>

              {/* Content */}
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-noteflow-300 transition-colors">
                  {step.title}
                </h3>
                <p className="text-gray-400 text-lg leading-relaxed max-w-2xl">
                  {step.description}
                </p>
              </div>

              {/* Connecting Line (except for last item) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute left-10 top-20 w-0.5 h-12 bg-gradient-to-b from-noteflow-400 to-transparent opacity-30" 
                     style={{ transform: `translateY(${80 + index * 120}px)` }} />
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
