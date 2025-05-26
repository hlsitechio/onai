
import { StorageOperationResult } from './notesOperations';

/**
 * Helper to download content as a file
 */
const downloadAsFile = (content: string, format: 'txt' | 'md' | 'html' = 'txt'): void => {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `oneai-note.${format}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

/**
 * Share note functionality - simplified for new format
 */
export const shareNote = async (
  content: string, 
  service: 'onedrive' | 'googledrive' | 'device' | 'link'
): Promise<StorageOperationResult & { shareUrl?: string }> => {
  try {
    if (service === 'device') {
      if (navigator.share) {
        try {
          const fileName = 'oneai-note.txt';
          const file = new File([content], fileName, { type: 'text/plain' });
          
          await navigator.share({
            title: 'OneAI Note',
            text: content.substring(0, 100) + (content.length > 100 ? '...' : ''),
            files: [file]
          });
          return { success: true };
        } catch (shareError) {
          console.error('Error sharing:', shareError);
        }
      }
      
      // Fallback to download
      downloadAsFile(content, 'txt');
      return { success: true };
    }
    
    if (service === 'link') {
      // Generate a simple hash for the content
      const generateHash = (text: string) => {
        let hash = 0;
        for (let i = 0; i < text.length; i++) {
          const char = text.charCodeAt(i);
          hash = ((hash << 5) - hash) + char;
          hash = hash & hash;
        }
        return Math.abs(hash).toString(16) + Date.now().toString(16);
      };
      
      const contentHash = generateHash(content);
      localStorage.setItem(`share-${contentHash}`, content);
      
      const shareUrl = `${window.location.origin}${window.location.pathname}?note=${contentHash}`;
      
      return { 
        success: true,
        shareUrl
      };
    }

    return { 
      success: false, 
      error: 'External sharing services are not currently supported'
    };
  } catch (error) {
    console.error("Error sharing note:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error sharing note' 
    };
  }
};
