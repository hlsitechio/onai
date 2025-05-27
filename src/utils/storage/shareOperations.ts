
import { StorageOperationResult } from './notesOperations';
import { shareNoteViaServer, getSharedNoteFromServer } from './syncService';
import { marked } from 'marked';
import html2canvas from 'html2canvas';
import { v4 as uuidv4 } from 'uuid';

export type ExportFormat = 'txt' | 'md' | 'html' | 'pdf';

export interface ShareOptions {
  format?: ExportFormat;
  title?: string;
  expirationDays?: number;
  includeMetadata?: boolean;
  password?: string;
}

/**
 * Helper to download content as a file
 */
export const downloadAsFile = (content: string, format: ExportFormat = 'txt', title?: string): Promise<boolean> => {
  return new Promise((resolve) => {
    try {
      // Determine content type and prepare content based on format
      let contentType = 'text/plain';
      let finalContent = content;
      const fileName = title ? `${title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.${format}` : `oneai-note.${format}`;
      
      if (format === 'html') {
        contentType = 'text/html';
        finalContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title || 'OneAI Note'}</title>
  <style>
    body { font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; }
    h1, h2, h3, h4, h5, h6 { margin-top: 1.5em; margin-bottom: 0.5em; }
    p { margin: 0.8em 0; }
    code { background: #f0f0f0; padding: 2px 4px; border-radius: 3px; }
    pre { background: #f0f0f0; padding: 10px; border-radius: 5px; overflow-x: auto; }
    blockquote { margin-left: 0; padding-left: 1em; border-left: 3px solid #ddd; color: #555; }
    img { max-width: 100%; height: auto; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #ddd; padding: 8px; }
    tr:nth-child(even) { background-color: #f2f2f2; }
  </style>
</head>
<body>
  ${marked.parse(content) as string}
  <footer>
    <p><small>Created with <a href="https://oneai.com" target="_blank">OneAI Notes</a></small></p>
  </footer>
</body>
</html>`;
      }
      
      const blob = new Blob([finalContent], { type: contentType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      resolve(true);
    } catch (error) {
      console.error('Error downloading file:', error);
      resolve(false);
    }
  });
};

/**
 * Export note as PDF
 */
export const exportAsPDF = async (content: string, title?: string): Promise<boolean> => {
  try {
    // Create a temporary container for rendering the markdown
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.width = '800px'; // Fixed width for rendering
    container.style.padding = '20px';
    container.style.fontFamily = 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif';
    container.style.lineHeight = '1.6';
    container.style.background = 'white';
    
    // Apply default styles for markdown elements
    const styleEl = document.createElement('style');
    styleEl.textContent = `
      h1, h2, h3, h4, h5, h6 { margin-top: 1.5em; margin-bottom: 0.5em; }
      p { margin: 0.8em 0; }
      code { background: #f0f0f0; padding: 2px 4px; border-radius: 3px; }
      pre { background: #f0f0f0; padding: 10px; border-radius: 5px; overflow-x: auto; }
      blockquote { margin-left: 0; padding-left: 1em; border-left: 3px solid #ddd; color: #555; }
      img { max-width: 100%; height: auto; }
      table { border-collapse: collapse; width: 100%; }
      th, td { border: 1px solid #ddd; padding: 8px; }
      tr:nth-child(even) { background-color: #f2f2f2; }
    `;
    container.appendChild(styleEl);
    
    // Add title
    if (title) {
      const titleEl = document.createElement('h1');
      titleEl.textContent = title;
      container.appendChild(titleEl);
    }
    
    // Convert markdown to HTML and append to container
    const contentDiv = document.createElement('div');
    // Ensure we're using the synchronous version of marked
    contentDiv.innerHTML = marked.parse(content) as string;
    container.appendChild(contentDiv);
    
    // Add footer
    const footer = document.createElement('footer');
    footer.innerHTML = `<p><small>Created with OneAI Notes</small></p>`;
    container.appendChild(footer);
    
    // Append to body temporarily for rendering
    document.body.appendChild(container);
    
    // Use html2canvas to capture the rendered content
    const canvas = await html2canvas(container, {
      scale: 2, // Higher scale for better quality
      useCORS: true,
      logging: false,
      backgroundColor: 'white'
    });
    
    // Remove the temporary container
    document.body.removeChild(container);
    
    // Convert canvas to PDF
    const imgData = canvas.toDataURL('image/png');
    
    // Create a simple PDF using data URL
    const pdfWindow = window.open();
    if (!pdfWindow) {
      console.error('Popup blocked - cannot generate PDF');
      return false;
    }
    
    pdfWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${title || 'OneAI Note'}</title>
        <style>
          body { margin: 0; }
          img { max-width: 100%; }
          @media print {
            body { margin: 0; }
            img { max-width: 100%; page-break-inside: avoid; }
          }
        </style>
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            }, 300);
          };
        </script>
      </head>
      <body>
        <img src="${imgData}" alt="${title || 'OneAI Note'}">
      </body>
      </html>
    `);
    
    return true;
  } catch (error) {
    console.error('Error exporting as PDF:', error);
    return false;
  }
};

/**
 * Generate a QR code for a URL (returns a data URL)
 */
export const generateQRCode = async (url: string): Promise<string> => {
  try {
    // Import QRCode (we've already installed it as a dependency)
    const QRCode = await import('qrcode');
    const dataUrl = await QRCode.toDataURL(url, {
      errorCorrectionLevel: 'H',
      margin: 1,
      width: 200,
      color: {
        dark: '#000000FF',
        light: '#FFFFFFFF'
      }
    });
    return dataUrl;
  } catch (error) {
    console.error('Error generating QR code:', error);
    return '';
  }
};

/**
 * Share note via email
 */
export const shareViaEmail = (content: string, title?: string): boolean => {
  try {
    // Limit content length for email
    const truncatedContent = content.length > 3000 
      ? content.substring(0, 3000) + '\n\n[Content truncated due to length...]' 
      : content;
    
    // Create email link
    const subject = encodeURIComponent(title || 'OneAI Note');
    const body = encodeURIComponent(truncatedContent);
    const mailtoLink = `mailto:?subject=${subject}&body=${body}`;
    
    // Open email client
    window.open(mailtoLink, '_blank');
    return true;
  } catch (error) {
    console.error('Error sharing via email:', error);
    return false;
  }
};

/**
 * Share note to social media
 */
export const shareToSocialMedia = (content: string, platform: 'twitter' | 'linkedin' | 'reddit', shareUrl?: string): boolean => {
  try {
    // Prepare content for sharing
    const title = content.split('\n')[0].replace(/^#+ /, '').substring(0, 50) || 'OneAI Note';
    const text = shareUrl 
      ? `${title}\n${shareUrl}` 
      : content.substring(0, 280) + (content.length > 280 ? '...' : '');
    
    let url = '';
    
    switch (platform) {
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
        break;
      case 'linkedin':
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl || window.location.href)}&title=${encodeURIComponent(title)}`;
        break;
      case 'reddit':
        url = `https://www.reddit.com/submit?url=${encodeURIComponent(shareUrl || window.location.href)}&title=${encodeURIComponent(title)}`;
        break;
    }
    
    if (url) {
      window.open(url, '_blank', 'width=600,height=400');
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`Error sharing to ${platform}:`, error);
    return false;
  }
};

/**
 * Share note functionality - enhanced with multiple options
 */
export const shareNote = async (
  content: string,
  shareMethod: 'server' | 'device' | 'download' | 'social' | 'email' | 'qrcode',
  options?: ShareOptions & { platform?: 'twitter' | 'linkedin' | 'reddit' }
): Promise<StorageOperationResult & { shareUrl?: string; qrCode?: string }> => {
  try {
    const title = options?.title || content.split('\n')[0].replace(/^#+ /, '').substring(0, 50) || 'OneAI Note';
    
    // Handle different sharing methods
    switch (shareMethod) {
      case 'server': {
        // Use our new server-based sharing
        const serverResult = await shareNoteViaServer(
          content,
          title,
          options?.expirationDays || 7
        );
        
        if (!serverResult.success || !serverResult.shareId) {
          throw new Error(serverResult.error || 'Failed to share note via server');
        }
        
        const shareUrl = `${window.location.origin}/shared/${serverResult.shareId}`;
        
        // Generate QR code if requested
        let qrCode = '';
        if (options?.includeMetadata) {
          qrCode = await generateQRCode(shareUrl);
        }
        
        return { 
          success: true,
          shareUrl,
          ...(qrCode ? { qrCode } : {})
        };
      }
      
      case 'device': {
        if (navigator.share) {
          try {
            // Format determines the file type for sharing
            const format = options?.format || 'txt';
            const fileName = `${title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.${format}`;
            const mimeType = format === 'html' ? 'text/html' : 'text/plain';
            
            // Prepare content based on format
            let fileContent = content;
            if (format === 'html') {
              fileContent = `<!DOCTYPE html><html><head><title>${title}</title></head><body>${marked.parse(content) as string}</body></html>`;
            }
            
            const file = new File([fileContent], fileName, { type: mimeType });
            
            await navigator.share({
              title: title,
              text: content.substring(0, 100) + (content.length > 100 ? '...' : ''),
              files: [file]
            });
            
            return { success: true };
          } catch (shareError) {
            console.error('Error sharing via device:', shareError);
            // Fallback to download
            await downloadAsFile(content, options?.format || 'txt', title);
            return { success: true };
          }
        } else {
          // Fallback to download if Web Share API is not available
          await downloadAsFile(content, options?.format || 'txt', title);
          return { success: true };
        }
      }
      
      case 'download': {
        // Export as specified format
        const format = options?.format || 'md';
        let success = false;
        
        if (format === 'pdf') {
          success = await exportAsPDF(content, title);
        } else {
          success = await downloadAsFile(content, format, title);
        }
        
        return { success };
      }
      
      case 'social': {
        // Share to social media
        if (!options?.platform) {
          return { success: false, error: 'Social media platform not specified' };
        }
        
        // First create a server share to get a URL
        const socialServerResult = await shareNoteViaServer(content, title, 30); // 30 days for social shares
        
        if (socialServerResult.success && socialServerResult.shareId) {
          const socialShareUrl = `${window.location.origin}/shared/${socialServerResult.shareId}`;
          const shared = shareToSocialMedia(content, options.platform, socialShareUrl);
          
          return { 
            success: shared,
            shareUrl: socialShareUrl,
            error: shared ? undefined : `Failed to share to ${options.platform}`
          };
        } else {
          // Fallback to direct content sharing if server share fails
          const shared = shareToSocialMedia(content, options.platform);
          return { 
            success: shared,
            error: shared ? undefined : `Failed to share to ${options.platform}`
          };
        }
      }
      
      case 'email': {
        // Share via email
        const emailShared = shareViaEmail(content, title);
        return { 
          success: emailShared,
          error: emailShared ? undefined : 'Failed to share via email'
        };
      }
      
      case 'qrcode': {
        // Create a server share and generate QR code
        const qrServerResult = await shareNoteViaServer(content, title, options?.expirationDays || 30);
        
        if (!qrServerResult.success || !qrServerResult.shareId) {
          throw new Error(qrServerResult.error || 'Failed to generate QR code');
        }
        
        const qrShareUrl = `${window.location.origin}/shared/${qrServerResult.shareId}`;
        const qrCodeDataUrl = await generateQRCode(qrShareUrl);
        
        if (!qrCodeDataUrl) {
          throw new Error('Failed to generate QR code image');
        }
        
        return { 
          success: true,
          shareUrl: qrShareUrl,
          qrCode: qrCodeDataUrl
        };
      }
      
      default:
        return { 
          success: false, 
          error: `Sharing method '${shareMethod}' is not supported`
        };
    }
  } catch (error) {
    console.error("Error sharing note:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error sharing note' 
    };
  }
};

/**
 * Get a shared note by its ID
 */
export const getSharedNote = async (shareId: string): Promise<{ content: string; title: string } | null> => {
  try {
    const result = await getSharedNoteFromServer(shareId);
    
    if (result.success && result.content) {
      return {
        content: result.content,
        title: result.title || 'Shared Note'
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error retrieving shared note:', error);
    return null;
  }
};

/**
 * Get a locally shared note by hash (legacy method)
 */
export const getLocallySharedNote = (hash: string): string | null => {
  try {
    return localStorage.getItem(`share-${hash}`);
  } catch (error) {
    console.error('Error retrieving locally shared note:', error);
    return null;
  }
};
