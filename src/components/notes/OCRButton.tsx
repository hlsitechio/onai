
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import OCRUpload from "./OCRUpload";

interface OCRButtonProps {
  onTextExtracted?: (text: string) => void;
  className?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
}

const OCRButton: React.FC<OCRButtonProps> = ({ 
  onTextExtracted, 
  className = "",
  variant = "ghost",
  size = "sm"
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleTextExtracted = (text: string) => {
    if (onTextExtracted) {
      onTextExtracted(text);
    }
    setIsDialogOpen(false);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={`text-slate-300 hover:text-white hover:bg-white/10 ${className}`}
          title="Extract text from image (OCR)"
        >
          <FileText className="h-4 w-4" />
          {size !== "icon" && <span className="ml-1 hidden sm:inline">OCR</span>}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl bg-black/95 border-white/20 text-white">
        <DialogHeader>
          <DialogTitle className="text-white">Extract Text from Image</DialogTitle>
        </DialogHeader>
        
        <OCRUpload 
          onTextExtracted={handleTextExtracted}
          onClose={() => setIsDialogOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default OCRButton;
