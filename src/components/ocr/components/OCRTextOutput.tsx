
import React from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Download, Loader2 } from "lucide-react";
import { OCRTextOutputProps } from '../types/OCRTypes';

const OCRTextOutput: React.FC<OCRTextOutputProps> = ({
  extractedText,
  setExtractedText,
  isProcessing,
  uploadedImage,
  onCopyToClipboard,
  onInsertToNote
}) => {
  return (
    <div className="flex-1 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Extracted Text</h3>
        {extractedText && !isProcessing && (
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onCopyToClipboard}
              className="text-slate-300 hover:text-white"
            >
              <Copy className="h-4 w-4 mr-1" />
              Copy
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onInsertToNote}
              className="text-green-400 hover:text-green-300"
            >
              <Download className="h-4 w-4 mr-1" />
              Insert to Note
            </Button>
          </div>
        )}
      </div>

      <Textarea
        value={extractedText}
        onChange={(e) => setExtractedText(e.target.value)}
        placeholder={
          !uploadedImage 
            ? "Upload an image to extract text..." 
            : isProcessing 
              ? "Extracting text from image..." 
              : "Extracted text will appear here..."
        }
        className="flex-1 bg-black/30 border-white/20 text-white resize-none"
        readOnly={isProcessing}
        spellCheck={false}
      />

      {isProcessing && (
        <div className="mt-2 flex items-center gap-2 text-noteflow-400">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm">Processing image with OCR...</span>
        </div>
      )}

      {extractedText && !isProcessing && (
        <div className="mt-4 flex gap-3">
          <Button 
            onClick={onInsertToNote}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            <Download className="h-4 w-4 mr-2" />
            Insert to Note
          </Button>
          
          <Button 
            variant="outline" 
            onClick={onCopyToClipboard}
            className="border-white/20 hover:bg-white/10"
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy Text
          </Button>
        </div>
      )}
    </div>
  );
};

export default OCRTextOutput;
