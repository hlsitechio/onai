
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContactForm from '@/components/ContactForm';
import { Mail, MessageSquare, Users, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const ContactUs = () => {
  const departments = [
    {
      name: "General Support",
      email: "info@onlinenote.ai",
      description: "For general questions and support",
      icon: Mail,
      responseTime: "24 hours"
    },
    {
      name: "Technical Support",
      email: "tech@onlinenote.ai", 
      description: "For technical issues and bug reports",
      icon: MessageSquare,
      responseTime: "12 hours"
    },
    {
      name: "Business Inquiries",
      email: "business@onlinenote.ai",
      description: "For partnerships and business opportunities", 
      icon: Users,
      responseTime: "48 hours"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#03010a] to-[#0a0518]">
      <Header />
      
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Hero Section */}
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white to-noteflow-200 bg-clip-text text-transparent mb-6">
              Contact Us
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Have questions about Online Note AI? Need help with our platform? We're here to help! 
              Reach out to us and we'll get back to you as soon as possible.
            </p>
          </motion.div>

          {/* Departments Grid */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {departments.map((dept, index) => (
              <motion.div
                key={dept.name}
                className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-noteflow-400/50 transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-noteflow-500 to-purple-500 p-0.5">
                    <div className="w-full h-full bg-black/90 rounded-lg flex items-center justify-center">
                      <dept.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{dept.name}</h3>
                    <div className="flex items-center gap-1 text-sm text-gray-400">
                      <Clock className="h-3 w-3" />
                      {dept.responseTime}
                    </div>
                  </div>
                </div>
                <p className="text-gray-300 mb-4">{dept.description}</p>
                <a 
                  href={`mailto:${dept.email}`}
                  className="text-noteflow-400 hover:text-noteflow-300 transition-colors text-sm font-medium"
                >
                  {dept.email}
                </a>
              </motion.div>
            ))}
          </motion.div>

          {/* Contact Form Section */}
          <motion.div 
            className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">Send us a Message</h2>
              <p className="text-gray-300">
                Fill out the form below and we'll get back to you within 24 hours.
              </p>
            </div>
            
            <ContactForm open={true} onOpenChange={() => {}} />
          </motion.div>

          {/* Additional Info */}
          <motion.div 
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className="bg-gradient-to-r from-noteflow-900/30 to-purple-900/30 rounded-xl p-8 border border-noteflow-500/20">
              <h3 className="text-2xl font-bold text-white mb-4">
                Need Immediate Help?
              </h3>
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                For urgent technical issues, you can also reach us directly at{' '}
                <a 
                  href="mailto:info@onlinenote.ai" 
                  className="text-noteflow-400 hover:text-noteflow-300 transition-colors"
                >
                  info@onlinenote.ai
                </a>
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="mailto:info@onlinenote.ai"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-noteflow-500 to-purple-500 hover:from-noteflow-600 hover:to-purple-600 text-white px-8 py-3 rounded-lg font-medium transition-all hover:scale-105 shadow-lg"
                >
                  <Mail className="h-5 w-5" />
                  Email Us Directly
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ContactUs;
