
import React from 'react';
import { motion } from "framer-motion";
import { 
  Zap, 
  Brain, 
  Shield, 
  MousePointer, 
  Type, 
  Sparkles, 
  Save, 
  Wand2, 
  MessageSquare, 
  Lightbulb, 
  FileText,
  CheckCircle,
  Star
} from 'lucide-react';

const WhyChooseUs = () => {
  const quickFeatures = [
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Start writing instantly. No delays, no setup.",
      gradient: "from-yellow-400 to-orange-500"
    },
    {
      icon: Brain,
      title: "AI-Powered",
      description: "Smart suggestions and content enhancement.",
      gradient: "from-noteflow-400 to-purple-500"
    },
    {
      icon: Shield,
      title: "Privacy First", 
      description: "Your notes stay private. Local storage with optional sync.",
      gradient: "from-green-400 to-blue-500"
    }
  ];

  const howItWorksSteps = [
    {
      icon: MousePointer,
      title: "Open & Start",
      description: "Simply open the app and start typing. No registration required.",
      step: "01"
    },
    {
      icon: Type,
      title: "Write Naturally",
      description: "Type your thoughts naturally. The editor adapts to your style.",
      step: "02"
    },
    {
      icon: Sparkles,
      title: "AI Enhancement",
      description: "Select text for AI suggestions and smart formatting.",
      step: "03"
    },
    {
      icon: Save,
      title: "Auto-Save",
      description: "Your work is automatically saved and synced.",
      step: "04"
    }
  ];

  const aiFeatures = [
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

  const premiumFeatures = [
    "No registration required - start immediately",
    "Advanced AI writing assistance",
    "Real-time collaboration features",
    "Offline mode with auto-sync",
    "Military-grade encryption",
    "Cross-platform compatibility",
    "Smart organization and tagging",
    "Export to multiple formats"
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
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  return (
    <section className="py-20 px-4 relative overflow-hidden">
      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Main Title */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-noteflow-200 bg-clip-text text-transparent mb-6">
            Why Choose Online Note AI?
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Everything you need for productive, intelligent note-taking in one seamless experience.
          </p>
        </motion.div>

        {/* Quick Features */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {quickFeatures.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group relative"
            >
              <div className="relative p-6 rounded-2xl bg-black/40 backdrop-blur-sm border border-white/10 hover:border-noteflow-400/50 transition-all duration-300 h-full hover:shadow-[0_0_30px_rgba(120,60,255,0.15)]">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.gradient} p-0.5 mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <div className="w-full h-full bg-black/90 rounded-xl flex items-center justify-center">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                
                <h3 className="text-lg font-bold text-white mb-3 group-hover:text-noteflow-300 transition-colors">
                  {feature.title}
                </h3>
                
                <p className="text-gray-400 text-sm leading-relaxed">
                  {feature.description}
                </p>

                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-noteflow-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* How It Works */}
        <motion.div 
          className="mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-noteflow-200 bg-clip-text text-transparent mb-4">
              How It Works
            </h3>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Get started in seconds with our streamlined process.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorksSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center group"
              >
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-noteflow-400 to-purple-500 flex items-center justify-center text-xl font-bold text-white shadow-lg mb-4">
                    {step.step}
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-noteflow-600/20 to-purple-600/20 border border-noteflow-400/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 mb-4">
                    <step.icon className="h-6 w-6 text-noteflow-300" />
                  </div>
                  <h4 className="text-lg font-bold text-white mb-2 group-hover:text-noteflow-300 transition-colors">
                    {step.title}
                  </h4>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* AI Features */}
        <motion.div 
          className="mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-noteflow-200 bg-clip-text text-transparent mb-4">
              AI-Powered Features
            </h3>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Experience intelligent features that enhance your productivity and creativity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {aiFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative"
              >
                <div className="relative p-6 rounded-2xl bg-black/40 backdrop-blur-sm border border-white/10 hover:border-noteflow-400/50 transition-all duration-300 h-full overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                  
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} p-0.5 mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <div className="w-full h-full bg-black/90 rounded-xl flex items-center justify-center">
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  
                  <h4 className="text-lg font-bold text-white mb-3 group-hover:text-noteflow-300 transition-colors">
                    {feature.title}
                  </h4>
                  
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {feature.description}
                  </p>

                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-noteflow-400/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Premium Features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-r from-black/40 to-black/20 backdrop-blur-sm border border-white/10 rounded-2xl p-8"
        >
          <div className="text-center mb-8">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-noteflow-600/20 border border-noteflow-400/30 text-noteflow-300 text-sm font-medium mb-4">
              <Star className="h-4 w-4" />
              Premium Features
            </span>
            <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white to-noteflow-200 bg-clip-text text-transparent mb-4">
              Everything You Need, Nothing You Don't
            </h3>
            <p className="text-gray-300 max-w-2xl mx-auto">
              While others overwhelm you with features, we focus on what matters most.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {premiumFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="flex items-center gap-3 group"
              >
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-white" />
                </div>
                <span className="text-gray-300 group-hover:text-white transition-colors">
                  {feature}
                </span>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <a 
              href="#editor-section"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-noteflow-600 to-purple-600 hover:from-noteflow-500 hover:to-purple-500 text-white px-8 py-4 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-noteflow-500/25"
            >
              <Zap className="h-5 w-5" />
              Get Started Free
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
