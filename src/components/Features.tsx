
import React from 'react';
import { motion } from "framer-motion";
import { Zap, Brain, Shield } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Start instantly",
      gradient: "from-yellow-400 to-orange-500"
    },
    {
      icon: Brain,
      title: "AI-Powered",
      description: "Smart writing",
      gradient: "from-noteflow-400 to-purple-500"
    },
    {
      icon: Shield,
      title: "Privacy First", 
      description: "Data stays private",
      gradient: "from-green-400 to-blue-500"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 120, damping: 12 }
    }
  };

  return (
    <section className="py-16 px-4 relative overflow-hidden">
      {/* Enhanced background effects */}
      <div className="absolute inset-0 z-0">
        <motion.div 
          className="absolute top-1/2 left-1/4 w-64 h-64 rounded-full bg-gradient-to-r from-noteflow-600/10 to-purple-600/10 blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full bg-gradient-to-r from-green-400/10 to-blue-500/10 blur-2xl"
          animate={{ 
            scale: [1.1, 1, 1.1],
            opacity: [0.2, 0.4, 0.2],
            rotate: [360, 180, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="container mx-auto max-w-5xl relative z-10">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.h2 
            className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-noteflow-200 to-purple-300 bg-clip-text text-transparent mb-4"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            Why Choose Us?
          </motion.h2>
          <motion.p 
            className="text-lg text-gray-300 max-w-xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Smart. Fast. Private.
          </motion.p>
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
              whileHover={{ 
                scale: 1.05,
                rotateY: 5,
                transition: { duration: 0.3 }
              }}
            >
              <div className="relative p-8 rounded-3xl bg-gradient-to-br from-black/40 via-black/20 to-black/40 backdrop-blur-xl border border-white/10 hover:border-noteflow-400/50 transition-all duration-500 h-full overflow-hidden">
                {/* Animated background glow */}
                <motion.div 
                  className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-15 transition-opacity duration-500 blur-xl`}
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0, 0.08, 0]
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
                  className="text-xl font-bold text-white mb-3 group-hover:text-noteflow-300 transition-colors duration-300"
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  {feature.title}
                </motion.h3>
                
                <p className="text-gray-400 text-base leading-relaxed">
                  {feature.description}
                </p>

                {/* Animated border */}
                <motion.div 
                  className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-60 transition-opacity duration-300"
                  style={{
                    background: `conic-gradient(from 0deg, transparent, ${
                      feature.gradient.includes('yellow') ? '#fbbf24' : 
                      feature.gradient.includes('noteflow') ? '#3b82f6' : 
                      '#10b981'
                    }, transparent)`,
                    padding: '1px'
                  }}
                />

                {/* Floating particles effect */}
                <div className="absolute inset-0 pointer-events-none">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 bg-white/30 rounded-full"
                      style={{
                        top: `${30 + i * 20}%`,
                        left: `${20 + i * 25}%`
                      }}
                      animate={{
                        y: [0, -15, 0],
                        opacity: [0.3, 0.8, 0.3],
                        scale: [1, 1.2, 1]
                      }}
                      transition={{
                        duration: 3 + i * 0.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: i * 0.5
                      }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
