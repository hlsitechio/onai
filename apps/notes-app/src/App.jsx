import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { 
  Brain, Users, FileText, Search, Shield, RefreshCw, 
  Star, ArrowRight, Play, Sparkles, Zap, Globe,
  Mail, Phone, MapPin, Send, Check, X, Menu,
  ChevronDown, ExternalLink, Award, Target,
  Code, Briefcase, Heart, Coffee, Building,
  Lock, Database, Cloud, Cpu, Layers, Settings,
  Clock
} from 'lucide-react';
import onaiLogo from './assets/onai-logo.png';
import './App.css';

// --- Layout Components ---
const Layout = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const navItems = {
    Product: [
      { name: 'Features', path: '/features', icon: Sparkles },
      { name: 'Pricing', path: '/pricing', icon: Zap },
      { name: 'Security', path: '/security', icon: Shield },
      { name: 'Integrations', path: '/integrations', icon: Layers },
    ],
    Company: [
      { name: 'About', path: '/about', icon: Building },
      { name: 'Blog', path: '/blog', icon: FileText },
      { name: 'Careers', path: '/careers', icon: Briefcase },
      { name: 'Contact', path: '/contact', icon: Mail },
    ],
  };

  const footerLinks = {
    Product: navItems.Product,
    Company: navItems.Company,
    Legal: [
      { name: 'Terms of Service', path: '/terms', icon: FileText },
      { name: 'Privacy Policy', path: '/privacy', icon: Lock },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 text-gray-100 overflow-x-hidden font-sans relative">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute inset-0 bg-dot-pattern opacity-10"></div>
        <div className="absolute inset-0 bg-line-pattern opacity-5"></div>
        {/* Floating Dots */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-br from-purple-500 to-blue-500 filter blur-xl"
            style={{
              width: `${Math.random() * 30 + 10}px`,
              height: `${Math.random() * 30 + 10}px`,
              opacity: Math.random() * 0.3 + 0.1,
            }}
            initial={{ 
              x: `${Math.random() * 100}vw`, 
              y: `${Math.random() * 100}vh` 
            }}
            animate={{
              x: [`${Math.random() * 100}vw`, `${Math.random() * 100}vw`],
              y: [`${Math.random() * 100}vh`, `${Math.random() * 100}vh`],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: Math.random() * 10 + 15,
              repeat: Infinity,
              repeatType: 'mirror',
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Navigation */}
      <motion.nav 
        className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-xl border-b border-white/10 shadow-lg"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center space-x-2 group">
                <img src={onaiLogo} alt="ONAI Logo" className="h-8 w-auto transition-transform duration-300 group-hover:scale-110" />
              </Link>
            </div>
            <div className="hidden md:flex md:items-center md:space-x-6">
              {Object.entries(navItems).map(([section, items]) => (
                <NavDropdown key={section} title={section} items={items} />
              ))}
              <Link 
                to="https://xvrihqrb.manus.space"
                target="_blank"
                rel="noopener noreferrer"
                className="relative inline-flex items-center justify-center px-5 py-2 overflow-hidden font-medium text-indigo-400 transition duration-300 ease-out border-2 border-indigo-500 rounded-full shadow-md group"
              >
                <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-indigo-600 group-hover:translate-x-0 ease">
                  <ExternalLink className="w-5 h-5" />
                </span>
                <span className="absolute flex items-center justify-center w-full h-full text-indigo-400 transition-all duration-300 transform group-hover:translate-x-full ease">Try ONAI Free</span>
                <span className="relative invisible">Try ONAI Free</span>
              </Link>
            </div>
            <div className="-mr-2 flex md:hidden">
              <button
                onClick={toggleMobileMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
              >
                <span className="sr-only">Open main menu</span>
                {isMobileMenuOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              className="md:hidden bg-black/50 backdrop-blur-lg"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                {Object.entries(navItems).map(([section, items]) => (
                  <div key={section} className="pt-2">
                    <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">{section}</h3>
                    {items.map((item) => (
                      <Link
                        key={item.name}
                        to={item.path}
                        onClick={toggleMobileMenu}
                        className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700"
                      >
                        <item.icon className="mr-3 h-5 w-5 text-indigo-400" />
                        {item.name}
                      </Link>
                    ))}
                  </div>
                ))}
                <Link 
                  to="https://xvrihqrb.manus.space"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={toggleMobileMenu}
                  className="block w-full text-center mt-4 px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Try ONAI Free
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Main Content Area */}
      <main className="pt-16">
        {children}
      </main>

      {/* Footer */}
      <footer className="relative py-12 px-4 sm:px-6 lg:px-8 bg-black/40 backdrop-blur-xl border-t border-white/10 z-10 mt-20">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1 mb-8 md:mb-0">
            <Link to="/" className="flex items-center space-x-3 mb-4 group">
              <img src={onaiLogo} alt="ONAI Logo" className="h-10 w-auto transition-transform duration-300 group-hover:scale-110" />
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              AI-Powered Note Taking Reimagined. Experience the future of productivity.
            </p>
          </div>
          {Object.entries(footerLinks).map(([section, items]) => (
            <div key={section}>
              <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase mb-4">{section}</h3>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item.name}>
                    <Link 
                      to={item.path} 
                      className="text-sm text-gray-400 hover:text-indigo-400 transition-colors duration-200 flex items-center group"
                    >
                      <item.icon className="w-4 h-4 mr-2 opacity-70 group-hover:opacity-100 transition-opacity" />
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 border-t border-white/10 pt-8 text-center">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} onlinenote.ai. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

// --- Navigation Dropdown Component ---
const NavDropdown = ({ title, items }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-300 hover:text-indigo-400 transition-colors duration-200">
        <span>{title}</span>
        <ChevronDown className={`ml-1 h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 mt-2 w-56 origin-top-left rounded-md shadow-lg bg-gray-800/80 backdrop-blur-md ring-1 ring-white/10 focus:outline-none"
          >
            <div className="py-1">
              {items.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="flex items-center px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-indigo-600/50 transition-colors duration-200"
                >
                  <item.icon className="mr-3 h-5 w-5 text-indigo-400" />
                  {item.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Page Components (Placeholders initially) ---
const HomePage = () => {
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 0.3], [1, 0.95]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0.9]);

  return (
    <>
      {/* Hero Section - Clean Design */}
      <motion.section 
        className="relative flex items-center justify-center min-h-screen text-center px-4 sm:px-6 lg:px-8"
        style={{ scale, opacity }}
      >
        {/* Simple Dark Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-slate-900 to-black"></div>
        
        <div className="max-w-6xl relative z-10">
          <motion.div 
            className="mb-12 flex justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <img 
              src={onaiLogo} 
              alt="ONAI Logo" 
              className="h-20 md:h-28 w-auto filter drop-shadow-[0_0_30px_rgba(168,85,247,0.6)]"
            />
          </motion.div>
          
          <motion.h1 
            className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight mb-8 bg-gradient-to-r from-white via-purple-200 to-blue-200 text-transparent bg-clip-text"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            AI-Powered Notes
          </motion.h1>
          
          <motion.p 
            className="max-w-3xl mx-auto text-xl sm:text-2xl text-gray-300 mb-16 leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Transform your thoughts into organized, intelligent notes with ONAI's revolutionary AI assistant. Experience the future of productivity with enterprise-grade security and seamless collaboration.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row justify-center items-center space-y-6 sm:space-y-0 sm:space-x-8 mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <Link 
              to="https://xvrihqrb.manus.space"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center justify-center px-12 py-4 text-xl font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/25 hover:scale-105"
            >
              <span className="absolute inset-0 bg-white opacity-0 transition-opacity duration-300 group-hover:opacity-10"></span>
              <Play className="w-6 h-6 mr-3 transition-transform duration-300 group-hover:scale-110" />
              Try ONAI Free
            </Link>
            
            <Link 
              to="/features"
              className="group inline-flex items-center justify-center px-12 py-4 text-xl font-semibold text-purple-300 bg-transparent border-2 border-purple-500/30 rounded-2xl transition-all duration-300 hover:bg-purple-500/10 hover:border-purple-400 hover:text-purple-200"
            >
              Learn More
              <ArrowRight className="w-6 h-6 ml-3 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </motion.div>

          {/* Real App Screenshot Showcase */}
          <motion.div
            className="max-w-5xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1 }}
          >
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
              <img
                src="/screenshots/onai-app-with-content.png"
                alt="ONAI Application Interface"
                className="relative w-full rounded-2xl shadow-2xl border border-white/10 backdrop-blur-sm"
              />
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section - Clean Grid */}
      <section className="relative py-32 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-slate-900"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl sm:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Discover the comprehensive suite of AI-powered tools designed to revolutionize your note-taking experience.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Brain, title: 'AI-Powered Intelligence', description: 'Advanced neural networks provide intelligent suggestions, auto-organization, and content generation with unprecedented accuracy.' },
              { icon: Users, title: 'Real-Time Collaboration', description: 'Seamless multi-user editing with live cursors, comments, and shared workspaces powered by enterprise-grade infrastructure.' },
              { icon: FileText, title: 'Rich Text Editing', description: 'Professional-grade editor offering advanced formatting options, multimedia embedding, and customizable templates.' },
              { icon: Search, title: 'Intelligent Search', description: 'AI-powered semantic search that understands context, meaning, and relationships across all your notes.' },
              { icon: Shield, title: 'Enterprise Security', description: 'Military-grade encryption and zero-trust architecture to protect your most sensitive information.' },
              { icon: RefreshCw, title: 'Cross-Platform Sync', description: 'Instant synchronization across all devices with conflict resolution and offline-first architecture.' },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="group relative p-8 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl border border-white/10 shadow-xl overflow-hidden backdrop-blur-lg"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
              >
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-600/10 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="mb-6 inline-flex items-center justify-center p-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 shadow-lg">
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="relative py-32 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-gray-900 to-black"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.h2
            className="text-4xl sm:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            Ready to Transform Your Notes?
          </motion.h2>
          
          <motion.p
            className="text-xl text-gray-300 mb-12 leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Join thousands of users experiencing the future of productivity. Get started with ONAI for free today!
          </motion.p>
          
          <motion.div
            className="flex flex-col sm:flex-row justify-center items-center space-y-6 sm:space-y-0 sm:space-x-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link 
              to="https://xvrihqrb.manus.space"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center justify-center px-12 py-4 text-xl font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/25 hover:scale-105"
            >
              <span className="absolute inset-0 bg-white opacity-0 transition-opacity duration-300 group-hover:opacity-10"></span>
              <Play className="w-6 h-6 mr-3 transition-transform duration-300 group-hover:scale-110" />
              Start Free Trial
            </Link>
            
            <Link 
              to="/pricing"
              className="group inline-flex items-center justify-center px-12 py-4 text-xl font-semibold text-purple-300 bg-transparent border-2 border-purple-500/30 rounded-2xl transition-all duration-300 hover:bg-purple-500/10 hover:border-purple-400 hover:text-purple-200"
            >
              View Pricing
              <ArrowRight className="w-6 h-6 ml-3 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
};

const PricingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-5xl sm:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Choose the perfect plan for your productivity needs. Start free and upgrade as you grow.
          </p>
        </div>
      </div>
    </div>
  );
};
              Trusted by Thousands
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { value: '10x', label: 'Productivity Boost' },
              { value: '99.99%', label: 'Uptime Guarantee' },
              { value: '24/7', label: 'Premium Support' },
              { value: '1M+', label: 'Happy Users' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="text-center p-8 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-3xl border border-white/10 backdrop-blur-sm"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-400 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-purple-900/20 to-black"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl sm:text-7xl font-black mb-8 bg-gradient-to-r from-white via-purple-200 to-blue-200 text-transparent bg-clip-text">
              Ready to Transform Your Notes?
            </h2>
            <p className="text-xl sm:text-2xl text-gray-300 mb-12 leading-relaxed">
              Join thousands of users experiencing the future of productivity
            </p>
            
            <Link 
              to="https://xvrihqrb.manus.space"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center justify-center px-16 py-6 text-2xl font-bold text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/25 hover:scale-105"
            >
              <span className="absolute inset-0 bg-white opacity-0 transition-opacity duration-300 group-hover:opacity-10"></span>
              <Play className="w-8 h-8 mr-4 transition-transform duration-300 group-hover:scale-110" />
              Get Started with ONAI for Free
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
};

const FeaturesPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-5xl sm:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text">
            Powerful Features
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Discover the comprehensive suite of AI-powered tools designed to revolutionize your note-taking experience.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { icon: Brain, title: 'AI-Powered Intelligence', description: 'Advanced neural networks provide intelligent suggestions and auto-organization.' },
            { icon: Users, title: 'Real-Time Collaboration', description: 'Seamless multi-user editing with live cursors and shared workspaces.' },
            { icon: FileText, title: 'Rich Text Editing', description: 'Professional-grade editor with advanced formatting options.' },
            { icon: Search, title: 'Intelligent Search', description: 'AI-powered semantic search that understands context and meaning.' },
            { icon: Shield, title: 'Enterprise Security', description: 'Military-grade encryption and zero-trust architecture.' },
            { icon: RefreshCw, title: 'Cross-Platform Sync', description: 'Instant synchronization across all devices.' },
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="p-8 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl border border-white/10"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center mb-6">
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

const PricingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-5xl sm:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Choose the plan that's right for you and start experiencing the future of note-taking.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Free Plan */}
          <motion.div
            className="p-8 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl border border-white/10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-xl font-bold mb-2">Free</h3>
            <div className="text-3xl font-bold mb-6">$0<span className="text-lg text-gray-400 font-normal">/month</span></div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                <span>Basic note-taking features</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                <span>Up to 50 notes</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                <span>Limited AI suggestions</span>
              </li>
            </ul>
            <Link 
              to="https://xvrihqrb.manus.space"
              className="block w-full py-3 text-center rounded-xl border border-purple-500/50 text-purple-300 hover:bg-purple-500/10 transition-colors"
            >
              Get Started
            </Link>
          </motion.div>
          
          {/* Pro Plan */}
          <motion.div
            className="p-8 bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-2xl border border-purple-500/30 shadow-xl relative"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
              POPULAR
            </div>
            <h3 className="text-xl font-bold mb-2">Pro</h3>
            <div className="text-3xl font-bold mb-6">$9<span className="text-lg text-gray-400 font-normal">/month</span></div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                <span>All Free features</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                <span>Unlimited notes</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                <span>Full AI capabilities</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                <span>Real-time collaboration</span>
              </li>
            </ul>
            <Link 
              to="https://xvrihqrb.manus.space"
              className="block w-full py-3 text-center rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-lg hover:shadow-purple-500/25 transition-all"
            >
              Start Free Trial
            </Link>
          </motion.div>
          
          {/* Enterprise Plan */}
          <motion.div
            className="p-8 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl border border-white/10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-xl font-bold mb-2">Enterprise</h3>
            <div className="text-3xl font-bold mb-6">Custom</div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                <span>All Pro features</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                <span>SSO integration</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                <span>Advanced security</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                <span>Dedicated support</span>
              </li>
            </ul>
            <Link 
              to="/contact"
              className="block w-full py-3 text-center rounded-xl border border-purple-500/50 text-purple-300 hover:bg-purple-500/10 transition-colors"
            >
              Contact Sales
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const SecurityPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-5xl sm:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text">
            Enterprise Security
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Military-grade security and zero-trust architecture to protect your most sensitive information.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { icon: Shield, title: 'End-to-End Encryption', description: 'AES-256 encryption ensures your data is secure at rest and in transit.' },
            { icon: Lock, title: 'Zero-Trust Architecture', description: 'Every access request is verified, regardless of location or user.' },
            { icon: Database, title: 'Secure Data Storage', description: 'Your data is stored in SOC 2 compliant data centers.' },
            { icon: Cloud, title: 'Privacy by Design', description: 'Built with privacy as a core principle, not an afterthought.' },
            { icon: Cpu, title: 'Regular Security Audits', description: 'Third-party security audits ensure ongoing protection.' },
            { icon: Settings, title: 'Compliance Ready', description: 'GDPR, HIPAA, and SOX compliance built-in.' },
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="p-8 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl border border-white/10"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center mb-6">
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

const IntegrationsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-5xl sm:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text">
            Powerful Integrations
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Connect ONAI with your favorite tools and streamline your workflow.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { icon: Globe, title: 'Slack Integration', description: 'Share notes and collaborate directly in Slack channels.' },
            { icon: Mail, title: 'Email Sync', description: 'Automatically create notes from important emails.' },
            { icon: Calendar, title: 'Calendar Integration', description: 'Sync meeting notes with your calendar events.' },
            { icon: Code, title: 'GitHub Integration', description: 'Link notes to code repositories and issues.' },
            { icon: Database, title: 'API Access', description: 'Build custom integrations with our REST API.' },
            { icon: Cloud, title: 'Cloud Storage', description: 'Sync with Google Drive, Dropbox, and OneDrive.' },
          ].map((integration, index) => (
            <motion.div
              key={index}
              className="p-8 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl border border-white/10"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center mb-6">
                <integration.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4">{integration.title}</h3>
              <p className="text-gray-400">{integration.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-5xl sm:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text">
            About ONAI
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            We're revolutionizing the way people capture, organize, and interact with information through the power of artificial intelligence.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-gray-400 mb-6 leading-relaxed">
              At ONAI, we believe that note-taking should be intelligent, intuitive, and effortless. Our AI-powered platform transforms the traditional note-taking experience into a dynamic, collaborative workspace that adapts to your thinking patterns.
            </p>
            <p className="text-gray-400 leading-relaxed">
              Founded by a team of AI researchers and productivity experts, we're committed to building tools that amplify human intelligence rather than replace it.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-8">
            {[
              { value: '1M+', label: 'Active Users' },
              { value: '50M+', label: 'Notes Created' },
              { value: '99.9%', label: 'Uptime' },
              { value: '24/7', label: 'Support' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="text-center p-6 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl border border-white/10"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="text-3xl font-bold text-purple-400 mb-2">{stat.value}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

          {/* Enhanced CTA Section */}
          <motion.div
            className="relative max-w-5xl mx-auto text-center bg-gradient-to-br from-indigo-900/80 via-purple-900/70 to-blue-900/80 rounded-3xl p-12 md:p-16 border border-white/20 shadow-2xl backdrop-blur-xl overflow-hidden"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
          >
            {/* Animated Background Elements */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full blur-3xl"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-full blur-2xl"></div>
            </div>

            <div className="relative z-10">
              <motion.h2 
                className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 text-white leading-tight"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5 }}
              >
                Ready to Revolutionize Your Notes?
              </motion.h2>
              <motion.p 
                className="text-xl text-gray-200 mb-10 max-w-3xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                Join thousands of users experiencing the future of productivity. Get started with ONAI for free today!
              </motion.p>
              <motion.div
                className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Link 
                  to="https://xvrihqrb.manus.space"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative inline-flex items-center justify-center px-10 py-4 text-lg font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full overflow-hidden transition-all duration-300 ease-in-out hover:from-purple-700 hover:to-indigo-700 hover:shadow-xl hover:shadow-purple-500/50 transform hover:scale-105"
                >
                  <span className="absolute left-0 top-0 w-full h-full bg-white opacity-0 transition-opacity duration-300 group-hover:opacity-10"></span>
                  <Zap className="w-6 h-6 mr-3 transition-transform duration-300 group-hover:scale-110" />
                  Try ONAI Free Now
                </Link>
                <div className="text-sm text-gray-300 flex items-center">
                  <Check className="w-4 h-4 mr-2 text-green-400" />
                  No credit card required
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

const FeaturesPage = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <motion.h1 
      className="text-4xl sm:text-5xl font-extrabold text-center mb-6 bg-gradient-to-r from-purple-400 via-indigo-400 to-blue-400 text-transparent bg-clip-text"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      Powerful Features
    </motion.h1>
    <motion.p 
      className="text-lg text-gray-400 text-center mb-16 max-w-3xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      Discover the comprehensive suite of AI-powered tools designed to revolutionize your note-taking experience.
    </motion.p>
    
    {[ /* Feature sections content here - adapted from previous implementation */
      { icon: Brain, title: 'AI-Powered Intelligence', details: 'Our advanced neural networks analyze your writing patterns and provide intelligent suggestions, auto-organization, and content generation with unprecedented accuracy.', points: ['Smart auto-completion', 'Content suggestions', 'Automatic categorization', 'Writing enhancement'] },
      { icon: Users, title: 'Real-Time Collaboration', details: 'Seamless multi-user editing with live cursors, comments, and shared workspaces powered by enterprise-grade infrastructure.', points: ['Live collaborative editing', 'Real-time comments', 'Shared workspaces', 'Version control'] },
      { icon: FileText, title: 'Rich Text Editing', details: 'A professional-grade editor offering advanced formatting options, multimedia embedding (images, videos, code blocks), and customizable templates.', points: ['Markdown support', 'Code syntax highlighting', 'Embeddable media', 'Custom templates'] },
      { icon: Search, title: 'Intelligent Search', details: 'Go beyond keyword search. ONAI understands context, meaning, and relationships across all your notes for truly intelligent information retrieval.', points: ['Semantic search', 'Natural language queries', 'Cross-note linking', 'Tag-based filtering'] },
      { icon: Shield, title: 'Enterprise Security', details: 'Protect your sensitive information with military-grade encryption, zero-trust architecture, and regular security audits.', points: ['End-to-end encryption', 'Role-based access control', 'Compliance certifications (SOC 2, ISO 27001)', 'Data residency options'] },
      { icon: RefreshCw, title: 'Cross-Platform Sync', details: 'Access your notes anywhere, anytime. ONAI syncs instantly across web, desktop, and mobile apps, even when offline.', points: ['Real-time synchronization', 'Offline access', 'Conflict resolution', 'Native apps for all platforms'] },
    ].map((feature, index) => (
      <motion.div 
        key={feature.title}
        className="mb-16 p-8 bg-gradient-to-br from-gray-900/50 to-indigo-900/30 rounded-2xl border border-white/10 shadow-xl backdrop-blur-lg flex flex-col md:flex-row items-center gap-8"
        initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
      >
        <div className="flex-shrink-0 mb-6 md:mb-0">
          <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg">
            <feature.icon className="w-12 h-12 text-white" />
          </div>
        </div>
        <div className="flex-grow">
          <h2 className="text-2xl font-semibold text-gray-100 mb-3">{feature.title}</h2>
          <p className="text-gray-400 mb-4">{feature.details}</p>
          <ul className="space-y-2">
            {feature.points.map(point => (
              <li key={point} className="flex items-center text-gray-300">
                <Check className="w-4 h-4 mr-2 text-green-500 flex-shrink-0" />
                {point}
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    ))}
  </div>
);

const PricingPage = () => {
  const plans = [
    {
      name: 'Free', price: '$0', period: 'Forever', description: 'Essential features for individuals.', 
      features: ['Up to 100 notes', 'Basic AI suggestions', 'Standard collaboration', 'Community support'],
      buttonText: 'Get Started Free', isPopular: false
    },
    {
      name: 'Pro', price: '$9', period: '/ month', description: 'Advanced features for power users and small teams.', 
      features: ['Unlimited notes', 'Advanced AI assistant', 'Priority collaboration features', 'Premium templates', 'Priority email support'],
      buttonText: 'Upgrade to Pro', isPopular: true
    },
    {
      name: 'Enterprise', price: 'Custom', period: '', description: 'Tailored solutions for large organizations.', 
      features: ['Everything in Pro', 'Dedicated account manager', 'Custom integrations', 'Advanced security & compliance', 'SLA & premium support'],
      buttonText: 'Contact Sales', isPopular: false
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <motion.h1 
        className="text-4xl sm:text-5xl font-extrabold text-center mb-6 bg-gradient-to-r from-purple-400 via-indigo-400 to-blue-400 text-transparent bg-clip-text"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Simple, Transparent Pricing
      </motion.h1>
      <motion.p 
        className="text-lg text-gray-400 text-center mb-16 max-w-2xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Choose the plan that fits your needs. Start free, upgrade anytime.
      </motion.p>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        {plans.map((plan, index) => (
          <motion.div 
            key={plan.name}
            className={`relative p-8 rounded-3xl border shadow-xl backdrop-blur-lg flex flex-col ${plan.isPopular ? 'border-purple-500 bg-gradient-to-br from-indigo-900/70 to-purple-900/50 scale-105 z-10' : 'border-white/10 bg-gradient-to-br from-gray-900/50 to-indigo-900/30'}`}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            {plan.isPopular && (
              <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2">
                <span className="inline-flex items-center px-4 py-1 rounded-full text-sm font-semibold bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-md">
                  Most Popular
                </span>
              </div>
            )}
            <div className="flex-grow">
              <h2 className={`text-2xl font-semibold mb-4 ${plan.isPopular ? 'text-white' : 'text-gray-100'}`}>{plan.name}</h2>
              <p className={`text-4xl font-bold mb-1 ${plan.isPopular ? 'text-white' : 'text-gray-100'}`}>{plan.price}<span className="text-lg font-normal text-gray-400">{plan.period}</span></p>
              <p className="text-sm text-gray-400 mb-6 h-10">{plan.description}</p>
              <ul className="space-y-3 mb-8">
                {plan.features.map(feature => (
                  <li key={feature} className="flex items-start">
                    <Check className={`w-5 h-5 mr-2 flex-shrink-0 ${plan.isPopular ? 'text-purple-400' : 'text-green-500'}`} />
                    <span className="text-sm text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Link 
              to={plan.name === 'Enterprise' ? '/contact?subject=Enterprise Inquiry' : (plan.name === 'Pro' ? 'https://xvrihqrb.manus.space/upgrade' : 'https://xvrihqrb.manus.space')}
              target={plan.name !== 'Enterprise' ? '_blank' : '_self'}
              rel={plan.name !== 'Enterprise' ? 'noopener noreferrer' : ''}
              className={`block w-full text-center px-6 py-3 rounded-full font-medium transition-all duration-300 ${plan.isPopular ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 shadow-lg hover:shadow-purple-500/50' : 'bg-indigo-600/50 text-indigo-300 hover:bg-indigo-600 hover:text-white border border-indigo-600'}`}
            >
              {plan.buttonText}
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const SecurityPage = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <motion.h1 
      className="text-4xl sm:text-5xl font-extrabold text-center mb-6 bg-gradient-to-r from-purple-400 via-indigo-400 to-blue-400 text-transparent bg-clip-text"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      Enterprise-Grade Security
    </motion.h1>
    <motion.p 
      className="text-lg text-gray-400 text-center mb-16 max-w-3xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      Your data's safety is our top priority. We employ industry-leading security measures to protect your information.
    </motion.p>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl font-semibold text-gray-100 mb-4">Our Security Commitment</h2>
        <p className="text-gray-400 leading-relaxed mb-6">
          ONAI is built on a foundation of security. We utilize a multi-layered approach, combining advanced technology with strict protocols to ensure the confidentiality, integrity, and availability of your notes.
        </p>
        <ul className="space-y-3">
          <li className="flex items-start"><Shield className="w-6 h-6 mr-3 text-blue-400 flex-shrink-0 mt-1" /><span>End-to-End Encryption (E2EE) for all note content.</span></li>
          <li className="flex items-start"><Lock className="w-6 h-6 mr-3 text-blue-400 flex-shrink-0 mt-1" /><span>Zero-Trust Architecture implemented across our infrastructure.</span></li>
          <li className="flex items-start"><Database className="w-6 h-6 mr-3 text-blue-400 flex-shrink-0 mt-1" /><span>Secure data storage with encryption at rest (AES-256).</span></li>
          <li className="flex items-start"><Cloud className="w-6 h-6 mr-3 text-blue-400 flex-shrink-0 mt-1" /><span>Regular third-party security audits and penetration testing.</span></li>
        </ul>
      </motion.div>
      <motion.div 
        className="flex justify-center"
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Shield className="w-48 h-48 text-indigo-500 filter drop-shadow-[0_0_20px_rgba(99,102,241,0.5)]" />
      </motion.div>
    </div>

    <motion.h3 
      className="text-2xl font-semibold text-center mb-8 text-gray-100"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.5 }}
    >
      Key Security Features
    </motion.h3>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[ /* Security features content */
        { icon: Lock, title: 'End-to-End Encryption', description: 'Your note content is encrypted on your device before being sent to our servers.' },
        { icon: Users, title: 'Role-Based Access Control', description: 'Fine-grained permissions for team collaboration and sharing.' },
        { icon: Shield, title: 'Compliance Certifications', description: 'Adherence to SOC 2 Type II, ISO 27001, and GDPR standards.' },
        { icon: Cpu, title: 'Intrusion Detection Systems', description: '24/7 monitoring for suspicious activities and potential threats.' },
        { icon: Database, title: 'Data Backup & Recovery', description: 'Regular backups and disaster recovery plans to ensure data availability.' },
        { icon: Settings, title: 'Advanced Security Settings', description: 'Options for session management, 2FA, and audit logs.' },
      ].map((feature, index) => (
        <motion.div
          key={feature.title}
          className="p-6 bg-gradient-to-br from-gray-900/50 to-indigo-900/30 rounded-2xl border border-white/10 shadow-lg backdrop-blur-lg"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <div className="mb-4 inline-flex items-center justify-center p-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg">
            <feature.icon className="w-6 h-6 text-white" />
          </div>
          <h4 className="text-lg font-semibold text-gray-100 mb-2">{feature.title}</h4>
          <p className="text-sm text-gray-400">{feature.description}</p>
        </motion.div>
      ))}
    </div>
    <motion.div 
      className="mt-16 text-center"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.5 }}
    >
      <p className="text-gray-400 mb-4">Have security questions or want to report a vulnerability?</p>
      <Link 
        to="/contact?subject=Security Inquiry"
        className="inline-flex items-center px-6 py-3 rounded-full font-medium text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 shadow-lg hover:shadow-cyan-500/50"
      >
        Contact Security Team <ArrowRight className="w-4 h-4 ml-2" />
      </Link>
    </motion.div>
  </div>
);

const IntegrationsPage = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <motion.h1 
      className="text-4xl sm:text-5xl font-extrabold text-center mb-6 bg-gradient-to-r from-purple-400 via-indigo-400 to-blue-400 text-transparent bg-clip-text"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      Connect ONAI with Your Workflow
    </motion.h1>
    <motion.p 
      className="text-lg text-gray-400 text-center mb-16 max-w-3xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      Seamlessly integrate ONAI with the tools you already use to streamline your productivity and centralize your knowledge.
    </motion.p>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {[ /* Integrations content */
        { name: 'Google Drive', status: 'Available', description: 'Sync notes and attachments.' },
        { name: 'Slack', status: 'Available', description: 'Share notes and receive updates.' },
        { name: 'Zapier', status: 'Available', description: 'Connect with thousands of apps.' },
        { name: 'Trello', status: 'Available', description: 'Link notes to Trello cards.' },
        { name: 'GitHub', status: 'Coming Soon', description: 'Attach notes to issues and PRs.' },
        { name: 'Jira', status: 'Coming Soon', description: 'Integrate notes with Jira tickets.' },
        { name: 'Notion', status: 'Coming Soon', description: 'Import/Export notes.' },
        { name: 'Figma', status: 'Coming Soon', description: 'Embed Figma designs in notes.' },
        { name: 'Microsoft Teams', status: 'Coming Soon', description: 'Share and collaborate within Teams.' },
        { name: 'Google Calendar', status: 'Coming Soon', description: 'Link notes to calendar events.' },
        { name: 'Outlook', status: 'Coming Soon', description: 'Save emails as notes.' },
        { name: 'Salesforce', status: 'Enterprise Only', description: 'Link notes to CRM records.' },
      ].map((integration, index) => (
        <motion.div
          key={integration.name}
          className="relative p-6 bg-gradient-to-br from-gray-900/50 to-indigo-900/30 rounded-2xl border border-white/10 shadow-lg backdrop-blur-lg flex flex-col justify-between"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.4, delay: index * 0.05 }}
        >
          <div>
            <h3 className="text-lg font-semibold text-gray-100 mb-2">{integration.name}</h3>
            <p className="text-sm text-gray-400 mb-4 h-10">{integration.description}</p>
          </div>
          <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full self-start ${integration.status === 'Available' ? 'bg-green-500/20 text-green-400' : (integration.status === 'Coming Soon' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-blue-500/20 text-blue-400')}`}>
            {integration.status}
          </span>
        </motion.div>
      ))}
    </div>
    <motion.div 
      className="mt-16 text-center"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.5 }}
    >
      <p className="text-gray-400 mb-4">Don't see an integration you need?</p>
      <Link 
        to="/contact?subject=Integration Request"
        className="inline-flex items-center px-6 py-3 rounded-full font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-indigo-500/50"
      >
        Request Integration <ArrowRight className="w-4 h-4 ml-2" />
      </Link>
    </motion.div>
  </div>
);

const AboutPage = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <motion.h1 
      className="text-4xl sm:text-5xl font-extrabold text-center mb-6 bg-gradient-to-r from-purple-400 via-indigo-400 to-blue-400 text-transparent bg-clip-text"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      About ONAI
    </motion.h1>
    <motion.p 
      className="text-lg text-gray-400 text-center mb-16 max-w-3xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      Empowering individuals and teams to capture, organize, and unleash their collective intelligence through AI-powered note-taking.
    </motion.p>

    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
    >
      <motion.div variants={{ hidden: { opacity: 0, x: -50 }, visible: { opacity: 1, x: 0, transition: { duration: 0.6 } } }}>
        <h2 className="text-3xl font-semibold text-gray-100 mb-4">Our Story</h2>
        <p className="text-gray-400 leading-relaxed mb-4">
          ONAI was founded in 2023 by a team of AI researchers and productivity enthusiasts frustrated with the limitations of traditional note-taking apps. We envisioned a future where notes weren't just static text, but dynamic knowledge hubs powered by artificial intelligence.
        </p>
        <p className="text-gray-400 leading-relaxed">
          Our mission is to build the most intelligent, secure, and collaborative note-taking platform that adapts to your unique workflow and helps you achieve more.
        </p>
      </motion.div>
      <motion.div 
        className="flex justify-center"
        variants={{ hidden: { opacity: 0, scale: 0.8 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.6 } } }}
      >
        <img src={onaiLogo} alt="ONAI Logo Large" className="w-64 h-auto filter drop-shadow-[0_0_25px_rgba(168,85,247,0.4)]" />
      </motion.div>
    </motion.div>

    <motion.h3 
      className="text-2xl font-semibold text-center mb-8 text-gray-100"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.5 }}
    >
      Our Values
    </motion.h3>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {[ /* Values content */
        { icon: Brain, title: 'Innovation', description: 'Continuously pushing the boundaries of AI in productivity.' },
        { icon: Shield, title: 'Security', description: 'Protecting user data with the highest standards.' },
        { icon: Users, title: 'Collaboration', description: 'Building tools that enhance teamwork and knowledge sharing.' },
        { icon: Heart, title: 'User-Centricity', description: 'Designing intuitive experiences focused on user needs.' },
      ].map((value, index) => (
        <motion.div
          key={value.title}
          className="p-6 bg-gradient-to-br from-gray-900/50 to-indigo-900/30 rounded-2xl border border-white/10 shadow-lg backdrop-blur-lg text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <div className="mb-4 inline-flex items-center justify-center p-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg">
            <value.icon className="w-6 h-6 text-white" />
          </div>
          <h4 className="text-lg font-semibold text-gray-100 mb-2">{value.title}</h4>
          <p className="text-sm text-gray-400">{value.description}</p>
        </motion.div>
      ))}
    </div>
  </div>
);

