
import React, { useState } from "react";
import { Separator } from "./ui/separator";
import PrivacyNotice from "./PrivacyNotice";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [privacyDialogOpen, setPrivacyDialogOpen] = useState(false);
  
  return (
    <footer className="py-4 bg-black/80 backdrop-blur-lg border-t border-white/10">
      <div className="container mx-auto px-4">
        {/* Reduced space above the copyright section */}
        <div className="h-2"></div>
        
        <div className="mt-2 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-2 md:mb-0">
            <p className="text-gray-500 text-xs">
              © {currentYear} Online Note AI. All rights reserved.
            </p>
            <a href="https://onlinenote.ai" className="text-gray-600 text-xs hover:text-noteflow-400 transition-colors">onlinenote.ai</a>
          </div>
          
          <div className="flex space-x-4">
            <button 
              onClick={() => setPrivacyDialogOpen(true)}
              className="text-gray-500 hover:text-noteflow-400 text-xs transition-colors"
            >
              Privacy
            </button>
            <a href="#" className="text-gray-500 hover:text-noteflow-400 text-xs transition-colors">Terms</a>
            <a href="#" className="text-gray-500 hover:text-noteflow-400 text-xs transition-colors">Contact</a>
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
