
import React from 'react';
import { motion } from "framer-motion";
import { Sparkles } from 'lucide-react';

const FeaturesCallToAction = () => {
  return (
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
  );
};

export default FeaturesCallToAction;
