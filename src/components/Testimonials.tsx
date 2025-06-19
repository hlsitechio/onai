import React from 'react';
import { motion } from "framer-motion";
import { Star, Quote } from 'lucide-react';
const Testimonials = () => {
  const testimonials = [{
    name: "Sarah Chen",
    role: "Content Writer",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    content: "This is exactly what I've been looking for. No bloat, just pure writing power with AI assistance when I need it.",
    rating: 5
  }, {
    name: "Mike Rodriguez",
    role: "Student",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    content: "Finally, a note-taking app that doesn't get in my way. The AI features are incredibly helpful for my research.",
    rating: 5
  }, {
    name: "Emily Davis",
    role: "Researcher",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
    content: "I've tried everything from Notion to Obsidian. This strikes the perfect balance between simplicity and power.",
    rating: 5
  }, {
    name: "Alex Johnson",
    role: "Freelance Writer",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    content: "The AI writing assistance is phenomenal. It's like having a writing coach available 24/7.",
    rating: 5
  }];
  const containerVariants = {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  const itemVariants = {
    hidden: {
      y: 30,
      opacity: 0
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100
      }
    }
  };
  return <section className="py-20 px-4 relative overflow-hidden">
      
    </section>;
};
export default Testimonials;