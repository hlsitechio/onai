
import React from 'react';
import { Button } from "@/components/ui/button";
import { X, FileImage } from "lucide-react";

interface OCRImagePreviewProps {
  imageUrl: string;
  imageName: string;
  onRemove: () => void;
  quality?: number;
  originalSize?: { width: number; height: number };
  processedSize?: { width: number; height: number };
}

const OCRImagePreview: React.FC<OCRImagePreviewProps> = ({
  imageUrl,
  imageName,
  onRemove,
  quality,
  originalSize,
  processedSize
}) => {
  return (
    <div className="flex-1 bg-black/30 border border-white/10 rounded-lg overflow-hidden relative">
      <div className="flex items-center justify-between p-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <FileImage className="h-4 w-4 text-noteflow-400" />
          <span className="text-sm text-white/80 truncate">{imageName}</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onRemove}
          className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/20"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="p-4 h-full overflow-auto">
        <img 
          src={imageUrl} 
          alt="Preview" 
          className="max-w-full max-h-full object-contain mx-auto rounded"
        />
      </div>

      {(quality || originalSize || processedSize) && (
        <div className="absolute bottom-2 left-2 bg-black/80 rounded px-2 py-1 text-xs text-white/70">
          {quality && <span>Quality: {quality}%</span>}
          {originalSize && <span className="ml-2">{originalSize.width}×{originalSize.height}</span>}
        </div>
      )}
    </div>
  );
};

export default OCRImagePreview;
