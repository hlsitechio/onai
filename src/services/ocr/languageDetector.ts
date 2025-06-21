
import { supabase } from '@/integrations/supabase/client';

export class LanguageDetector {
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

  // Map language codes for Tesseract.js
  mapLanguageForTesseract(language: string): string {
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
}
