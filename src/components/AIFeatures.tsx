
import React from 'react';
import { motion } from "framer-motion";
import { Brain, Wand2, MessageSquare, Lightbulb, FileText, Zap } from 'lucide-react';

const AIFeatures = () => {
  const features = [
    {
      icon: Brain,
      title: "Smart Writing Assistant",
      description: "AI helps improve your writing style, grammar, and clarity in real-time.",
      color: "from-blue-400 to-cyan-500"
    },
    {
      icon: Wand2,
      title: "Content Enhancement",
      description: "Transform basic notes into polished content with AI-powered suggestions.",
      color: "from-purple-400 to-pink-500"
    },
    {
      icon: MessageSquare,
      title: "Conversational AI",
      description: "Chat with AI about your notes to get insights, summaries, and ideas.",
      color: "from-green-400 to-emerald-500"
    },
    {
      icon: Lightbulb,
      title: "Idea Generation",
      description: "Stuck? AI generates creative ideas and helps overcome writer's block.",
      color: "from-yellow-400 to-orange-500"
    },
    {
      icon: FileText,
      title: "Auto-Formatting",
      description: "Smart formatting that adapts to your content type and writing style.",
      color: "from-rose-400 to-red-500"
    },
    {
      icon: Zap,
      title: "Instant Processing",
      description: "Lightning-fast AI responses that don't interrupt your writing flow.",
      color: "from-indigo-400 to-purple-500"
    }
  ];

  return (
    <section className="py-20 px-4 relative overflow-hidden">
      <div className="container mx-auto max-w-6xl relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-noteflow-200 bg-clip-text text-transparent mb-6">
            AI-Powered Features
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Experience the future of note-taking with intelligent AI features that enhance your productivity and creativity.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative"
            >
              <div className="relative p-8 rounded-2xl bg-black/40 backdrop-blur-sm border border-white/10 hover:border-noteflow-400/50 transition-all duration-300 h-full overflow-hidden">
                {/* Animated background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                
                {/* Icon */}
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${feature.color} p-0.5 mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <div className="w-full h-full bg-black/90 rounded-xl flex items-center justify-center">
                    <feature.icon className="h-7 w-7 text-white" />
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-4 group-hover:text-noteflow-300 transition-colors">
                  {feature.title}
                </h3>
                
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>

                {/* Subtle glow effect */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-noteflow-400/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to action */}
        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <p className="text-lg text-gray-300 mb-6">
            Ready to experience AI-enhanced note-taking?
          </p>
          <a 
            href="#editor-section"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-noteflow-600 to-purple-600 hover:from-noteflow-500 hover:to-purple-500 text-white px-8 py-4 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-noteflow-500/25"
          >
            Try It Now - Free
            <Zap className="h-5 w-5" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default AIFeatures;
