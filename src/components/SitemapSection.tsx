import React from 'react';
import { motion } from "framer-motion";
import { FileText, Shield, Coffee, Mail } from 'lucide-react';

const SitemapSection = () => {
  const sitemapLinks = [
    {
      category: "Main Pages",
      icon: FileText,
      links: [
        { name: "Home", href: "/", description: "Main landing page with editor" },
        { name: "Features", href: "/#features", description: "Learn about our AI-powered features" },
        { name: "Our Technologies", href: "/#sponsors", description: "Technologies powering our platform" },
        { name: "Contact Us", href: "/contactus", description: "Get in touch with our team" }
      ]
    },
    {
      category: "Legal & Privacy",
      icon: Shield,
      links: [
        { name: "Privacy Policy", href: "/privacy-policy", description: "How we protect your data" },
        { name: "Terms of Use", href: "/terms-of-use", description: "Service usage terms" },
        { name: "Cookie Settings", href: "/cookie-settings", description: "Manage your cookie preferences" }
      ]
    },
    {
      category: "Support & Contact",
      icon: Coffee,
      links: [
        { name: "Buy Me a Coffee", href: "https://www.buymeacoffee.com/onlinenoteai", description: "Support our free service", external: true },
        { name: "Contact Us", href: "/contactus", description: "Get help from our support team" },
        { name: "Email Support", href: "mailto:info@onlinenote.ai", description: "Direct email support", external: true }
      ]
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
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  return (
    <section className="py-16 px-4 relative overflow-hidden">
      <div className="container mx-auto max-w-6xl relative z-10">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-noteflow-200 bg-clip-text text-transparent mb-4">
            Site Navigation
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Find everything you need to know about Online Note AI
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {sitemapLinks.map((category, categoryIndex) => (
            <motion.div
              key={categoryIndex}
              variants={itemVariants}
              className="group"
            >
              <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl p-6 h-full hover:border-noteflow-400/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(120,60,255,0.15)]">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-noteflow-500 to-purple-500 p-0.5">
                    <div className="w-full h-full bg-black/90 rounded-lg flex items-center justify-center">
                      <category.icon className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    {category.category}
                  </h3>
                </div>
                
                <div className="space-y-4">
                  {category.links.map((link, linkIndex) => (
                    <div key={linkIndex}>
                      <a 
                        href={link.href}
                        className="block group/link"
                        target={link.external ? "_blank" : undefined}
                        rel={link.external ? "noopener noreferrer" : undefined}
                      >
                        <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors">
                          <div className="w-2 h-2 rounded-full bg-noteflow-400 mt-2 flex-shrink-0"></div>
                          <div>
                            <h4 className="text-white font-medium group-hover/link:text-noteflow-300 transition-colors">
                              {link.name}
                              {link.external && (
                                <span className="text-xs text-gray-400 ml-1">↗</span>
                              )}
                            </h4>
                            <p className="text-sm text-gray-400 leading-relaxed">
                              {link.description}
                            </p>
                          </div>
                        </div>
                      </a>
                    </div>
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

export default SitemapSection;
