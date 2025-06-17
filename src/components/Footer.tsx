
import React, { useState } from "react";
import { Mail } from "lucide-react";
import { Button } from './ui/button';
import PrivacyNotice from "./PrivacyNotice";
import ContactForm from "./ContactForm";
import { trackPageView, trackEvent } from '../utils/analytics';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [privacyDialogOpen, setPrivacyDialogOpen] = useState(false);
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  
  return (
    <footer className="py-8 border-t border-white/10">
      <div className="container mx-auto px-4">
        {/* Main footer content */}
        <div className="flex flex-col items-center space-y-6">
          {/* Buy Me a Coffee Button */}
          <div className="flex justify-center">
            <a href="https://www.buymeacoffee.com/onlinenoteai" target="_blank" rel="noopener noreferrer">
              <img 
                src="https://img.buymeacoffee.com/button-api/?text=Buy me! Stay free forever!&emoji=🤑&slug=onlinenoteai&button_colour=213e87&font_colour=ffffff&font_family=Inter&outline_colour=ffffff&coffee_colour=FFDD00" 
                alt="Buy Me A Coffee"
                className="hover:opacity-80 transition-opacity"
              />
            </a>
          </div>
          
          {/* Social Media Links */}
          <div className="flex items-center gap-6">
            <a 
              href="https://x.com/Online_Note_AI" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-noteflow-400 transition-colors"
            >
              𝕏 (Twitter)
            </a>
            <a 
              href="https://www.instagram.com/onlinenoteai/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-noteflow-400 transition-colors"
            >
              Instagram
            </a>
            <a 
              href="https://bsky.app/profile/onlinenoteai.bsky.social" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-noteflow-400 transition-colors"
            >
              Bluesky
            </a>
          </div>
          
          {/* Navigation links */}
          <div className="flex flex-wrap justify-center items-center gap-4 text-sm">
            <a 
              href="/privacy-policy"
              className="text-gray-400 hover:text-noteflow-400 transition-colors"
              onClick={() => trackPageView('/privacy-policy', 'Privacy Policy')}
            >
              Privacy Policy
            </a>
            <span className="text-gray-600">•</span>
            <a 
              href="/terms-of-use" 
              className="text-gray-400 hover:text-noteflow-400 transition-colors"
              onClick={() => trackPageView('/terms-of-use', 'Terms of Use')}
            >
              Terms of Use
            </a>
            <span className="text-gray-600">•</span>
            <a 
              href="/cookie-settings"
              className="text-gray-400 hover:text-noteflow-400 transition-colors"
              onClick={() => trackPageView('/cookie-settings', 'Cookie Settings')}
            >
              Cookie Settings
            </a>
            <span className="text-gray-600">•</span>
            <button
              onClick={() => setContactDialogOpen(true)}
              className="text-gray-400 hover:text-noteflow-400 transition-colors flex items-center gap-1"
            >
              <Mail size={14} className="text-gray-400" />
              Contact
            </button>
          </div>
          
          {/* Copyright notice */}
          <div className="text-center space-y-2">
            <p className="text-gray-500 text-sm">
              © {currentYear} Online Note AI. All rights reserved.
            </p>
            <a 
              href="https://onlinenote.ai" 
              className="text-gray-600 text-sm hover:text-noteflow-400 transition-colors block"
            >
              onlinenote.ai
            </a>
          </div>
        </div>
        
        {/* Privacy Policy Dialog */}
        <PrivacyNotice 
          open={privacyDialogOpen} 
          onOpenChange={setPrivacyDialogOpen} 
        />
        
        {/* Contact Form Dialog */}
        <ContactForm
          open={contactDialogOpen}
          onOpenChange={setContactDialogOpen}
        />
      </div>
    </footer>
  );
};

export default Footer;
