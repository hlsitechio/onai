
import React from 'react';
import { motion } from "framer-motion";
import { 
  Zap, 
  Brain, 
  Shield, 
  Sparkles, 
  Wand2, 
  MessageSquare
} from 'lucide-react';

const EnhancedFeatures = () => {
  const features = [
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Start instantly. No setup.",
      gradient: "from-yellow-400 to-orange-500",
      delay: 0
    },
    {
      icon: Brain,
      title: "AI-Powered",
      description: "Smart suggestions.",
      gradient: "from-noteflow-400 to-purple-500",
      delay: 0.1
    },
    {
      icon: Shield,
      title: "Privacy First",
      description: "Your data stays private.",
      gradient: "from-green-400 to-blue-500",
      delay: 0.2
    },
    {
      icon: Wand2,
      title: "Auto-Enhancement",
      description: "Polish your content.",
      gradient: "from-purple-400 to-pink-500",
      delay: 0.3
    },
    {
      icon: MessageSquare,
      title: "AI Chat",
      description: "Talk with your notes.",
      gradient: "from-green-400 to-emerald-500",
      delay: 0.4
    },
    {
      icon: Sparkles,
      title: "Smart Format",
      description: "Auto-adapting style.",
      gradient: "from-rose-400 to-red-500",
      delay: 0.5
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
    hidden: { y: 50, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 100, damping: 10 }
    }
  };

  const floatingVariants = {
    float: {
      y: ['-5%', '5%'],
      transition: {
        repeat: Infinity,
        repeatType: 'reverse' as const,
        duration: 3,
        ease: 'easeInOut'
      }
    }
  };

  return (
    <section className="py-20 px-4 relative overflow-hidden">
      {/* Animated background elements */}
      <motion.div 
        className="absolute top-20 left-10 w-32 h-32 rounded-full bg-gradient-to-r from-noteflow-400/20 to-purple-400/20 blur-xl"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
          rotate: [0, 180, 360]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <motion.div 
        className="absolute bottom-20 right-10 w-40 h-40 rounded-full bg-gradient-to-r from-green-400/20 to-blue-400/20 blur-xl"
        animate={{ 
          scale: [1.2, 1, 1.2],
          opacity: [0.4, 0.7, 0.4],
          rotate: [360, 180, 0]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="container mx-auto max-w-6xl relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.h2 
            className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white via-noteflow-200 to-purple-300 bg-clip-text text-transparent mb-6"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            Why Choose Us?
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-300 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Everything you need in one seamless experience
          </motion.p>
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
              whileHover={{ scale: 1.05, rotateY: 5 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="relative p-8 rounded-3xl bg-gradient-to-br from-black/40 via-black/20 to-black/40 backdrop-blur-xl border border-white/10 hover:border-noteflow-400/50 transition-all duration-300 h-full overflow-hidden"
                variants={floatingVariants}
                animate="float"
                transition={{ delay: feature.delay }}
              >
                {/* Animated background glow */}
                <motion.div 
                  className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-xl`}
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0, 0.1, 0]
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                />
                
                <motion.div 
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.gradient} p-0.5 mb-6 group-hover:scale-110 transition-transform duration-300`}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="w-full h-full bg-black/90 rounded-2xl flex items-center justify-center">
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                </motion.div>
                
                <motion.h3 
                  className="text-xl font-bold text-white mb-4 group-hover:text-noteflow-300 transition-colors"
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  {feature.title}
                </motion.h3>
                
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>

                {/* Animated border */}
                <motion.div 
                  className="absolute inset-0 rounded-3xl"
                  style={{
                    background: `conic-gradient(from 0deg, transparent, ${feature.gradient.includes('yellow') ? '#fbbf24' : feature.gradient.includes('noteflow') ? '#3b82f6' : feature.gradient.includes('green') ? '#10b981' : feature.gradient.includes('purple') ? '#8b5cf6' : feature.gradient.includes('rose') ? '#f43f5e' : '#06b6d4'}, transparent)`,
                    padding: '1px',
                    opacity: 0
                  }}
                  whileHover={{ opacity: 0.6 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to action */}
        <motion.div
          className="text-center mt-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <motion.div
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-noteflow-600/20 to-purple-600/20 border border-noteflow-400/30 text-noteflow-300"
            whileHover={{ scale: 1.05, borderColor: 'rgba(120, 60, 255, 0.6)' }}
            transition={{ duration: 0.3 }}
          >
            <Sparkles className="h-5 w-5" />
            <span className="font-medium">Start writing in seconds</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default EnhancedFeatures;
