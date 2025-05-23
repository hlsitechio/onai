import React from "react";
import Modal from "react-modal";
import { X, Heart } from "lucide-react";

interface SponsorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SponsorDialog: React.FC<SponsorDialogProps> = ({ open, onOpenChange }) => {
  return (
    <Modal
      isOpen={open}
      onRequestClose={() => onOpenChange(false)}
      contentLabel="Sponsor Dialog"
      className="fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-md w-full bg-black/80 backdrop-blur-xl p-6 rounded-xl border border-white/10 shadow-2xl outline-none text-white z-50"
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
          {/* QR code image will be displayed here */}
          <img 
            src="/assets/onlinenoteai_qr_code.png" 
            alt="Sponsor QR Code" 
            className="w-full h-full object-contain"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/assets/qr-code-fallback.png";
            }}
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
