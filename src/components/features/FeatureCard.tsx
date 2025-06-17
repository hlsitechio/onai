
import React from 'react';
import { motion } from "framer-motion";
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  gradient: string;
  delay: number;
  index: number;
}

const FeatureCard = ({ icon: Icon, title, description, gradient, delay, index }: FeatureCardProps) => {
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
        transition={{ delay }}
      >
        {/* Animated background glow */}
        <motion.div 
          className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-xl`}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0, 0.1, 0]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        
        <motion.div 
          className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${gradient} p-0.5 mb-6 group-hover:scale-110 transition-transform duration-300`}
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-full h-full bg-black/90 rounded-2xl flex items-center justify-center">
            <Icon className="h-8 w-8 text-white" />
          </div>
        </motion.div>
        
        <motion.h3 
          className="text-xl font-bold text-white mb-4 group-hover:text-noteflow-300 transition-colors"
          whileHover={{ x: 5 }}
          transition={{ duration: 0.2 }}
        >
          {title}
        </motion.h3>
        
        <p className="text-gray-400 leading-relaxed">
          {description}
        </p>

        {/* Animated border */}
        <motion.div 
          className="absolute inset-0 rounded-3xl"
          style={{
            background: `conic-gradient(from 0deg, transparent, ${gradient.includes('yellow') ? '#fbbf24' : gradient.includes('noteflow') ? '#3b82f6' : gradient.includes('green') ? '#10b981' : gradient.includes('purple') ? '#8b5cf6' : gradient.includes('rose') ? '#f43f5e' : '#06b6d4'}, transparent)`,
            padding: '1px',
            opacity: 0
          }}
          whileHover={{ opacity: 0.6 }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>
    </motion.div>
  );
};

export default FeatureCard;
