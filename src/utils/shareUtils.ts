
export const shareToOneDrive = async (content: string, title: string): Promise<{ success: boolean; shareUrl?: string; error?: string }> => {
  try {
    // Create a blob with the note content
    const blob = new Blob([content], { type: 'text/plain' });
    const file = new File([blob], `${title}.txt`, { type: 'text/plain' });
    
    // Use Web Share API if available
    if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({
        title: title,
        text: content,
        files: [file]
      });
      return { success: true };
    }
    
    // Fallback: download the file
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    return { success: true };
  } catch (error) {
    console.error('Error sharing to OneDrive:', error);
    return { success: false, error: 'Failed to share to OneDrive' };
  }
};

export const shareToGoogleDrive = async (content: string, title: string): Promise<{ success: boolean; shareUrl?: string; error?: string }> => {
  try {
    // Create a blob with the note content
    const blob = new Blob([content], { type: 'text/plain' });
    const file = new File([blob], `${title}.txt`, { type: 'text/plain' });
    
    // Use Web Share API if available
    if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({
        title: title,
        text: content,
        files: [file]
      });
      return { success: true };
    }
    
    // Fallback: download the file
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    return { success: true };
  } catch (error) {
    console.error('Error sharing to Google Drive:', error);
    return { success: false, error: 'Failed to share to Google Drive' };
  }
};

export const shareToDevice = async (content: string, title: string): Promise<{ success: boolean; shareUrl?: string; error?: string }> => {
  try {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    return { success: true };
  } catch (error) {
    console.error('Error downloading to device:', error);
    return { success: false, error: 'Failed to download to device' };
  }
};

export const createShareLink = async (content: string): Promise<{ success: boolean; shareUrl?: string; error?: string }> => {
  try {
    // Encode content to base64 for URL sharing
    const encodedContent = btoa(unescape(encodeURIComponent(content)));
    const shareUrl = `${window.location.origin}/?shared=${encodedContent}`;
    
    // Copy to clipboard
    await navigator.clipboard.writeText(shareUrl);
    
    return { success: true, shareUrl };
  } catch (error) {
    console.error('Error creating share link:', error);
    return { success: false, error: 'Failed to create share link' };
  }
};
