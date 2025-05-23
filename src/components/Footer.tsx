
import React, { useState } from "react";
import { Separator } from "./ui/separator";
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
    <footer className="py-4">
      <div className="container mx-auto px-4">
        {/* Reduced space above the copyright section */}
        <div className="h-2"></div>
        
        <div className="mt-2 flex flex-col items-center">
          <div className="mb-3 flex flex-col items-center space-y-2">
            <p className="text-gray-500 text-xs text-center">
              © {currentYear} Online Note AI. All rights reserved.
            </p>
            <a href="https://onlinenote.ai" className="text-gray-600 text-xs hover:text-noteflow-400 transition-colors block text-center">onlinenote.ai</a>
            
            {/* Buy Me a Coffee Button */}
            <div className="mt-2">
              <a href="https://www.buymeacoffee.com/onlinenoteai" target="_blank" rel="noopener noreferrer">
                <img 
                  src="https://img.buymeacoffee.com/button-api/?text=Buy me! Stay free forever!&emoji=🤑&slug=onlinenoteai&button_colour=213e87&font_colour=ffffff&font_family=Inter&outline_colour=ffffff&coffee_colour=FFDD00" 
                  alt="Buy Me A Coffee"
                  className="hover:opacity-80 transition-opacity"
                />
              </a>
            </div>
          </div>
          
          {/* Sitemap links in a horizontal line */}
          <div className="flex items-center mb-1 space-x-2">
            <a 
              href="/privacy-policy"
              className="text-gray-500 hover:text-noteflow-400 text-xs transition-colors"
              onClick={() => trackPageView('/privacy-policy', 'Privacy Policy')}
            >
              Privacy Policy
            </a>
            <span className="text-gray-600 text-xs">|</span>
            <a href="/terms-of-use" className="text-gray-500 hover:text-noteflow-400 text-xs transition-colors" onClick={() => trackPageView('/terms-of-use', 'Terms of Use')}>Terms of Use</a>
            <span className="text-gray-600 text-xs">|</span>
            <a 
              href="/cookie-settings"
              className="text-gray-500 hover:text-noteflow-400 text-xs transition-colors"
              onClick={() => trackPageView('/cookie-settings', 'Cookie Settings')}
            >
              Cookie Settings
            </a>
            <span className="text-gray-600 text-xs">|</span>
            <button
              onClick={() => setContactDialogOpen(true)}
              className="text-gray-500 hover:text-noteflow-400 text-xs transition-colors flex items-center gap-1"
            >
              <Mail size={12} className="text-gray-500" />
              Contact
            </button>
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
