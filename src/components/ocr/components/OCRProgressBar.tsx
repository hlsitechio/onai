
import React from 'react';
import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";

interface OCRProgressBarProps {
  isProcessing: boolean;
  progress: number;
}

const OCRProgressBar: React.FC<OCRProgressBarProps> = ({ isProcessing, progress }) => {
  if (!isProcessing && progress === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm text-white/70">
        <div className="flex items-center gap-2">
          {isProcessing && <Loader2 className="h-4 w-4 animate-spin" />}
          <span>{isProcessing ? 'Processing image...' : 'Complete'}</span>
        </div>
        <span>{progress}%</span>
      </div>
      <Progress 
        value={progress} 
        className="h-2 bg-white/10"
      />
    </div>
  );
};

export default OCRProgressBar;
