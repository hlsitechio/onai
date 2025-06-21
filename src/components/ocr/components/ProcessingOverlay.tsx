
import React from 'react';
import { Loader2 } from "lucide-react";

interface ProcessingOverlayProps {
  isProcessing: boolean;
  ocrProgress: number;
}

const ProcessingOverlay: React.FC<ProcessingOverlayProps> = ({ isProcessing, ocrProgress }) => {
  if (!isProcessing) return null;

  return (
    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
        <Loader2 className="h-8 w-8 animate-spin text-white mx-auto mb-4" />
        <p className="text-white mb-2">Extracting text...</p>
        <div className="w-48 bg-white/20 rounded-full h-2 mb-2">
          <div 
            className="bg-noteflow-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${ocrProgress}%` }}
          />
        </div>
        <p className="text-white/70 text-sm">{ocrProgress}%</p>
      </div>
    </div>
  );
};

export default ProcessingOverlay;
