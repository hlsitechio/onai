
import { supabase } from '@/integrations/supabase/client';

export interface OCRResult {
  text: string;
  confidence: number;
  provider: 'google-vision' | 'tesseract';
  structuredData?: any;
  processingTime: number;
  language?: string;
}

export interface ImagePreprocessResult {
  processedImage: string;
  originalSize: { width: number; height: number };
  processedSize: { width: number; height: number };
  quality: number;
}

export class EnhancedOCRService {
  private static instance: EnhancedOCRService;
  
  public static getInstance(): EnhancedOCRService {
    if (!EnhancedOCRService.instance) {
      EnhancedOCRService.instance = new EnhancedOCRService();
    }
    return EnhancedOCRService.instance;
  }

  // Image preprocessing for better OCR results
  async preprocessImage(imageData: string): Promise<ImagePreprocessResult> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        
        // Calculate optimal size (max 2048px while maintaining aspect ratio)
        const maxSize = 2048;
        let { width, height } = img;
        
        if (width > maxSize || height > maxSize) {
          const ratio = Math.min(maxSize / width, maxSize / height);
          width *= ratio;
          height *= ratio;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Apply image enhancements
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        
        // Draw and enhance image
        ctx.drawImage(img, 0, 0, width, height);
        
        // Apply contrast and brightness adjustments
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;
        
        // Simple contrast enhancement
        const contrast = 1.2;
        const brightness = 10;
        
        for (let i = 0; i < data.length; i += 4) {
          // Apply contrast and brightness
          data[i] = Math.min(255, Math.max(0, contrast * data[i] + brightness));     // Red
          data[i + 1] = Math.min(255, Math.max(0, contrast * data[i + 1] + brightness)); // Green
          data[i + 2] = Math.min(255, Math.max(0, contrast * data[i + 2] + brightness)); // Blue
        }
        
        ctx.putImageData(imageData, 0, 0);
        
        // Calculate quality score based on image characteristics
        const quality = this.calculateImageQuality(imageData.data, width, height);
        
        resolve({
          processedImage: canvas.toDataURL('image/jpeg', 0.95),
          originalSize: { width: img.width, height: img.height },
          processedSize: { width, height },
          quality
        });
      };
      img.src = imageData;
    });
  }

  private calculateImageQuality(data: Uint8ClampedArray, width: number, height: number): number {
    // Calculate image quality based on contrast and sharpness
    let totalVariance = 0;
    let pixelCount = 0;
    
    for (let i = 0; i < data.length; i += 4) {
      const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      totalVariance += gray;
      pixelCount++;
    }
    
    const avgBrightness = totalVariance / pixelCount;
    let variance = 0;
    
    for (let i = 0; i < data.length; i += 4) {
      const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      variance += Math.pow(gray - avgBrightness, 2);
    }
    
    const contrast = Math.sqrt(variance / pixelCount);
    return Math.min(100, Math.max(0, (contrast / 128) * 100));
  }

  // Detect language from image using Google Vision API
  async detectLanguage(imageData: string): Promise<string> {
    try {
      const { data, error } = await supabase.functions.invoke('google-vision-ocr', {
        body: {
          imageData,
          features: ['TEXT_DETECTION'],
          language: 'auto'
        }
      });

      if (error) throw error;

      // Simple language detection based on text characteristics
      const text = data.text || '';
      
      // Basic language detection patterns
      if (/[\u4e00-\u9fff]/.test(text)) return 'zh';
      if (/[\u3040-\u309f\u30a0-\u30ff]/.test(text)) return 'ja';
      if (/[\uac00-\ud7af]/.test(text)) return 'ko';
      if (/[\u0600-\u06ff]/.test(text)) return 'ar';
      if (/[\u0400-\u04ff]/.test(text)) return 'ru';
      if (/[àáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿ]/.test(text.toLowerCase())) return 'fr';
      if (/[äöüß]/.test(text.toLowerCase())) return 'de';
      if (/[ñáéíóúü]/.test(text.toLowerCase())) return 'es';
      
      return 'en'; // Default to English
    } catch (error) {
      console.warn('Language detection failed:', error);
      return 'en';
    }
  }

  // Primary OCR processing with Google Vision API
  async processWithGoogleVision(imageData: string, language: string = 'en'): Promise<OCRResult> {
    const startTime = Date.now();
    
    try {
      console.log('Processing with Google Vision API...');
      
      const { data, error } = await supabase.functions.invoke('google-vision-ocr', {
        body: {
          imageData,
          features: ['DOCUMENT_TEXT_DETECTION'], // Use document detection for better structure
          language
        }
      });

      if (error) throw error;

      const processingTime = Date.now() - startTime;

      return {
        text: data.text || '',
        confidence: data.confidence || 0,
        provider: 'google-vision',
        structuredData: data.structuredData,
        processingTime,
        language
      };
    } catch (error) {
      console.error('Google Vision API failed:', error);
      throw error;
    }
  }

  // Fallback OCR processing with Tesseract.js
  async processWithTesseract(imageData: string, language: string = 'eng'): Promise<OCRResult> {
    const startTime = Date.now();
    
    try {
      console.log('Processing with Tesseract.js fallback...');
      
      const { createWorker } = await import('tesseract.js');
      const worker = await createWorker(language);
      
      const { data: { text, confidence } } = await worker.recognize(imageData);
      await worker.terminate();
      
      const processingTime = Date.now() - startTime;

      return {
        text: text.trim(),
        confidence: Math.round(confidence),
        provider: 'tesseract',
        processingTime,
        language
      };
    } catch (error) {
      console.error('Tesseract.js failed:', error);
      throw error;
    }
  }

  // Main OCR processing method with preprocessing and fallback
  async processImage(
    imageData: string, 
    language: string = 'auto',
    usePreprocessing: boolean = true
  ): Promise<OCRResult> {
    try {
      // Step 1: Preprocess image if enabled
      let processedImageData = imageData;
      if (usePreprocessing) {
        console.log('Preprocessing image...');
        const preprocessResult = await this.preprocessImage(imageData);
        processedImageData = preprocessResult.processedImage;
        
        console.log(`Image quality: ${preprocessResult.quality}%`);
        console.log(`Size: ${preprocessResult.originalSize.width}x${preprocessResult.originalSize.height} → ${preprocessResult.processedSize.width}x${preprocessResult.processedSize.height}`);
      }

      // Step 2: Detect language if auto
      if (language === 'auto') {
        language = await this.detectLanguage(processedImageData);
        console.log(`Detected language: ${language}`);
      }

      // Step 3: Try Google Vision API first
      try {
        const result = await this.processWithGoogleVision(processedImageData, language);
        console.log(`Google Vision completed in ${result.processingTime}ms with ${result.confidence}% confidence`);
        return result;
      } catch (visionError) {
        console.warn('Google Vision API failed, falling back to Tesseract.js:', visionError);
        
        // Step 4: Fallback to Tesseract.js
        const tesseractLanguage = this.mapLanguageForTesseract(language);
        const result = await this.processWithTesseract(processedImageData, tesseractLanguage);
        console.log(`Tesseract fallback completed in ${result.processingTime}ms with ${result.confidence}% confidence`);
        return result;
      }
    } catch (error) {
      console.error('All OCR methods failed:', error);
      throw new Error(`OCR processing failed: ${error.message}`);
    }
  }

  // Map language codes for Tesseract.js
  private mapLanguageForTesseract(language: string): string {
    const languageMap: Record<string, string> = {
      'en': 'eng',
      'es': 'spa',
      'fr': 'fra',
      'de': 'deu',
      'it': 'ita',
      'pt': 'por',
      'ru': 'rus',
      'ja': 'jpn',
      'ko': 'kor',
      'zh': 'chi_sim',
      'ar': 'ara'
    };
    return languageMap[language] || 'eng';
  }

  // Clean up and format extracted text
  cleanText(text: string): string {
    return text
      .replace(/\s+/g, ' ') // Normalize whitespace
      .replace(/[^\S\r\n]+/g, ' ') // Remove extra spaces but keep line breaks
      .trim();
  }

  // Extract structured data (tables, lists, etc.)
  extractStructuredData(result: OCRResult): {
    paragraphs: string[];
    tables: string[][];
    lists: string[];
  } {
    const lines = result.text.split('\n').filter(line => line.trim());
    
    const paragraphs: string[] = [];
    const tables: string[][] = [];
    const lists: string[] = [];
    
    let currentParagraph = '';
    
    for (const line of lines) {
      const trimmed = line.trim();
      
      // Detect lists
      if (/^[\-\*\+•]\s/.test(trimmed) || /^\d+[\.\)]\s/.test(trimmed)) {
        if (currentParagraph) {
          paragraphs.push(currentParagraph.trim());
          currentParagraph = '';
        }
        lists.push(trimmed);
      }
      // Detect table-like structures (multiple tabs or pipes)
      else if (trimmed.includes('\t') || trimmed.includes('|')) {
        if (currentParagraph) {
          paragraphs.push(currentParagraph.trim());
          currentParagraph = '';
        }
        tables.push(trimmed.split(/\t|\|/).map(cell => cell.trim()));
      }
      // Regular text
      else {
        currentParagraph += (currentParagraph ? ' ' : '') + trimmed;
      }
    }
    
    if (currentParagraph) {
      paragraphs.push(currentParagraph.trim());
    }
    
    return { paragraphs, tables, lists };
  }
}

export const enhancedOCRService = EnhancedOCRService.getInstance();
