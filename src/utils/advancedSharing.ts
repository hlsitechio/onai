
import { v4 as uuidv4 } from 'uuid';

export interface ShareOptions {
  title?: string;
  description?: string;
  format?: 'txt' | 'md' | 'html' | 'json';
  includeMetadata?: boolean;
}

export interface ShareResult {
  success: boolean;
  shareUrl?: string;
  error?: string;
  method?: string;
}

export interface SharedNote {
  id: string;
  content: string;
  title: string;
  createdAt: string;
  expiresAt?: string;
  views?: number;
  format: string;
}

// Enhanced local storage manager for shared notes
class ShareStorageManager {
  private static readonly SHARE_PREFIX = 'shared-note-';
  private static readonly CLEANUP_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours

  static saveSharedNote(note: SharedNote): string {
    const shareId = uuidv4();
    const shareKey = `${this.SHARE_PREFIX}${shareId}`;
    
    try {
      localStorage.setItem(shareKey, JSON.stringify(note));
      this.scheduleCleanup();
      return shareId;
    } catch (error) {
      console.error('Failed to save shared note:', error);
      throw new Error('Failed to save note for sharing');
    }
  }

  static getSharedNote(shareId: string): SharedNote | null {
    const shareKey = `${this.SHARE_PREFIX}${shareId}`;
    
    try {
      const noteData = localStorage.getItem(shareKey);
      if (!noteData) return null;

      const note = JSON.parse(noteData) as SharedNote;
      
      // Check if note has expired
      if (note.expiresAt && new Date(note.expiresAt) < new Date()) {
        this.deleteSharedNote(shareId);
        return null;
      }

      // Increment view count
      note.views = (note.views || 0) + 1;
      localStorage.setItem(shareKey, JSON.stringify(note));
      
      return note;
    } catch (error) {
      console.error('Failed to retrieve shared note:', error);
      return null;
    }
  }

  static deleteSharedNote(shareId: string): void {
    const shareKey = `${this.SHARE_PREFIX}${shareId}`;
    localStorage.removeItem(shareKey);
  }

  static getAllSharedNotes(): SharedNote[] {
    const notes: SharedNote[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(this.SHARE_PREFIX)) {
        try {
          const noteData = localStorage.getItem(key);
          if (noteData) {
            const note = JSON.parse(noteData) as SharedNote;
            notes.push(note);
          }
        } catch (error) {
          console.error('Failed to parse shared note:', error);
        }
      }
    }
    
    return notes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  private static scheduleCleanup(): void {
    // Clean up expired notes
    setTimeout(() => {
      this.cleanupExpiredNotes();
    }, 1000);
  }

  private static cleanupExpiredNotes(): void {
    const now = new Date();
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(this.SHARE_PREFIX)) {
        try {
          const noteData = localStorage.getItem(key);
          if (noteData) {
            const note = JSON.parse(noteData) as SharedNote;
            if (note.expiresAt && new Date(note.expiresAt) < now) {
              localStorage.removeItem(key);
            }
          }
        } catch (error) {
          console.error('Cleanup error:', error);
        }
      }
    }
  }
}

