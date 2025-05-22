
import React, { useState } from "react";
import { Separator } from "./ui/separator";
import PrivacyNotice from "./PrivacyNotice";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [privacyDialogOpen, setPrivacyDialogOpen] = useState(false);
  
  return (
    <footer className="py-8 bg-black/80 backdrop-blur-lg border-t border-white/10">
      <div className="container mx-auto px-4">
        {/* Space above the copyright section */}
        <div className="h-8"></div>
        
        <div className="mt-6 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-500 text-sm">
              © {currentYear} Online Note AI. All rights reserved.
            </p>
            <p className="text-gray-600 text-xs mt-1">
              <a href="https://onlinenote.ai" className="hover:text-noteflow-400 transition-colors">onlinenote.ai</a>
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
      </div>
    </footer>
  );
};

export default Footer;
