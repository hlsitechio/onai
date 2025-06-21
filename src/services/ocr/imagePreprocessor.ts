
import { ImagePreprocessResult } from './types';

export class ImagePreprocessor {
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
}
