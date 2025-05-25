
import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FileImage } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useOCRProcessor } from './hooks/useOCRProcessor';
import OCRLanguageSelector from './components/OCRLanguageSelector';
import OCRImageUpload from './components/OCRImageUpload';
import OCRTextOutput from './components/OCRTextOutput';
import OCRProgressBar from './components/OCRProgressBar';
import { OCRPopupProps } from './types/OCRTypes';

const OCRPopup: React.FC<OCRPopupProps> = ({ isOpen, onClose, onTextExtracted }) => {
  const [showPreview, setShowPreview] = useState(true);
  const [selectedLang, setSelectedLang] = useState('eng');
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

  const handleImageUploadWrapper = (file: File) => {
    handleImageUpload(file, selectedLang);
  };

  const handlePasteFromClipboardWrapper = async () => {
    await handlePasteFromClipboard(selectedLang);
  };

  const handleExtractText = () => {
    extractText(selectedLang);
  };

  const handleClearAll = () => {
    clearAll(fileInputRef);
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
          <div className="flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Image Upload</h3>
              <div className="flex items-center gap-2">
                <OCRLanguageSelector
                  selectedLang={selectedLang}
                  setSelectedLang={setSelectedLang}
                  isProcessing={isProcessing}
                />
                
                <OCRImageUpload
                  uploadedImage={uploadedImage}
                  isProcessing={isProcessing}
                  showPreview={showPreview}
                  setShowPreview={setShowPreview}
                  onImageUpload={handleImageUploadWrapper}
                  onClearAll={handleClearAll}
                  onExtractText={handleExtractText}
                  fileInputRef={fileInputRef}
                />
              </div>
            </div>

            <OCRProgressBar
              isProcessing={isProcessing}
              progress={ocrProgress}
            />
          </div>

          <OCRTextOutput
            extractedText={extractedText}
            setExtractedText={setExtractedText}
            isProcessing={isProcessing}
            uploadedImage={uploadedImage}
            onCopyToClipboard={copyToClipboard}
            onInsertToNote={insertToNote}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OCRPopup;
