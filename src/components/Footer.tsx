
import React, { useState } from "react";
import { Mail, Heart } from "lucide-react";
import { Button } from './ui/button';
import PrivacyNotice from "./PrivacyNotice";
import ContactForm from "./ContactForm";
import { trackPageView, trackEvent } from '../utils/analytics';
import { motion } from "framer-motion";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [privacyDialogOpen, setPrivacyDialogOpen] = useState(false);
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  
  return (
    <footer className="py-12 border-t border-white/10 bg-gradient-to-b from-transparent to-black/20 relative overflow-hidden">
      {/* Enhanced background effects */}
      <div className="absolute inset-0 z-0">
        <motion.div 
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-96 h-24 bg-gradient-to-t from-noteflow-600/10 to-transparent blur-xl"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Main footer content */}
        <div className="flex flex-col items-center space-y-8">
          {/* Enhanced Buy Me a Coffee Button */}
          <motion.div 
            className="flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.a 
              href="https://www.buymeacoffee.com/onlinenoteai" 
              target="_blank" 
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 blur-xl rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <img 
                src="https://img.buymeacoffee.com/button-api/?text=Buy me! Stay free forever!&emoji=🤑&slug=onlinenoteai&button_colour=213e87&font_colour=ffffff&font_family=Inter&outline_colour=ffffff&coffee_colour=FFDD00" 
                alt="Buy Me A Coffee"
                className="hover:opacity-80 transition-opacity relative z-10"
              />
            </motion.a>
          </motion.div>
          
          {/* Enhanced Social Media Links */}
          <motion.div 
            className="flex items-center gap-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {[
              { name: "𝕏 (Twitter)", url: "https://x.com/Online_Note_AI" },
              { name: "Instagram", url: "https://www.instagram.com/onlinenoteai/" },
              { name: "Bluesky", url: "https://bsky.app/profile/onlinenoteai.bsky.social" }
            ].map((social, index) => (
              <motion.a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-noteflow-400 transition-all duration-300 relative group"
                whileHover={{ scale: 1.1, y: -2 }}
              >
                <span className="relative z-10">{social.name}</span>
                <div className="absolute inset-0 bg-noteflow-400/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -m-2" />
              </motion.a>
            ))}
          </motion.div>
          
          {/* Enhanced Navigation links */}
          <motion.div 
            className="flex flex-wrap justify-center items-center gap-4 text-sm"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {[
              { name: "Privacy Policy", url: "/privacy-policy", track: '/privacy-policy' },
              { name: "Terms of Use", url: "/terms-of-use", track: '/terms-of-use' },
              { name: "Cookie Settings", url: "/cookie-settings", track: '/cookie-settings' }
            ].map((link, index) => (
              <React.Fragment key={link.name}>
                {index > 0 && <span className="text-gray-600">•</span>}
                <motion.a 
                  href={link.url}
                  className="text-gray-400 hover:text-noteflow-400 transition-colors relative group"
                  onClick={() => trackPageView(link.track, link.name)}
                  whileHover={{ y: -1 }}
                >
                  {link.name}
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-noteflow-400 group-hover:w-full transition-all duration-300" />
                </motion.a>
              </React.Fragment>
            ))}
            <span className="text-gray-600">•</span>
            <motion.button
              onClick={() => setContactDialogOpen(true)}
              className="text-gray-400 hover:text-noteflow-400 transition-colors flex items-center gap-1 relative group"
              whileHover={{ y: -1 }}
            >
              <Mail size={12} className="text-gray-400" />
              Contact
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-noteflow-400 group-hover:w-full transition-all duration-300" />
            </motion.button>
          </motion.div>
          
          {/* Enhanced Copyright notice */}
          <motion.div 
            className="text-center space-y-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
              <span>© {currentYear} Online Note AI. Made with</span>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <Heart className="h-4 w-4 text-red-400 fill-red-400" />
              </motion.div>
              <span>for writers everywhere</span>
            </div>
            <motion.a 
              href="https://onlinenote.ai" 
              className="text-gray-600 text-sm hover:text-noteflow-400 transition-colors block relative group"
              whileHover={{ scale: 1.05 }}
            >
              onlinenote.ai
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-noteflow-400 group-hover:w-full transition-all duration-300" />
            </motion.a>
          </motion.div>
        </div>
        
        {/* Dialogs */}
        <PrivacyNotice 
          open={privacyDialogOpen} 
          onOpenChange={setPrivacyDialogOpen} 
        />
        
        <ContactForm
          open={contactDialogOpen}
          onOpenChange={setContactDialogOpen}
        />
      </div>
    </footer>
  );
};

export default Footer;
