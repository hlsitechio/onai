
import React from 'react';
import { Progress } from "@/components/ui/progress";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

interface OCRProgressBarProps {
  isProcessing: boolean;
  progress: number;
  error?: string;
}

const OCRProgressBar: React.FC<OCRProgressBarProps> = ({
  isProcessing,
  progress,
  error
}) => {
  const getStatusIcon = () => {
    if (error) return <AlertCircle className="h-4 w-4 text-red-400" />;
    if (progress === 100 && !isProcessing) return <CheckCircle2 className="h-4 w-4 text-green-400" />;
    if (isProcessing) return <Loader2 className="h-4 w-4 animate-spin text-noteflow-400" />;
    return null;
  };

  const getStatusText = () => {
    if (error) return 'Processing failed';
    if (progress === 100 && !isProcessing) return 'Processing complete';
    if (isProcessing) {
      if (progress < 30) return 'Preprocessing image...';
      if (progress < 60) return 'Detecting text...';
      if (progress < 90) return 'Analyzing content...';
      return 'Finalizing results...';
    }
    return 'Ready to process';
  };

  const getProgressColor = () => {
    if (error) return 'bg-red-500';
    if (progress === 100) return 'bg-green-500';
    return 'bg-noteflow-500';
  };

  if (!isProcessing && progress === 0 && !error) {
    return null; // Don't show anything when idle
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm">
        {getStatusIcon()}
        <span className={`${error ? 'text-red-400' : 'text-white'}`}>
          {getStatusText()}
        </span>
        {isProcessing && (
          <span className="text-white/60 ml-auto">
            {progress}%
          </span>
        )}
      </div>
      
      <div className="w-full bg-black/30 rounded-full h-2 overflow-hidden">
        <div 
          className={`h-full transition-all duration-300 ${getProgressColor()}`}
          style={{ width: `${progress}%` }}
        />
      </div>
      
      {error && (
        <p className="text-xs text-red-400">{error}</p>
      )}
    </div>
  );
};

export default OCRProgressBar;
