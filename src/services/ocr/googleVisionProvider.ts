
import { supabase } from '@/integrations/supabase/client';
import { OCRResult } from './types';

export class GoogleVisionProvider {
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
}
