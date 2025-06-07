
import React from 'react';
import { X, RotateCw, ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from "@/components/ui/button";

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
  const [zoom, setZoom] = React.useState(1);
  const [rotation, setRotation] = React.useState(0);

  return (
    <div className="relative w-full h-64 bg-black/30 border border-white/20 rounded-lg overflow-hidden">
      <img 
        src={imageUrl} 
        alt="OCR Preview" 
        className="w-full h-full object-contain transition-transform duration-200"
        style={{ 
          transform: `scale(${zoom}) rotate(${rotation}deg)`,
          transformOrigin: 'center'
        }}
      />
      
      {/* Controls overlay */}
      <div className="absolute top-2 right-2 flex gap-1">
        <Button
          onClick={() => setZoom(zoom > 0.5 ? zoom - 0.25 : zoom)}
          variant="outline"
          size="sm"
          className="h-8 w-8 p-0 bg-black/50 border-white/20 hover:bg-black/70"
          disabled={zoom <= 0.5}
        >
          <ZoomOut className="h-3 w-3 text-white" />
        </Button>
        
        <Button
          onClick={() => setZoom(zoom < 2 ? zoom + 0.25 : zoom)}
          variant="outline"
          size="sm"
          className="h-8 w-8 p-0 bg-black/50 border-white/20 hover:bg-black/70"
          disabled={zoom >= 2}
        >
          <ZoomIn className="h-3 w-3 text-white" />
        </Button>
        
        <Button
          onClick={() => setRotation((rotation + 90) % 360)}
          variant="outline"
          size="sm"
          className="h-8 w-8 p-0 bg-black/50 border-white/20 hover:bg-black/70"
        >
          <RotateCw className="h-3 w-3 text-white" />
        </Button>
        
        <Button
          onClick={onRemove}
          variant="outline"
          size="sm"
          className="h-8 w-8 p-0 bg-red-500/50 border-red-400/20 hover:bg-red-500/70"
        >
          <X className="h-3 w-3 text-white" />
        </Button>
      </div>
      
      {/* Image info overlay */}
      <div className="absolute bottom-2 left-2 bg-black/70 px-2 py-1 rounded text-xs text-white">
        <div className="font-medium">{imageName}</div>
        {quality && (
          <div className="text-white/70">Quality: {quality}%</div>
        )}
        {originalSize && processedSize && (
          <div className="text-white/70">
            {originalSize.width}×{originalSize.height} → {processedSize.width}×{processedSize.height}
          </div>
        )}
      </div>
      
      {/* Zoom indicator */}
      {zoom !== 1 && (
        <div className="absolute top-2 left-2 bg-black/70 px-2 py-1 rounded text-xs text-white">
          {Math.round(zoom * 100)}%
        </div>
      )}
    </div>
  );
};

export default OCRImagePreview;
