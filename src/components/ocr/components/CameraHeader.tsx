
import React from 'react';
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface CameraHeaderProps {
  isProcessing: boolean;
  onClose: () => void;
}

const CameraHeader: React.FC<CameraHeaderProps> = ({ isProcessing, onClose }) => {
  return (
    <div className="flex items-center justify-between p-4 bg-black/80 backdrop-blur-sm">
      <h2 className="text-white font-medium">
        {isProcessing ? 'Processing Text...' : 'Capture Text'}
      </h2>
      <Button
        variant="ghost"
        size="sm"
        onClick={onClose}
        className="text-white hover:bg-white/10"
        disabled={isProcessing}
      >
        <X className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default CameraHeader;
