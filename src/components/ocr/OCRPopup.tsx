
import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileImage, Upload, Clipboard, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useOCRProcessor } from './hooks/useOCRProcessor';
import OCRLanguageSelector from './components/OCRLanguageSelector';
import OCRImageUpload from './components/OCRImageUpload';
import OCRTextOutput from './components/OCRTextOutput';
import { OCRPopupProps } from './types/OCRTypes';

const OCRPopup: React.FC<OCRPopupProps> = ({ isOpen, onClose, onTextExtracted }) => {
  const [selectedLang, setSelectedLang] = useState('eng');
  const [showPreview, setShowPreview] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const {
    uploadedImage,
    extractedText,
    setExtractedText,
    isProcessing,
    ocrProgress,
    handleImageUpload,
    handlePasteFromClipboard,
    extractText,
    copyToClipboard,
    clearAll
  } = useOCRProcessor();

  const handleFileUpload = (file: File) => {
    console.log('File uploaded in OCRPopup:', file.name);
    handleImageUpload(file, selectedLang);
  };

  const handleExtractText = () => {
    console.log('Extract text triggered with language:', selectedLang);
    extractText(selectedLang);
  };

  const handleInsertToNote = () => {
    if (extractedText && extractedText.trim()) {
      console.log('Inserting text to note:', extractedText.length, 'characters');
      onTextExtracted(extractedText);
      onClose();
      toast({
        title: "Text inserted",
        description: "Extracted text has been added to your note"
      });
    } else {
      toast({
        title: "No text to insert",
        description: "Please extract text from an image first",
        variant: "destructive"
      });
    }
  };

  const handleClearAll = () => {
    clearAll(fileInputRef);
  };

  const handlePaste = () => {
    handlePasteFromClipboard(selectedLang);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] bg-black/95 backdrop-blur-xl border border-white/20 text-white overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <FileImage className="h-6 w-6 text-noteflow-400" />
            OCR - Extract Text from Images
            <Badge variant="outline" className="bg-noteflow-500/20 text-noteflow-300 border-noteflow-500/30 ml-2">
              Tesseract.js
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="flex gap-6 h-[70vh]">
          {/* Left Panel - Image Upload */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Image & Settings</h3>
              <div className="flex items-center gap-2">
                <OCRLanguageSelector
                  selectedLang={selectedLang}
                  setSelectedLang={setSelectedLang}
                  isProcessing={isProcessing}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePaste}
                  disabled={isProcessing}
                  className="border-white/20 text-white/80 hover:bg-white/10"
                >
                  <Clipboard className="h-4 w-4 mr-1" />
                  Paste
                </Button>
              </div>
            </div>

            <OCRImageUpload
              uploadedImage={uploadedImage}
              isProcessing={isProcessing}
              showPreview={showPreview}
              setShowPreview={setShowPreview}
              onImageUpload={handleFileUpload}
              onClearAll={handleClearAll}
              onExtractText={handleExtractText}
              fileInputRef={fileInputRef}
            />

            {/* Progress indicator */}
            {isProcessing && (
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm text-white/70 mb-2">
                  <span>Processing...</span>
                  <span>{ocrProgress}%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div 
                    className="bg-noteflow-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${ocrProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Right Panel - Text Output */}
          <div className="flex-1">
            <OCRTextOutput
              extractedText={extractedText}
              setExtractedText={setExtractedText}
              isProcessing={isProcessing}
              uploadedImage={uploadedImage}
              onCopyToClipboard={copyToClipboard}
              onInsertToNote={handleInsertToNote}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OCRPopup;
