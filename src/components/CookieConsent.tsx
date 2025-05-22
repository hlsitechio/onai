import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Shield, X } from "lucide-react";

const CookieConsent: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already consented
    const hasConsented = localStorage.getItem('cookie-consent-given') === 'true';
    
    if (!hasConsented) {
      // Show the banner after a small delay for better UX
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookie-consent-given', 'true');
    setIsVisible(false);
  };

  const declineCookies = () => {
    // Even when declining, we need to store this preference somewhere
    // We use sessionStorage so it only persists for the session
    sessionStorage.setItem('cookie-consent-declined', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-black/90 backdrop-blur-md border-t border-white/10 shadow-lg animate-slideUp">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-noteflow-500/20 rounded-full hidden sm:flex">
            <Shield className="h-6 w-6 text-noteflow-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-white font-medium mb-1 flex items-center">
              <Shield className="h-4 w-4 text-noteflow-400 mr-2 sm:hidden" />
              Privacy Notice
            </h3>
            <p className="text-gray-300 text-sm">
              OneAI Notes prioritizes your privacy. We never sell or share your data, and all notes are automatically destroyed after 24 hours. We only use essential cookies for site functionality.
            </p>
          </div>
        </div>
        <div className="flex gap-2 self-end sm:self-center">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={declineCookies}
            className="text-gray-400 hover:text-white hover:bg-white/10"
          >
            <X className="h-4 w-4 mr-1" />
            Decline
          </Button>
          <Button 
            variant="default"
            size="sm"
            onClick={acceptCookies}
            className="bg-noteflow-500 hover:bg-noteflow-600 text-white"
          >
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
