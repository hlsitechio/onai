
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Image as ImageIcon, X, Copy, FileText, Loader2, Clipboard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface OCRUploadProps {
  onTextExtracted?: (text: string) => void;
  onClose?: () => void;
}

const OCRUpload: React.FC<OCRUploadProps> = ({ onTextExtracted, onClose }) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Add clipboard paste functionality
  useEffect(() => {
    const handlePaste = async (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (const item of Array.from(items)) {
        if (item.type.startsWith('image/')) {
          e.preventDefault();
          const file = item.getAsFile();
          if (file) {
            await handleImageFile(file);
            toast({
              title: "Image pasted",
              description: "Image from clipboard has been loaded successfully.",
            });
          }
        }
      }
    };

    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, [toast]);

  const handleImageFile = async (file: File) => {
    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please select a JPG, PNG, or WebP image file.",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 10MB.",
        variant: "destructive"
      });
      return;
    }

    setSelectedImage(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageFile(file);
    }
  };

  const handlePasteFromClipboard = async () => {
    try {
      const clipboardItems = await navigator.clipboard.read();
      
      for (const item of clipboardItems) {
        for (const type of item.types) {
          if (type.startsWith('image/')) {
            const blob = await item.getType(type);
            const file = new File([blob], `clipboard-image.${type.split('/')[1]}`, { type });
            await handleImageFile(file);
            toast({
              title: "Image pasted",
              description: "Image from clipboard has been loaded successfully.",
            });
            return;
          }
        }
      }
      
      toast({
        title: "No image found",
        description: "No image found in clipboard. Please copy an image first.",
        variant: "destructive"
      });
    } catch (error) {
      console.error('Clipboard paste error:', error);
      toast({
        title: "Paste failed",
        description: "Could not access clipboard. Try using Ctrl+V instead.",
        variant: "destructive"
      });
    }
  };

  const processImageWithOCR = async () => {
    if (!selectedImage) return;

    setIsProcessing(true);
    setExtractedText('');

    try {
      // Convert image to base64
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(selectedImage);
      });

      // For now, we'll use a simple OCR simulation
      // In a real implementation, you would call an OCR service like Tesseract.js or Google Vision API
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Placeholder text extraction (you would replace this with actual OCR)
      const mockExtractedText = `OCR Text Extraction from: ${selectedImage.name}

This is a placeholder for OCR text extraction. In a real implementation, this would be replaced with actual text extracted from the image using services like:

- Tesseract.js (client-side OCR)
- Google Cloud Vision API
- AWS Textract
- Azure Computer Vision

The image "${selectedImage.name}" would be processed and any text content would appear here.`;

      setExtractedText(mockExtractedText);
      
      toast({
        title: "Text extracted successfully",
        description: "The text has been extracted from your image.",
      });

    } catch (error) {
      console.error('OCR processing error:', error);
      toast({
        title: "OCR processing failed",
        description: "There was an error processing your image. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(extractedText);
    toast({
      title: "Text copied",
      description: "The extracted text has been copied to your clipboard.",
    });
  };

  const handleInsertText = () => {
    if (onTextExtracted) {
      onTextExtracted(extractedText);
      toast({
        title: "Text inserted",
        description: "The extracted text has been inserted into your note.",
      });
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setExtractedText('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card className="p-4 bg-black/30 border-white/10">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-medium flex items-center gap-2">
            <FileText className="h-4 w-4 text-noteflow-400" />
            OCR Text Extraction
          </h3>
          {onClose && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-6 w-6 text-slate-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* File Upload Area */}
        <div className="space-y-2">
          <div 
            className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center cursor-pointer hover:border-noteflow-400/50 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            {imagePreview ? (
              <div className="space-y-2">
                <img 
                  src={imagePreview} 
                  alt="Selected image" 
                  className="max-h-32 mx-auto rounded"
                />
                <p className="text-sm text-slate-300">{selectedImage?.name}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    clearImage();
                  }}
                  className="text-red-400 hover:text-red-300"
                >
                  Remove Image
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <ImageIcon className="h-12 w-12 mx-auto text-slate-400" />
                <div>
                  <p className="text-white">Click to upload an image</p>
                  <p className="text-sm text-slate-400">JPG, PNG, or WebP (max 10MB)</p>
                  <p className="text-xs text-slate-500 mt-1">Or paste an image with Ctrl+V</p>
                </div>
              </div>
            )}
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleImageSelect}
            className="hidden"
          />

          {/* Paste from Clipboard Button */}
          <Button
            onClick={handlePasteFromClipboard}
            variant="outline"
            className="w-full border-white/20 text-white hover:bg-white/10"
            size="sm"
          >
            <Clipboard className="h-4 w-4 mr-2" />
            Paste Image from Clipboard
          </Button>
        </div>

        {/* Process Button */}
        {selectedImage && (
          <Button
            onClick={processImageWithOCR}
            disabled={isProcessing}
            className="w-full bg-noteflow-500 hover:bg-noteflow-600 text-white"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Extracting Text...
              </>
            ) : (
              <>
                <FileText className="h-4 w-4 mr-2" />
                Extract Text from Image
              </>
            )}
          </Button>
        )}

        {/* Extracted Text */}
        {extractedText && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-white">Extracted Text:</h4>
            <Textarea
              value={extractedText}
              onChange={(e) => setExtractedText(e.target.value)}
              className="h-32 bg-black/30 border-white/10 text-white resize-none"
              placeholder="Extracted text will appear here..."
            />
            
            <div className="flex gap-2">
              <Button
                onClick={handleCopyText}
                variant="outline"
                size="sm"
                className="flex-1 border-white/20 text-white hover:bg-white/10"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy Text
              </Button>
              
              {onTextExtracted && (
                <Button
                  onClick={handleInsertText}
                  size="sm"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                >
                  Insert into Note
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default OCRUpload;
