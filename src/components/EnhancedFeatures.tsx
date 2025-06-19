
import React from 'react';
import { motion } from "framer-motion";
import FeatureCard from './features/FeatureCard';
import FeaturesBackgroundAnimations from './features/FeaturesBackgroundAnimations';
import FeaturesCallToAction from './features/FeaturesCallToAction';
import { featuresData } from './features/featuresData';

const EnhancedFeatures = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  return (
    <section className="py-20 px-4 relative overflow-hidden">
      {/* Enhanced animated background elements */}
      <FeaturesBackgroundAnimations />

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
            Powerful Features
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-300 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            AI-powered tools that enhance your writing experience
          </motion.p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {featuresData.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              gradient={feature.gradient}
              delay={feature.delay}
              index={index}
            />
          ))}
        </motion.div>

        {/* Enhanced call to action */}
        <FeaturesCallToAction />
      </div>
    </section>
  );
};

export default EnhancedFeatures;
