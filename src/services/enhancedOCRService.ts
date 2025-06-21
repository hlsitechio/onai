import { OCRResult } from './ocr/types';
import { ImagePreprocessor } from './ocr/imagePreprocessor';
import { LanguageDetector } from './ocr/languageDetector';
import { GoogleVisionProvider } from './ocr/googleVisionProvider';
import { TesseractProvider } from './ocr/tesseractProvider';
import { TextProcessor } from './ocr/textProcessor';

export type { OCRResult, ImagePreprocessResult, StructuredData } from './ocr/types';

export class EnhancedOCRService {
  private static instance: EnhancedOCRService;
  private imagePreprocessor: ImagePreprocessor;
  private languageDetector: LanguageDetector;
  private googleVisionProvider: GoogleVisionProvider;
  private tesseractProvider: TesseractProvider;
  private textProcessor: TextProcessor;
  
  private constructor() {
    this.imagePreprocessor = new ImagePreprocessor();
    this.languageDetector = new LanguageDetector();
    this.googleVisionProvider = new GoogleVisionProvider();
    this.tesseractProvider = new TesseractProvider();
    this.textProcessor = new TextProcessor();
  }
  
  public static getInstance(): EnhancedOCRService {
    if (!EnhancedOCRService.instance) {
      EnhancedOCRService.instance = new EnhancedOCRService();
    }
    return EnhancedOCRService.instance;
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
        const preprocessResult = await this.imagePreprocessor.preprocessImage(imageData);
        processedImageData = preprocessResult.processedImage;
        
        console.log(`Image quality: ${preprocessResult.quality}%`);
        console.log(`Size: ${preprocessResult.originalSize.width}x${preprocessResult.originalSize.height} → ${preprocessResult.processedSize.width}x${preprocessResult.processedSize.height}`);
      }

      // Step 2: Detect language if auto
      if (language === 'auto') {
        language = await this.languageDetector.detectLanguage(processedImageData);
        console.log(`Detected language: ${language}`);
      }

      // Step 3: Try Google Vision API first
      try {
        const result = await this.googleVisionProvider.processWithGoogleVision(processedImageData, language);
        console.log(`Google Vision completed in ${result.processingTime}ms with ${result.confidence}% confidence`);
        return result;
      } catch (visionError) {
        console.warn('Google Vision API failed, falling back to Tesseract.js:', visionError);
        
        // Step 4: Fallback to Tesseract.js
        const tesseractLanguage = this.languageDetector.mapLanguageForTesseract(language);
        const result = await this.tesseractProvider.processWithTesseract(processedImageData, tesseractLanguage);
        console.log(`Tesseract fallback completed in ${result.processingTime}ms with ${result.confidence}% confidence`);
        return result;
      }
    } catch (error) {
      console.error('All OCR methods failed:', error);
      throw new Error(`OCR processing failed: ${error.message}`);
    }
  }

  // Delegate methods to respective services
  async preprocessImage(imageData: string) {
    return this.imagePreprocessor.preprocessImage(imageData);
  }

  async detectLanguage(imageData: string): Promise<string> {
    return this.languageDetector.detectLanguage(imageData);
  }

  async processWithGoogleVision(imageData: string, language: string = 'en'): Promise<OCRResult> {
    return this.googleVisionProvider.processWithGoogleVision(imageData, language);
  }

  async processWithTesseract(imageData: string, language: string = 'eng'): Promise<OCRResult> {
    return this.tesseractProvider.processWithTesseract(imageData, language);
  }

  cleanText(text: string): string {
    return this.textProcessor.cleanText(text);
  }

  extractStructuredData(result: OCRResult) {
    return this.textProcessor.extractStructuredData(result);
  }
}

export const enhancedOCRService = EnhancedOCRService.getInstance();
