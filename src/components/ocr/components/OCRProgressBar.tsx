
import React from 'react';
import { OCRProgressBarProps } from '../types/OCRTypes';

const OCRProgressBar: React.FC<OCRProgressBarProps> = ({ isProcessing, progress }) => {
  if (!isProcessing) return null;

  return (
    <div className="mt-2 w-full">
      <div className="h-2 rounded bg-slate-700 overflow-hidden">
        <div
          className="bg-noteflow-400 h-full transition-all duration-200"
          style={{ width: `${progress}%` }}
        />
      </div>
      <span className="text-xs text-slate-400">{progress}%</span>
    </div>
  );
};

export default OCRProgressBar;
