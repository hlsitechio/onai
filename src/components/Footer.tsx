
import React, { useState } from "react";
import AdBanner from "./AdBanner";
import { Separator } from "./ui/separator";
import PrivacyNotice from "./PrivacyNotice";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [privacyDialogOpen, setPrivacyDialogOpen] = useState(false);
  
  return (
    <footer className="py-8 bg-black/80 backdrop-blur-lg border-t border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-500 text-sm">
              © {currentYear} Onlinenote.ai. All rights reserved.
            </p>
          </div>
          
          <div className="flex space-x-6">
            <button 
              onClick={() => setPrivacyDialogOpen(true)}
              className="text-gray-500 hover:text-noteflow-400 text-sm transition-colors"
            >
              Privacy Policy
            </button>
            <a href="#" className="text-gray-500 hover:text-noteflow-400 text-sm transition-colors">Terms of Service</a>
            <a href="#" className="text-gray-500 hover:text-noteflow-400 text-sm transition-colors">Contact</a>
          </div>
        </div>
        
        {/* Privacy Policy Dialog */}
        <PrivacyNotice 
          open={privacyDialogOpen} 
          onOpenChange={setPrivacyDialogOpen} 
        />
        
        {/* Advertisement banner */}
        <div className="mt-4">
          <AdBanner 
            size="large" 
            position="footer" 
            adSlotId="1234567890" 
            className="min-h-[80px] border border-white/5 rounded-lg overflow-hidden"
          />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