const BlogPage = () => {
  // Sample blog posts - replace with actual data fetching
  const posts = [
    { id: 1, title: 'The Future of AI in Note Taking', date: 'June 1, 2025', category: 'AI & Productivity', excerpt: 'Explore how artificial intelligence is transforming the way we capture and organize information...' },
    { id: 2, title: 'Mastering Real-Time Collaboration with ONAI', date: 'May 25, 2025', category: 'Collaboration', excerpt: 'Learn tips and tricks for seamless teamwork using ONAI shared workspaces and live editing features...' },
    { id: 3, title: 'Why End-to-End Encryption Matters for Your Notes', date: 'May 18, 2025', category: 'Security', excerpt: 'Understand the importance of E2EE and how ONAI protects your most sensitive information...' },
    { id: 4, title: 'Boosting Productivity with Intelligent Search', date: 'May 11, 2025', category: 'Productivity Tips', excerpt: 'Discover how ONAI semantic search helps you find information faster and uncover hidden connections...' },
    { id: 5, title: 'ONAI Integration Spotlight: Connecting Your Workflow', date: 'May 4, 2025', category: 'Integrations', excerpt: 'Learn how to connect ONAI with tools like Google Drive and Slack to streamline your processes...' },
    { id: 6, title: 'From Our CEO: Our Vision for the Future of Knowledge Management', date: 'April 27, 2025', category: 'Company News', excerpt: 'Our CEO shares insights into the long-term vision for ONAI and the future of intelligent note-taking...' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <motion.h1 
        className="text-4xl sm:text-5xl font-extrabold text-center mb-6 bg-gradient-to-r from-purple-400 via-indigo-400 to-blue-400 text-transparent bg-clip-text"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        ONAI Blog
      </motion.h1>
      <motion.p 
        className="text-lg text-gray-400 text-center mb-16 max-w-3xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Insights, updates, and stories from the ONAI team on productivity, AI, and the future of note-taking.
      </motion.p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post, index) => (
          <motion.div
            key={post.id}
            className="relative p-6 bg-gradient-to-br from-gray-900/50 to-indigo-900/30 rounded-2xl border border-white/10 shadow-xl backdrop-blur-lg flex flex-col justify-between overflow-hidden group"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            <div className="flex-grow mb-4">
              <p className="text-xs text-indigo-400 uppercase tracking-wider mb-2">{post.category}</p>
              <h2 className="text-xl font-semibold text-gray-100 mb-3 group-hover:text-indigo-300 transition-colors duration-200">{post.title}</h2>
              <p className="text-sm text-gray-400 leading-relaxed mb-4">{post.excerpt}</p>
            </div>
            <div className="flex justify-between items-center text-xs text-gray-500">
              <span>{post.date}</span>
              <Link to={`/blog/${post.id}`} className="inline-flex items-center text-indigo-400 hover:text-indigo-300 transition-colors duration-200">
                Read More <ArrowRight className="w-3 h-3 ml-1" />
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
      {/* Add pagination if needed */}
    </div>
  );
};

const CareersPage = () => {
  const openPositions = [
    { title: 'Senior AI Engineer', location: 'Remote', department: 'Engineering' },
    { title: 'Product Manager - Collaboration', location: 'Remote / San Francisco', department: 'Product' },
    { title: 'Frontend Engineer (React)', location: 'Remote', department: 'Engineering' },
    { title: 'Marketing Manager', location: 'Remote / New York', department: 'Marketing' },
  ];

  const benefits = [
    { icon: Heart, title: 'Comprehensive Health Insurance' },
    { icon: Coffee, title: 'Generous Paid Time Off' },
    { icon: Briefcase, title: 'Remote Work Flexibility' },
    { icon: Award, title: 'Professional Development Budget' },
    { icon: Users, title: 'Collaborative Team Environment' },
    { icon: Star, title: 'Stock Options Plan' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <motion.h1 
        className="text-4xl sm:text-5xl font-extrabold text-center mb-6 bg-gradient-to-r from-purple-400 via-indigo-400 to-blue-400 text-transparent bg-clip-text"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Join the ONAI Team
      </motion.h1>
      <motion.p 
        className="text-lg text-gray-400 text-center mb-16 max-w-3xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Help us build the future of intelligent note-taking. We're looking for passionate individuals to join our mission.
      </motion.p>

      <motion.h2 
        className="text-3xl font-semibold text-center mb-10 text-gray-100"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.5 }}
      >
        Open Positions
      </motion.h2>
      <div className="space-y-6 mb-20">
        {openPositions.map((position, index) => (
          <motion.div
            key={index}
            className="p-6 bg-gradient-to-br from-gray-900/50 to-indigo-900/30 rounded-2xl border border-white/10 shadow-lg backdrop-blur-lg flex flex-col sm:flex-row justify-between items-start sm:items-center group"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div>
              <h3 className="text-xl font-semibold text-gray-100 mb-1 group-hover:text-indigo-300 transition-colors duration-200">{position.title}</h3>
              <p className="text-sm text-gray-400">{position.department} • {position.location}</p>
            </div>
            <Link 
              to={`/careers/${position.title.toLowerCase().replace(/ /g, '-')}`}
              className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 rounded-full text-sm font-medium text-indigo-300 bg-indigo-600/30 hover:bg-indigo-600/50 transition-colors duration-200 border border-indigo-600"
            >
              View Details <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </motion.div>
        ))}
      </div>

      <motion.h2 
        className="text-3xl font-semibold text-center mb-10 text-gray-100"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.5 }}
      >
        Why Work With Us?
      </motion.h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {benefits.map((benefit, index) => (
          <motion.div
            key={benefit.title}
            className="p-6 bg-gradient-to-br from-gray-900/50 to-indigo-900/30 rounded-2xl border border-white/10 shadow-lg backdrop-blur-lg text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className="mb-4 inline-flex items-center justify-center p-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg">
              <benefit.icon className="w-6 h-6 text-white" />
            </div>
            <h4 className="text-lg font-semibold text-gray-100">{benefit.title}</h4>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const ContactPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialSubject = queryParams.get('subject') || 'Support';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: initialSubject,
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // null, 'success', 'error'

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    // Simulate form submission (replace with actual API call)
    // In a real app, send data to info@onlinenote.ai via backend
    console.log('Form Data Submitted:', { ...formData, recipient: 'info@onlinenote.ai' });
    await new Promise(resolve => setTimeout(resolve, 1500)); 

    // Simulate success/error
    const success = Math.random() > 0.1; // 90% success rate for demo
    if (success) {
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: initialSubject, message: '' });
      setTimeout(() => setSubmitStatus(null), 5000);
    } else {
      setSubmitStatus('error');
    }
    setIsSubmitting(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <motion.h1 
        className="text-4xl sm:text-5xl font-extrabold text-center mb-6 bg-gradient-to-r from-purple-400 via-indigo-400 to-blue-400 text-transparent bg-clip-text"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Contact Us
      </motion.h1>
      <motion.p 
        className="text-lg text-gray-400 text-center mb-16 max-w-3xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        We're here to help! Reach out to us for support, sales inquiries, or any other questions.
      </motion.p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl font-semibold text-gray-100 mb-6">Get in Touch</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
              <input type="text" name="name" id="name" required value={formData.name} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg bg-gray-800/50 border border-white/10 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition duration-200" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
              <input type="email" name="email" id="email" required value={formData.email} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg bg-gray-800/50 border border-white/10 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition duration-200" />
            </div>
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-1">Subject</label>
              <select name="subject" id="subject" required value={formData.subject} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg bg-gray-800/50 border border-white/10 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition duration-200 appearance-none">
                <option>Support</option>
                <option>Sales</option>
                <option>After-sales</option>
                <option>Security</option>
                <option>Integration Request</option>
                <option>Enterprise Inquiry</option>
                <option>General Inquiry</option>
              </select>
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">Message</label>
              <textarea name="message" id="message" rows="4" required value={formData.message} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg bg-gray-800/50 border border-white/10 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition duration-200"></textarea>
            </div>
            <div>
              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center px-6 py-3 rounded-full font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-indigo-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full"></motion.div>
                    Sending...
                  </>
                ) : (
                  <><Send className="w-5 h-5 mr-2" /> Send Message</>
                )}
              </button>
            </div>
            {submitStatus === 'success' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 p-3 rounded-md bg-green-500/20 text-green-300 text-sm flex items-center">
                <Check className="w-5 h-5 mr-2" /> Message sent successfully! We'll get back to you soon.
              </motion.div>
            )}
            {submitStatus === 'error' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 p-3 rounded-md bg-red-500/20 text-red-300 text-sm flex items-center">
                <X className="w-5 h-5 mr-2" /> Something went wrong. Please try again later.
              </motion.div>
            )}
          </form>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-2xl font-semibold text-gray-100 mb-6">Contact Information</h2>
          <div className="space-y-6">
            <div className="flex items-start">
              <Mail className="w-6 h-6 mr-4 text-indigo-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-medium text-gray-200">Email</h3>
                <p className="text-gray-400">General Inquiries:</p>
                <a href="mailto:info@onlinenote.ai" className="text-indigo-400 hover:text-indigo-300 transition-colors">info@onlinenote.ai</a>
                <p className="text-gray-400 mt-2">All form submissions are routed here.</p>
              </div>
            </div>
            <div className="flex items-start">
              <MapPin className="w-6 h-6 mr-4 text-indigo-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-medium text-gray-200">Address</h3>
                <p className="text-gray-400">ONAI Headquarters<br />123 Innovation Drive<br />Tech City, CA 94000</p>
              </div>
            </div>
            <div className="flex items-start">
              <Clock className="w-6 h-6 mr-4 text-indigo-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-medium text-gray-200">Business Hours</h3>
                <p className="text-gray-400">Monday - Friday: 9:00 AM - 5:00 PM PST</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const TermsPage = () => (
  <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 prose prose-invert prose-lg prose-headings:text-transparent prose-headings:bg-clip-text prose-headings:bg-gradient-to-r prose-headings:from-purple-400 prose-headings:to-blue-400 prose-a:text-indigo-400 hover:prose-a:text-indigo-300">
    <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>Terms of Service</motion.h1>
    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.1 }} className="text-sm text-gray-500">Last Updated: June 4, 2025</motion.p>
    
    <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>
      <h2>1. Acceptance of Terms</h2>
      <p>By accessing or using the ONAI service ("Service"), provided by onlinenote.ai ("Company", "we", "us", "our"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to all of these Terms, do not use the Service.</p>
      
      <h2>2. Description of Service</h2>
      <p>ONAI is an AI-powered note-taking application designed to enhance productivity and collaboration. Features include note creation, organization, AI assistance, real-time collaboration, search, and cross-platform synchronization.</p>
      
      <h2>3. User Accounts</h2>
      <p>You may need to register for an account to access certain features. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.</p>
      
      <h2>4. User Content</h2>
      <p>You retain ownership of all content you create, upload, or store using the Service ("User Content"). By using the Service, you grant us a limited license to host, process, and display your User Content solely for the purpose of providing and improving the Service. We implement strong security measures, including end-to-end encryption where applicable, to protect your User Content.</p>
      
      <h2>5. Acceptable Use</h2>
      <p>You agree not to use the Service for any unlawful purpose or in any way that could harm the Service or impair anyone else's use of it. Prohibited activities include, but are not limited to: uploading malicious software, infringing intellectual property rights, harassing others, or attempting to gain unauthorized access to the Service.</p>
      
      <h2>6. AI Features</h2>
      <p>The Service includes features powered by artificial intelligence. While we strive for accuracy, AI-generated suggestions or content may contain errors or inaccuracies. You are responsible for reviewing and verifying any AI-generated output before relying on it.</p>
      
      <h2>7. Fees and Payment</h2>
      <p>Certain features or service tiers may require payment. All applicable fees will be clearly disclosed. Payments are typically processed through third-party payment processors. Failure to pay applicable fees may result in suspension or termination of access to paid features.</p>
      
      <h2>8. Intellectual Property</h2>
      <p>The Service, including its software, design, logos, and trademarks, is the exclusive property of onlinenote.ai and its licensors. All rights are reserved. You are granted a limited, non-exclusive, non-transferable license to use the Service according to these Terms. You may not copy, modify, distribute, sell, or lease any part of our Service or included software.</p>
      
      <h2>9. Termination</h2>
      <p>We may suspend or terminate your access to the Service at any time, for any reason, including violation of these Terms. You may stop using the Service and delete your account at any time.</p>
      
      <h2>10. Disclaimers and Limitation of Liability</h2>
      <p>THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. TO THE FULLEST EXTENT PERMITTED BY LAW, ONLINENOTE.AI DISCLAIMS ALL WARRANTIES, INCLUDING, BUT NOT LIMITED TO, IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. ONLINENOTE.AI WILL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING OUT OF OR RELATING TO YOUR USE OF THE SERVICE.</p>
      
      <h2>11. Governing Law</h2>
      <p>These Terms shall be governed by and construed in accordance with the laws of the State of California, without regard to its conflict of law principles.</p>
      
      <h2>12. Changes to Terms</h2>
      <p>We reserve the right to modify these Terms at any time. We will notify you of significant changes by posting the new Terms on the Service or by other means. Your continued use of the Service after such changes constitutes your acceptance of the new Terms.</p>
      
      <h2>13. Contact Information</h2>
      <p>If you have any questions about these Terms, please contact us at <a href="mailto:info@onlinenote.ai">info@onlinenote.ai</a>.</p>
    </motion.section>
  </div>
);

