
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

export interface StructuredData {
  paragraphs: string[];
  tables: string[][];
  lists: string[];
}