// Content formatters
export const formatContent = (content: string, format: string, options: ShareOptions = {}): string => {
  const { title = 'Shared Note', includeMetadata = true } = options;
  const timestamp = new Date().toLocaleString();
  
  switch (format) {
    case 'html':
      return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
      line-height: 1.6; 
      max-width: 800px; 
      margin: 0 auto; 
      padding: 20px;
      color: #333;
    }
    .metadata { 
      color: #666; 
      font-size: 0.9em; 
      border-bottom: 1px solid #eee; 
      padding-bottom: 10px; 
      margin-bottom: 20px; 
    }
    pre { background: #f5f5f5; padding: 15px; border-radius: 5px; overflow-x: auto; }
    code { background: #f5f5f5; padding: 2px 4px; border-radius: 3px; }
    blockquote { border-left: 4px solid #ddd; margin: 0; padding-left: 20px; color: #666; }
  </style>
</head>
<body>
  ${includeMetadata ? `<div class="metadata">
    <h1>${title}</h1>
    <p>Created: ${timestamp}</p>
    <p>Source: OneAI Notes</p>
  </div>` : ''}
  <div class="content">
    ${markdownToHtml(content)}
  </div>
</body>
</html>`;
    
    case 'md':
      return includeMetadata ? 
        `# ${title}\n\n*Created: ${timestamp}*\n*Source: OneAI Notes*\n\n---\n\n${content}` : 
        content;
    
    case 'json':
      return JSON.stringify({
        title,
        content,
        createdAt: timestamp,
        source: 'OneAI Notes',
        format: 'json'
      }, null, 2);
    
    case 'txt':
    default:
      return includeMetadata ? 
        `${title}\n\nCreated: ${timestamp}\nSource: OneAI Notes\n\n${'='.repeat(50)}\n\n${content}` : 
        content;
  }
};

// Simple markdown to HTML converter
const markdownToHtml = (markdown: string): string => {
  if (!markdown) return '';
  
  return markdown
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/```([\s\S]+?)```/g, '<pre><code>$1</code></pre>')
    .replace(/^\* (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
    .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
    .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
    .replace(/\n/g, '<br>');
};

// URL-based sharing
export const createShareUrl = (content: string, options: ShareOptions = {}): ShareResult => {
  try {
    const title = extractTitle(content) || options.title || 'Shared Note';
    const format = options.format || 'txt';
    
    const sharedNote: SharedNote = {
      id: uuidv4(),
      content,
      title,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
      views: 0,
      format
    };

    const shareId = ShareStorageManager.saveSharedNote(sharedNote);
    const shareUrl = `${window.location.origin}${window.location.pathname}?share=${shareId}`;

    return {
      success: true,
      shareUrl,
      method: 'url'
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create share URL'
    };
  }
};

// File download sharing
export const downloadAsFile = (content: string, options: ShareOptions = {}): ShareResult => {
  try {
    const title = extractTitle(content) || options.title || 'note';
    const format = options.format || 'txt';
    const formattedContent = formatContent(content, format, options);
    
    const mimeTypes = {
      'txt': 'text/plain',
      'md': 'text/markdown',
      'html': 'text/html',
      'json': 'application/json'
    };

    const blob = new Blob([formattedContent], { type: mimeTypes[format] });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    
    a.href = url;
    a.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    return {
      success: true,
      method: 'download'
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to download file'
    };
  }
};

// Native device sharing
export const shareNatively = async (content: string, options: ShareOptions = {}): Promise<ShareResult> => {
  if (!navigator.share) {
    return {
      success: false,
      error: 'Native sharing not supported on this device'
    };
  }

  try {
    const title = extractTitle(content) || options.title || 'Shared Note';
    const format = options.format || 'txt';
    
    // Try file sharing first (better for note apps)
    try {
      const formattedContent = formatContent(content, format, options);
      const file = new File([formattedContent], `${title}.${format}`, { 
        type: format === 'html' ? 'text/html' : 'text/plain' 
      });
      
      await navigator.share({
        title,
        text: content.substring(0, 100) + (content.length > 100 ? '...' : ''),
        files: [file]
      });
    } catch (fileError) {
      // Fallback to text sharing
      await navigator.share({
        title,
        text: content,
        url: window.location.href
      });
    }

    return {
      success: true,
      method: 'native'
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Native sharing failed'
    };
  }
};

// QR Code sharing (generate data URL for QR code)
export const generateQRShareData = (content: string, options: ShareOptions = {}): ShareResult => {
  try {
    const result = createShareUrl(content, options);
    if (result.success && result.shareUrl) {
      return {
        success: true,
        shareUrl: result.shareUrl,
        method: 'qr'
      };
    }
    return result;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate QR data'
    };
  }
};

// Utility functions
const extractTitle = (content: string): string | null => {
  const lines = content.split('\n');
  const firstLine = lines[0]?.trim();
  
  if (firstLine) {
    // Remove markdown formatting
    return firstLine
      .replace(/^#+\s*/, '')
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .substring(0, 50);
  }
  
  return null;
};

// Load shared note from URL
export const loadSharedNoteFromUrl = (): SharedNote | null => {
  const urlParams = new URLSearchParams(window.location.search);
  const shareId = urlParams.get('share');
  
  if (shareId) {
    return ShareStorageManager.getSharedNote(shareId);
  }
  
  return null;
};

// Export storage manager for external use
export { ShareStorageManager };