const PrivacyPage = () => (
  <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 prose prose-invert prose-lg prose-headings:text-transparent prose-headings:bg-clip-text prose-headings:bg-gradient-to-r prose-headings:from-purple-400 prose-headings:to-blue-400 prose-a:text-indigo-400 hover:prose-a:text-indigo-300">
    <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>Privacy Policy</motion.h1>
    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.1 }} className="text-sm text-gray-500">Last Updated: June 4, 2025</motion.p>
    
    <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>
      <h2>1. Introduction</h2>
      <p>onlinenote.ai ("Company", "we", "us", "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our ONAI service ("Service").</p>
      
      <h2>2. Information We Collect</h2>
      <p>We may collect the following types of information:</p>
      <ul>
        <li><strong>Personal Information:</strong> Name, email address, payment information (if applicable), and other information you provide during registration or use.</li>
        <li><strong>User Content:</strong> Notes, attachments, and other content you create or upload to the Service. Note content may be end-to-end encrypted, meaning we cannot access the decrypted content.</li>
        <li><strong>Usage Data:</strong> Information about how you interact with the Service, such as features used, time spent, IP address, browser type, device information, and crash reports.</li>
        <li><strong>AI Processing Data:</strong> To provide AI features, we may process User Content. This processing is done securely, and we implement measures to prevent unauthorized access. Where possible, processing occurs on-device or with anonymized data.</li>
      </ul>
      
      <h2>3. How We Use Your Information</h2>
      <p>We use the information we collect to:</p>
      <ul>
        <li>Provide, operate, and maintain the Service.</li>
        <li>Improve, personalize, and expand the Service.</li>
        <li>Understand and analyze how you use the Service.</li>
        <li>Develop new products, services, features, and functionality.</li>
        <li>Communicate with you, including for customer service, updates, and marketing purposes (with your consent where required).</li>
        <li>Process your transactions.</li>
        <li>Detect and prevent fraud and security issues.</li>
        <li>Comply with legal obligations.</li>
      </ul>
      
      <h2>4. How We Share Your Information</h2>
      <p>We do not sell your personal information. We may share information in the following circumstances:</p>
      <ul>
        <li><strong>With Service Providers:</strong> We may share information with third-party vendors who perform services on our behalf (e.g., payment processing, hosting, analytics).</li>
        <li><strong>For Collaboration:</strong> If you use collaboration features, certain information (like your name or email) may be visible to other users you collaborate with.</li>
        <li><strong>For Legal Reasons:</strong> We may disclose information if required by law or in response to valid requests by public authorities.</li>
        <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or asset sale, your information may be transferred.</li>
      </ul>
      
      <h2>5. Data Security</h2>
      <p>We implement robust security measures, including encryption (in transit and at rest, with E2EE for note content where applicable), access controls, and regular security assessments, to protect your information. However, no system is completely secure.</p>
      
      <h2>6. Data Retention</h2>
      <p>We retain your personal information for as long as necessary to provide the Service and fulfill the purposes outlined in this policy, or as required by law. You can delete your account and associated data through the Service settings.</p>
      
      <h2>7. Your Privacy Rights</h2>
      <p>Depending on your location (e.g., GDPR, CCPA), you may have rights regarding your personal information, such as the right to access, correct, delete, or restrict its processing. Please contact us to exercise these rights.</p>
      
      <h2>8. Children's Privacy</h2>
      <p>The Service is not intended for children under the age of 13 (or applicable age in your jurisdiction). We do not knowingly collect personal information from children.</p>
      
      <h2>9. Changes to This Policy</h2>
      <p>We may update this Privacy Policy from time to time. We will notify you of significant changes by posting the new policy on the Service or by other means.</p>
      
      <h2>10. Contact Us</h2>
      <p>If you have any questions about this Privacy Policy, please contact us at <a href="mailto:info@onlinenote.ai">info@onlinenote.ai</a>.</p>
    </motion.section>
  </div>
);

// --- Main App Component with Router ---
function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/security" element={<SecurityPage />} />
          <Route path="/integrations" element={<IntegrationsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/blog" element={<BlogPage />} />
          {/* Add route for individual blog posts if needed: <Route path="/blog/:postId" element={<BlogPostPage />} /> */}
          <Route path="/careers" element={<CareersPage />} />
          {/* Add route for individual career posts if needed: <Route path="/careers/:jobId" element={<CareerDetailPage />} /> */}
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          {/* Add a 404 Not Found page component */}
          {/* <Route path="*" element={<NotFoundPage />} /> */}
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;


