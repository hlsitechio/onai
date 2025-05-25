
import React from 'react';
import { Button } from "@/components/ui/button";
import { FileImage } from "lucide-react";
import { cn } from "@/lib/utils";

interface OCRButtonProps {
  onClick: () => void;
  className?: string;
  variant?: "default" | "ghost" | "outline";
  size?: "sm" | "default" | "lg";
}

const OCRButton: React.FC<OCRButtonProps> = ({ 
  onClick, 
  className,
  variant = "ghost",
  size = "sm"
}) => {
  return (
    <Button
      variant={variant}
      size={size}
      onClick={onClick}
      className={cn(
        "text-slate-300 hover:text-white hover:bg-white/10 p-1.5 md:p-2",
        className
      )}
      title="OCR - Extract Text from Image"
    >
      <FileImage className="h-4 w-4" />
    </Button>
  );
};

export default OCRButton;
