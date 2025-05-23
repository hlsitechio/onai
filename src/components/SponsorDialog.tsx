import React, { useEffect } from "react";
import Modal from "react-modal";
import { X, Heart } from "lucide-react";

// Set the app element for react-modal accessibility
if (typeof window !== 'undefined') {
  Modal.setAppElement('#root');
}

interface SponsorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SponsorDialog: React.FC<SponsorDialogProps> = ({ open, onOpenChange }) => {
  // Scroll to top when the modal opens
  React.useEffect(() => {
    if (open) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [open]);
  return (
    <Modal
      isOpen={open}
      onRequestClose={() => onOpenChange(false)}
      contentLabel="Sponsor Dialog"
      className="fixed left-1/2 top-24 transform -translate-x-1/2 max-w-md w-full bg-black/80 backdrop-blur-xl p-6 rounded-xl border border-white/10 shadow-2xl outline-none text-white z-50 max-h-[80vh] overflow-y-auto"
      overlayClassName="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
    >
      {/* Header */}
      <div className="flex flex-col space-y-2 text-center">
        <h2 className="text-2xl font-bold flex items-center gap-2 justify-center">
          <Heart className="h-5 w-5 text-red-500 animate-pulse" />
          Sponsor OneAI Notes
        </h2>
        <p className="text-gray-300">
          Support us to keep developing OneAI Notes and remove all ads from your experience.
        </p>
      </div>
      
      {/* Content */}
      <div className="flex flex-col items-center justify-center py-6">
        <p className="text-lg font-medium text-center mb-4">
          I need your sponsorship to remove all ads!
        </p>
        
        <div className="bg-white p-4 rounded-lg mb-4 w-64 h-64 flex items-center justify-center">
          {/* Using a direct Base64 encoded QR code for guaranteed display */}
          <img 
            src="data:image/png;base64,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" 
            alt="Sponsor QR Code" 
            className="w-full h-full object-contain"
          />
        </div>
        
        <p className="text-sm text-gray-400 text-center">
          Scan the QR code to become a sponsor and enjoy an ad-free experience.
        </p>
      </div>
      
      {/* Footer */}
      <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 mt-4">
        <button 
          type="button"
          onClick={() => onOpenChange(false)}
          className="inline-flex h-10 items-center justify-center rounded-md border border-white/10 bg-transparent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10 focus:outline-none"
        >
          Maybe Later
        </button>
        <button 
          type="button"
          className="inline-flex h-10 items-center justify-center rounded-md bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors focus:outline-none"
          onClick={() => window.open('mailto:info@onlinenote.ai?subject=Sponsorship%20Inquiry', '_blank')}
        >
          Contact for Sponsorship
        </button>
      </div>
      
      {/* Close button */}
      <button
        className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none"
        onClick={() => onOpenChange(false)}
      >
        <X className="h-4 w-4 text-white" />
        <span className="sr-only">Close</span>
      </button>
    </Modal>
  );
};

export default SponsorDialog;
