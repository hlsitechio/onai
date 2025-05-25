
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";

export const useOCRProcessor = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [ocrProgress, setOcrProgress] = useState<number>(0);
  const { toast } = useToast();

  const extractTextWithTesseract = async (imageData: string, selectedLang: string) => {
    setOcrProgress(0);
    try {
      console.log('Starting OCR processing with Tesseract.js...');
      
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

  const handleImageUpload = async (file: File, selectedLang: string) => {
    console.log('Uploading image:', file.name, file.type, file.size);
    
    if (!file.type.match(/^image\/(jpeg|jpg|png|webp)$/)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a JPG, PNG, or WebP image",
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
      console.log('Image loaded, starting OCR...');
      setUploadedImage(imageData);
      setExtractedText('');
      
      setIsProcessing(true);
      
      try {
        const text = await extractTextWithTesseract(imageData, selectedLang);
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

  const handlePasteFromClipboard = async (selectedLang: string) => {
    try {
      console.log('Attempting to read from clipboard...');
      const clipboardItems = await navigator.clipboard.read();
      
      for (const clipboardItem of clipboardItems) {
        for (const type of clipboardItem.types) {
          if (type.startsWith('image/')) {
            console.log('Found image in clipboard:', type);
            const blob = await clipboardItem.getType(type);
            const file = new File([blob], 'pasted-image.png', { type });
            handleImageUpload(file, selectedLang);
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

  const extractText = async (selectedLang: string) => {
    if (!uploadedImage) return;

    console.log('Re-extracting text from uploaded image...');
    setIsProcessing(true);
    setExtractedText('');
    
    try {
      const text = await extractTextWithTesseract(uploadedImage, selectedLang);
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

  const clearAll = (fileInputRef: React.RefObject<HTMLInputElement>) => {
    setUploadedImage(null);
    setExtractedText('');
    setIsProcessing(false);
    setOcrProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return {
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
  };
};
