
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  Upload, 
  X, 
  FileImage, 
  Copy, 
  Download,
  Loader2,
  Eye,
  EyeOff,
  Clipboard,
  Languages
} from "lucide-react";
import { cn } from "@/lib/utils";

// Supported languages for OCR
const SUPPORTED_LANGS = [
  { code: 'eng', name: 'English' },
  { code: 'fra', name: 'Français' },
  { code: 'spa', name: 'Español' }
];

interface OCRPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onTextExtracted: (text: string) => void;
}

const OCRPopup: React.FC<OCRPopupProps> = ({ isOpen, onClose, onTextExtracted }) => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [selectedLang, setSelectedLang] = useState('eng');
  const [ocrProgress, setOcrProgress] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const extractTextWithTesseract = async (imageData: string) => {
    setOcrProgress(0);
    try {
      console.log('Starting OCR processing with Tesseract.js...');
      
      // Import Tesseract.js dynamically
      const { createWorker } = await import('tesseract.js');
      
      console.log('Creating Tesseract worker with language:', selectedLang);
      const worker = await createWorker(selectedLang);
      
      // Set up progress tracking
      worker.setParameters({
        logger: m => {
          console.log('Tesseract progress:', m);
          if (m.status === 'recognizing text' && m.progress !== undefined) {
            setOcrProgress(Math.round(m.progress * 100));
          }
        }
      });
      
      console.log('Processing image with OCR...');
      const { data: { text } } = await worker.recognize(imageData);
      
      console.log('OCR completed, extracted text:', text);
      
      await worker.terminate();
      setOcrProgress(100);
      
      return text.trim();
    } catch (error) {
      console.error('Tesseract OCR error:', error);
      throw new Error(`Failed to extract text from image: ${error.message}`);
    }
  };

  const handleImageUpload = async (file: File) => {
    console.log('Uploading image:', file.name, file.type, file.size);
    
    if (!file.type.match(/^image\/(jpeg|jpg|png|webp)$/)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a JPG, PNG, or WebP image",
        variant: "destructive"
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
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
      console.log('Image loaded, starting OCR...');
      setUploadedImage(imageData);
      setExtractedText('');
      
      // Automatically start OCR processing
      setIsProcessing(true);
      
      try {
        const text = await extractTextWithTesseract(imageData);
        console.log('Setting extracted text:', text);
        setExtractedText(text);
        
        if (text && text.length > 0) {
          toast({
            title: "Text extracted successfully",
            description: `Extracted ${text.length} characters from the image`
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
        setExtractedText('');
        toast({
          title: "Extraction failed", 
          description: error.message || "Failed to extract text from the image",
          variant: "destructive"
        });
      } finally {
        setIsProcessing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log('File selected from input:', file.name);
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
            handleImageUpload(file);
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

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      console.log('File dropped:', file.name);
      handleImageUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const extractText = async () => {
    if (!uploadedImage) return;

    console.log('Re-extracting text from uploaded image...');
    setIsProcessing(true);
    setExtractedText('');
    
    try {
      const text = await extractTextWithTesseract(uploadedImage);
      setExtractedText(text);
      
      if (text && text.length > 0) {
        toast({
          title: "Text extracted successfully",
          description: "You can now copy or insert the extracted text"
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
      toast({
        title: "Extraction failed",
        description: error.message || "Failed to extract text from the image",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
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

  const clearAll = () => {
    setUploadedImage(null);
    setExtractedText('');
    setIsProcessing(false);
    setOcrProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] bg-black/95 backdrop-blur-xl border border-white/20 text-white overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <FileImage className="h-6 w-6 text-noteflow-400" />
            OCR - Extract Text from Image
          </DialogTitle>
        </DialogHeader>

        <div className="flex gap-6 h-[70vh]">
          {/* Left Panel - Image Upload & Preview */}
          <div className="flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Image Upload</h3>
              <div className="flex items-center gap-2">
                {/* Language selector */}
                <div className="flex items-center gap-1">
                  <Languages className="h-4 w-4 text-slate-300" />
                  <select
                    value={selectedLang}
                    onChange={(e) => setSelectedLang(e.target.value)}
                    className="bg-black/50 border border-slate-600 rounded px-2 py-1 text-sm text-white"
                    disabled={isProcessing}
                  >
                    {SUPPORTED_LANGS.map(lang => (
                      <option key={lang.code} value={lang.code}>{lang.name}</option>
                    ))}
                  </select>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPreview(!showPreview)}
                  className="text-slate-300 hover:text-white"
                >
                  {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  {showPreview ? 'Hide' : 'Show'} Preview
                </Button>
                {uploadedImage && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAll}
                    className="text-red-400 hover:text-red-300"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Clear
                  </Button>
                )}
              </div>
            </div>

            {!uploadedImage ? (
              <div 
                className="flex-1 border-2 border-dashed border-white/30 rounded-lg flex flex-col items-center justify-center p-8 hover:border-noteflow-400/50 transition-colors cursor-pointer"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => fileInputRef.current?.click()}
                tabIndex={0}
                role="button"
                aria-label="Upload an image"
              >
                <Upload className="h-16 w-16 text-white/40 mb-4" />
                <h3 className="text-xl font-medium mb-2">Upload Image</h3>
                <p className="text-slate-400 text-center mb-6">
                  Drag & drop an image here, or click to browse<br />
                  <span className="text-sm">Supports JPG, PNG, WebP (max 10MB)</span>
                </p>
                
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    className="bg-noteflow-600 hover:bg-noteflow-700 border-noteflow-500"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Browse Files
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePasteFromClipboard();
                    }}
                    className="bg-green-600 hover:bg-green-700 border-green-500"
                  >
                    <Clipboard className="h-4 w-4 mr-2" />
                    Paste from Clipboard
                  </Button>
                </div>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
              </div>
            ) : (
              showPreview && (
                <div className="flex-1 bg-black/50 rounded-lg p-4 overflow-auto">
                  <img 
                    src={uploadedImage} 
                    alt="Uploaded for OCR" 
                    className="max-w-full max-h-full object-contain mx-auto rounded"
                  />
                </div>
              )
            )}

            {uploadedImage && (
              <div className="mt-4 flex gap-3">
                <Button 
                  onClick={extractText}
                  disabled={isProcessing}
                  className="flex-1 bg-noteflow-600 hover:bg-noteflow-700"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Extracting Text...
                    </>
                  ) : (
                    <>
                      <FileImage className="h-4 w-4 mr-2" />
                      Re-extract Text
                    </>
                  )}
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-white/20 hover:bg-white/10"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Change Image
                </Button>
              </div>
            )}

            {/* Progress bar */}
            {isProcessing && (
              <div className="mt-2 w-full">
                <div className="h-2 rounded bg-slate-700 overflow-hidden">
                  <div
                    className="bg-noteflow-400 h-full transition-all duration-200"
                    style={{ width: `${ocrProgress}%` }}
                  />
                </div>
                <span className="text-xs text-slate-400">{ocrProgress}%</span>
              </div>
            )}
          </div>

          {/* Right Panel - Extracted Text */}
          <div className="flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Extracted Text</h3>
              {extractedText && !isProcessing && (
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={copyToClipboard}
                    className="text-slate-300 hover:text-white"
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={insertToNote}
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
                  onClick={insertToNote}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Insert to Note
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={copyToClipboard}
                  className="border-white/20 hover:bg-white/10"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Text
                </Button>
              </div>
            )}
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleFileInputChange}
          className="hidden"
        />
      </DialogContent>
    </Dialog>
  );
};

export default OCRPopup;
