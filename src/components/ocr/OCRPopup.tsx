
import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileImage, Upload, Camera, Clipboard, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { enhancedOCRService, OCRResult } from '@/services/enhancedOCRService';
import OCRLanguageSelector from './components/OCRLanguageSelector';
import OCRImagePreview from './components/OCRImagePreview';
import OCRResultDisplay from './components/OCRResultDisplay';
import OCRProgressBar from './components/OCRProgressBar';
import { OCRPopupProps } from './types/OCRTypes';

const OCRPopup: React.FC<OCRPopupProps> = ({ isOpen, onClose, onTextExtracted }) => {
  const [selectedLang, setSelectedLang] = useState('auto');
  const [uploadedImage, setUploadedImage] = useState<{
    url: string;
    preview: string;
    name: string;
    quality?: number;
    originalSize?: { width: number; height: number };
    processedSize?: { width: number; height: number };
  } | null>(null);
  const [ocrResult, setOcrResult] = useState<OCRResult | null>(null);
  const [extractedText, setExtractedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [ocrProgress, setOcrProgress] = useState(0);
  const [usePreprocessing, setUsePreprocessing] = useState(true);
  const [structuredData, setStructuredData] = useState<any>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleImageUpload = async (file: File) => {
    console.log('Uploading image:', file.name, file.type, file.size);
    
    if (!file.type.match(/^image\/(jpeg|jpg|png|webp|bmp|tiff)$/)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a JPG, PNG, WebP, BMP, or TIFF image",
        variant: "destructive"
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 10MB",
        variant: "destructive"
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const imageData = e.target?.result as string;
      console.log('Image loaded, setting up preview...');
      
      // Create object URL for preview
      const objectUrl = URL.createObjectURL(file);
      
      setUploadedImage({
        url: imageData,
        preview: objectUrl,
        name: file.name
      });
      
      setOcrResult(null);
      setExtractedText('');
      setStructuredData(null);
      
      // Auto-process if enabled
      if (selectedLang !== 'manual') {
        await processOCR(imageData);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handlePasteFromClipboard = async () => {
    try {
      console.log('Attempting to read from clipboard...');
      const clipboardItems = await navigator.clipboard.read();
      
      for (const clipboardItem of clipboardItems) {
        for (const type of clipboardItem.types) {
          if (type.startsWith('image/')) {
            console.log('Found image in clipboard:', type);
            const blob = await clipboardItem.getType(type);
            const file = new File([blob], 'pasted-image.png', { type });
            await handleImageUpload(file);
            return;
          }
        }
      }
      
      toast({
        title: "No image found",
        description: "No image found in clipboard",
        variant: "destructive"
      });
    } catch (error) {
      console.error('Clipboard access error:', error);
      toast({
        title: "Clipboard access failed",
        description: "Please grant clipboard permissions or upload an image manually",
        variant: "destructive"
      });
    }
  };

  const processOCR = async (imageData?: string) => {
    const targetImage = imageData || uploadedImage?.url;
    if (!targetImage) {
      toast({
        title: "No image selected",
        description: "Please upload an image first",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    setOcrProgress(0);
    
    try {
      console.log('Starting enhanced OCR processing...');
      
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setOcrProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const result = await enhancedOCRService.processImage(
        targetImage,
        selectedLang,
        usePreprocessing
      );
      
      clearInterval(progressInterval);
      setOcrProgress(100);
      
      console.log('OCR completed:', result);
      
      setOcrResult(result);
      setExtractedText(result.text);
      
      // Extract structured data
      if (result.text) {
        const structured = enhancedOCRService.extractStructuredData(result);
        setStructuredData(structured);
      }
      
      if (result.text && result.text.length > 0) {
        toast({
          title: "Text extracted successfully",
          description: `Extracted ${result.text.length} characters with ${result.confidence}% confidence (${result.provider})`,
          duration: 3000
        });
      } else {
        toast({
          title: "No text found",
          description: "No readable text was detected in the image",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('OCR processing error:', error);
      setOcrResult(null);
      setExtractedText('');
      setStructuredData(null);
      toast({
        title: "Extraction failed", 
        description: error.message || "Failed to extract text from the image",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
      setTimeout(() => setOcrProgress(0), 1000);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(extractedText);
      toast({
        title: "Copied to clipboard",
        description: "Extracted text has been copied"
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Please select and copy the text manually",
        variant: "destructive"
      });
    }
  };

  const insertToNote = () => {
    if (extractedText) {
      onTextExtracted(extractedText);
      onClose();
      toast({
        title: "Text inserted",
        description: "Extracted text has been added to your note"
      });
    }
  };

  const improveWithAI = async () => {
    // This could integrate with the existing AI system to improve the extracted text
    toast({
      title: "AI improvement",
      description: "AI text improvement feature coming soon!",
    });
  };

  const clearAll = () => {
    if (uploadedImage?.preview) {
      URL.revokeObjectURL(uploadedImage.preview);
    }
    setUploadedImage(null);
    setOcrResult(null);
    setExtractedText('');
    setStructuredData(null);
    setOcrProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[95vh] bg-black/95 backdrop-blur-xl border border-white/20 text-white overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <FileImage className="h-6 w-6 text-noteflow-400" />
            Enhanced OCR - Extract Text from Images
            <Badge variant="outline" className="bg-green-500/20 text-green-300 border-green-500/30 ml-2">
              Google Vision + AI
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="flex gap-6 h-[75vh]">
          {/* Left Panel - Image Upload and Settings */}
          <div className="flex-1 flex flex-col min-w-0">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Image Input</h3>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setUsePreprocessing(!usePreprocessing)}
                  className={`border-white/20 text-xs ${usePreprocessing ? 'bg-noteflow-500/20 text-noteflow-300' : 'text-white/70'}`}
                >
                  <Settings className="h-3 w-3 mr-1" />
                  Auto-enhance: {usePreprocessing ? 'ON' : 'OFF'}
                </Button>
                
                <OCRLanguageSelector
                  selectedLang={selectedLang}
                  setSelectedLang={setSelectedLang}
                  isProcessing={isProcessing}
                />
              </div>
            </div>

            {/* Image Upload Area */}
            <div className="flex-1 min-h-0">
              {uploadedImage ? (
                <OCRImagePreview
                  imageUrl={uploadedImage.preview}
                  imageName={uploadedImage.name}
                  onRemove={clearAll}
                  quality={uploadedImage.quality}
                  originalSize={uploadedImage.originalSize}
                  processedSize={uploadedImage.processedSize}
                />
              ) : (
                <div 
                  className="w-full h-full bg-black/30 border-2 border-dashed border-white/20 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-noteflow-400/50 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const files = Array.from(e.dataTransfer.files);
                    if (files[0]) handleImageUpload(files[0]);
                  }}
                >
                  <FileImage className="h-16 w-16 text-white/40 mb-4" />
                  <p className="text-lg text-white/80 mb-2">Drop image here or click to upload</p>
                  <p className="text-sm text-white/60 mb-4">Supports JPG, PNG, WebP, BMP, TIFF (max 10MB)</p>
                  
                  <div className="flex gap-3">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-white/20 text-white/80 hover:bg-white/10"
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload File
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-white/20 text-white/80 hover:bg-white/10"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePasteFromClipboard();
                      }}
                    >
                      <Clipboard className="h-4 w-4 mr-2" />
                      Paste
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Process Button and Progress */}
            <div className="mt-4 space-y-3">
              <OCRProgressBar
                isProcessing={isProcessing}
                progress={ocrProgress}
              />
              
              {uploadedImage && (
                <Button
                  onClick={() => processOCR()}
                  disabled={isProcessing}
                  className="w-full bg-noteflow-500 hover:bg-noteflow-600 text-white"
                >
                  {isProcessing ? 'Processing...' : 'Extract Text'}
                </Button>
              )}
            </div>

            <input 
              type="file" 
              ref={fileInputRef}
              className="hidden" 
              accept="image/*" 
              onChange={handleFileInput} 
            />
          </div>

          {/* Right Panel - Results */}
          <div className="flex-1 flex flex-col min-w-0">
            <h3 className="text-lg font-medium mb-4">Extracted Text</h3>
            
            {ocrResult ? (
              <OCRResultDisplay
                result={ocrResult}
                onTextChange={setExtractedText}
                onCopy={copyToClipboard}
                onInsert={insertToNote}
                onImproveWithAI={improveWithAI}
                structuredData={structuredData}
              />
            ) : (
              <div className="flex-1 flex items-center justify-center bg-black/30 border border-white/10 rounded-lg">
                <div className="text-center">
                  <FileImage className="h-12 w-12 text-white/40 mx-auto mb-3" />
                  <p className="text-white/60">Upload an image to extract text</p>
                  <p className="text-xs text-white/40 mt-1">
                    Powered by Google Vision API with Tesseract.js fallback
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OCRPopup;
