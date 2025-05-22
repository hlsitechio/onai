import { useState, useEffect } from "react";
import { useFocusMode } from '../contexts/useFocusMode';
import { Menu, X, Settings, Mail } from "lucide-react";
import ContactForm from "./ContactForm";
import { trackPageView } from '../utils/analytics';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  
  return (
    <header className="z-20 w-full fixed top-0">
      <div className="backdrop-blur-lg bg-black/30 border-b border-white/10 shadow-lg">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500">Online Note AI</h1>
          </div>

          {/* Desktop navigation menu */}
          <div className="hidden md:flex items-center space-x-6">
            <a 
              href="/privacy-policy" 
              className="text-gray-300 hover:text-white text-sm transition-colors"
              onClick={() => trackPageView('/privacy-policy', 'Privacy Policy')}
            >
              Privacy Policy
            </a>
            <a 
              href="/terms-of-use" 
              className="text-gray-300 hover:text-white text-sm transition-colors"
              onClick={() => trackPageView('/terms-of-use', 'Terms of Use')}
            >
              Terms of Use
            </a>
            <a 
              href="/cookie-settings" 
              className="text-gray-300 hover:text-white text-sm transition-colors flex items-center gap-1"
              onClick={() => trackPageView('/cookie-settings', 'Cookie Settings')}
            >
              <Settings size={14} />
              Cookie Settings
            </a>
            <button
              onClick={() => setContactDialogOpen(true)}
              className="text-gray-300 hover:text-white text-sm transition-colors flex items-center gap-1 bg-indigo-500/20 px-3 py-1 rounded-full border border-indigo-500/30"
            >
              <Mail size={14} />
              Contact Us
            </button>
          </div>
        
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white p-2 rounded-full bg-indigo-500/20 backdrop-blur-sm border border-indigo-500/30 hover:bg-indigo-500/30 transition-all duration-200"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 w-full backdrop-blur-xl bg-black/50 border-b border-indigo-500/20 py-4 md:hidden shadow-lg">
          <div className="container mx-auto px-4 flex flex-col space-y-3">
            <a 
              href="#editor-section" 
              className="block mt-4 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-md hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 text-center backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            >
              Get Started
            </a>
            
            {/* Mobile sitemap links */}
            <div className="flex flex-col space-y-3 mt-2 px-2">
              <a
                href="/privacy-policy"
                className="text-gray-300 hover:text-white text-sm transition-colors py-1 border-t border-indigo-500/20 pt-3"
                onClick={() => setMobileMenuOpen(false)}
              >
                Privacy Policy
              </a>
              <a 
                href="/terms-of-use" 
                className="text-gray-300 hover:text-white text-sm transition-colors py-1"
                onClick={() => setMobileMenuOpen(false)}
              >
                Terms of Use
              </a>
              <a
                href="/cookie-settings"
                className="text-gray-300 hover:text-white text-sm transition-colors py-1 flex items-center gap-1"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Settings size={14} />
                Cookie Settings
              </a>
              <button
                className="text-gray-300 hover:text-white text-sm transition-colors py-1 flex items-center gap-1 border-t border-indigo-500/20 pt-3 mt-2"
                onClick={() => {
                  setContactDialogOpen(true);
                  setMobileMenuOpen(false);
                }}
              >
                <Mail size={14} />
                Contact Us
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Contact Form Dialog */}
      <ContactForm
        open={contactDialogOpen}
        onOpenChange={setContactDialogOpen}
      />
    </header>
  );
};

export default Header;
