
import React from 'react';
import { motion } from "framer-motion";
import { Star, Quote } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Content Writer",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      content: "This is exactly what I've been looking for. No bloat, just pure writing power with AI assistance when I need it.",
      rating: 5
    },
    {
      name: "Mike Rodriguez", 
      role: "Student",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      content: "Finally, a note-taking app that doesn't get in my way. The AI features are incredibly helpful for my research.",
      rating: 5
    },
    {
      name: "Emily Davis",
      role: "Researcher", 
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
      content: "I've tried everything from Notion to Obsidian. This strikes the perfect balance between simplicity and power.",
      rating: 5
    },
    {
      name: "Alex Johnson",
      role: "Freelance Writer",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face", 
      content: "The AI writing assistance is phenomenal. It's like having a writing coach available 24/7.",
      rating: 5
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
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100
      }
    }
  };

  return (
    <section className="py-20 px-4 relative overflow-hidden bg-gradient-to-b from-[#0a0518] to-[#050510]">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <motion.div 
          className="absolute top-20 left-10 w-96 h-96 rounded-full bg-gradient-to-r from-noteflow-600/20 to-purple-600/20 blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-gradient-to-r from-pink-500/20 to-cyan-500/20 blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.7, 0.4],
            rotate: [360, 180, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-noteflow-600/20 border border-noteflow-400/30 text-noteflow-300 text-sm font-medium mb-6"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <Star className="h-4 w-4" />
            What Our Users Say
          </motion.div>
          
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white via-noteflow-200 to-purple-300 bg-clip-text text-transparent">
              Loved by Writers
            </span>
            <br />
            <span className="bg-gradient-to-r from-noteflow-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Everywhere
            </span>
          </h2>
          
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Join thousands of satisfied users who have transformed their writing workflow with our AI-powered note-taking platform.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ 
                scale: 1.02,
                y: -10,
                transition: { type: "spring", stiffness: 300 }
              }}
              className="group relative"
            >
              {/* Card Glow Effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-noteflow-600/20 via-purple-600/20 to-pink-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative p-8 rounded-2xl bg-gradient-to-br from-black/40 to-black/60 backdrop-blur-sm border border-white/10 shadow-2xl overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute inset-0 bg-gradient-to-br from-noteflow-400/20 via-transparent to-purple-400/20"></div>
                </div>

                {/* Quote Icon */}
                <div className="relative z-10">
                  <Quote className="h-8 w-8 text-noteflow-400/60 mb-6" />
                  
                  {/* Content */}
                  <blockquote className="text-gray-200 text-lg leading-relaxed mb-6 relative z-10">
                    "{testimonial.content}"
                  </blockquote>
                  
                  {/* Rating */}
                  <div className="flex gap-1 mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 * i, type: "spring" }}
                      >
                        <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                      </motion.div>
                    ))}
                  </div>
                  
                  {/* User Info */}
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="absolute -inset-1 bg-gradient-to-r from-noteflow-400 to-purple-500 rounded-full blur-sm opacity-60"></div>
                      <img 
                        src={testimonial.avatar} 
                        alt={testimonial.name}
                        className="relative w-12 h-12 rounded-full object-cover border-2 border-white/20"
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">{testimonial.name}</h4>
                      <p className="text-gray-400 text-sm">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <a 
              href="#editor-section"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-noteflow-600 via-purple-500 to-noteflow-400 hover:from-noteflow-500 hover:via-purple-400 hover:to-noteflow-300 text-white px-10 py-4 rounded-full text-lg font-semibold transition-all duration-300 shadow-2xl shadow-noteflow-500/30 hover:shadow-noteflow-400/40"
            >
              <Star className="h-5 w-5" />
              Join Our Happy Users
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
