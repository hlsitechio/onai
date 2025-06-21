
import { OCRResult } from './types';

export class TesseractProvider {
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
}
