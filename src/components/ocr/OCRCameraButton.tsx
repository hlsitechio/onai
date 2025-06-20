
import React from 'react';
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";
import { cn } from "@/lib/utils";

interface OCRCameraButtonProps {
  onClick: () => void;
  className?: string;
  variant?: "default" | "ghost" | "outline";
  size?: "sm" | "default" | "lg";
  isProcessing?: boolean;
}

const OCRCameraButton: React.FC<OCRCameraButtonProps> = ({ 
  onClick, 
  className,
  variant = "ghost",
  size = "sm",
  isProcessing = false
}) => {
  return (
    <Button
      variant={variant}
      size={size}
      onClick={onClick}
      disabled={isProcessing}
      className={cn(
        "text-slate-300 hover:text-white hover:bg-white/10 p-1.5 md:p-2",
        className
      )}
      title="Camera OCR - Capture Text with Camera"
    >
      <Camera className="h-4 w-4" />
      {isProcessing && (
        <div className="ml-1 w-2 h-2 bg-noteflow-400 rounded-full animate-pulse" />
      )}
    </Button>
  );
};

export default OCRCameraButton;
