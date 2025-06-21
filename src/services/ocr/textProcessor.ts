
import { OCRResult, StructuredData } from './types';

export class TextProcessor {
  // Clean up and format extracted text
  cleanText(text: string): string {
    return text
      .replace(/\s+/g, ' ') // Normalize whitespace
      .replace(/[^\S\r\n]+/g, ' ') // Remove extra spaces but keep line breaks
      .trim();
  }

  // Extract structured data (tables, lists, etc.)
  extractStructuredData(result: OCRResult): StructuredData {
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
