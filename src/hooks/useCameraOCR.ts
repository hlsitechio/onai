
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useNotesManager } from './useNotesManager';

export const useCameraOCR = () => {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const { createNote } = useNotesManager();

  const extractTextWithTesseract = async (imageData: string): Promise<string> => {
    try {
      console.log('Starting OCR processing with Tesseract.js...');
      
      const { createWorker } = await import('tesseract.js');
      const worker = await createWorker('eng');
      
      console.log('Processing image with OCR...');
      const { data: { text } } = await worker.recognize(imageData);
      
      await worker.terminate();
      console.log('OCR completed, extracted text:', text);
      
      return text.trim();
    } catch (error) {
      console.error('Tesseract OCR error:', error);
      throw new Error(`Failed to extract text from image: ${error.message}`);
    }
  };

  const openCamera = () => {
    setIsCameraOpen(true);
  };

  const closeCamera = () => {
    setIsCameraOpen(false);
  };

  const handlePhotoCapture = async (imageData: string) => {
    setIsProcessing(true);
    
    try {
      // Extract text from the captured image
      const extractedText = await extractTextWithTesseract(imageData);
      
      if (!extractedText || extractedText.length === 0) {
        toast({
          title: "No text found",
          description: "No readable text was detected in the photo. Please try again.",
          variant: "destructive"
        });
        return;
      }

      // Create a new note with the extracted text
      const newNote = await createNote(
        `Text from Photo - ${new Date().toLocaleDateString()}`,
        `<div class="ocr-content" style="border: 1px solid #666; padding: 12px; margin: 12px 0; border-radius: 8px; background: rgba(120, 60, 255, 0.1);">
          <div style="font-size: 12px; color: #999; margin-bottom: 8px; display: flex; align-items: center; gap: 4px;">
            <span>📷</span>
            <span>Text captured from photo</span>
          </div>
          <div>${extractedText.replace(/\n/g, '<br>')}</div>
        </div>`
      );

      if (newNote) {
        toast({
          title: "Note created successfully",
          description: `Extracted ${extractedText.length} characters and created a new note.`,
        });
      }
    } catch (error) {
      console.error('Camera OCR error:', error);
      toast({
        title: "Text extraction failed",
        description: error.message || "Failed to extract text from the photo.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isCameraOpen,
    isProcessing,
    openCamera,
    closeCamera,
    handlePhotoCapture
  };
};
