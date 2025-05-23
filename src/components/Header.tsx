import { useState, useEffect } from "react";
import { useFocusMode } from '../contexts/useFocusMode';
import { Menu, X, Settings, Mail, Home, Heart } from "lucide-react";
import ContactForm from "./ContactForm";
import SponsorDialog from "./SponsorDialog";
import { trackPageView } from '../utils/analytics';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [sponsorDialogOpen, setSponsorDialogOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  
  const handleOpenContactDialog = () => {
    setContactDialogOpen(true);
  };
  
  const handleOpenSponsorDialog = () => {
    setSponsorDialogOpen(true);
  };
  
  // Handle scroll behavior for header visibility
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Determine if we're scrolled down at all
      if (currentScrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
      
      // Hide header on scroll down, show on scroll up
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsHeaderVisible(false);
      } else {
        setIsHeaderVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);
  
  return (
    <header className={`z-20 w-full fixed top-0 transition-transform duration-300 ${isHeaderVisible ? 'translate-y-0' : '-translate-y-full'}`}>
      <div className={`${isScrolled ? 'bg-black/40' : 'bg-transparent'} transition-all duration-300`}>
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <a 
              href="/" 
              className="flex items-center group hover:opacity-80 transition-opacity"
              onClick={() => trackPageView('/', 'Home')}
            >
              <Home size={20} className="mr-2 text-indigo-400 group-hover:text-indigo-300 transition-colors" />
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500">Online Note AI</h1>
            </a>
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
              onClick={handleOpenSponsorDialog}
              className="text-white text-sm transition-colors flex items-center gap-1 px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 shadow-md"
            >
              <Heart size={14} className="text-white animate-pulse" />
              Sponsor
            </button>
            <button
              onClick={handleOpenContactDialog}
              className="text-gray-300 hover:text-white text-sm transition-colors flex items-center gap-1 px-3 py-1 rounded-full"
            >
              <Mail size={14} />
              Contact Us
            </button>
          </div>
        
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white p-2 rounded-full hover:bg-black/20 transition-all duration-200"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-black/20 py-4 md:hidden">
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
              <button
                className="text-white text-sm transition-colors py-2 px-3 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg flex items-center gap-1 mb-2 shadow-md w-full justify-center"
                onClick={() => {
                  handleOpenSponsorDialog();
                  setMobileMenuOpen(false);
                }}
              >
                <Heart size={14} className="text-white animate-pulse" />
                Sponsor
              </button>
              <a
                href="/privacy-policy"
                className="text-gray-300 hover:text-white text-sm transition-colors py-1 pt-3"
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
                className="text-gray-300 hover:text-white text-sm transition-colors py-1 flex items-center gap-1 pt-3 mt-2"
                onClick={() => {
                  handleOpenContactDialog();
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
      
      {/* Sponsor Dialog with QR Code */}
      <SponsorDialog
        open={sponsorDialogOpen}
        onOpenChange={setSponsorDialogOpen}
      />
    </header>
  );
};

export default Header;
