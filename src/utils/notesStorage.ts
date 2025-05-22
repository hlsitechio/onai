
// Helper functions to work with Chrome Storage
import { encryptContent, decryptContent } from './encryptionUtils';

/**
 * Save a note to Chrome storage with encryption
 */
export const saveNote = async (noteId: string, content: string) => {
  try {
    // Encrypt the content before saving
    const encryptedContent = await encryptContent(content);
    
    if (typeof chrome !== 'undefined' && chrome.storage) {
      try {
        await chrome.storage.sync.set({ [noteId]: encryptedContent });
        return true;
      } catch (error) {
        console.error("Error saving to Chrome storage:", error);
        // Fallback to localStorage if Chrome API fails
        localStorage.setItem(`noteflow-${noteId}`, encryptedContent);
        return true;
      }
    } else {
      // Fallback to localStorage if Chrome API is not available
      localStorage.setItem(`noteflow-${noteId}`, encryptedContent);
      return true;
    }
  } catch (error) {
    console.error("Error encrypting or saving note:", error);
    // Last resort fallback - save unencrypted content
    try {
      localStorage.setItem(`noteflow-${noteId}-plain`, content);
      return true;
    } catch (e) {
      return false;
    }
  }
};

/**
 * Get all saved notes from Chrome storage
 */
export const getAllNotes = async (): Promise<Record<string, string>> => {
  try {
    let encryptedNotes: Record<string, string> = {};
    
    if (typeof chrome !== 'undefined' && chrome.storage) {
      try {
        encryptedNotes = await chrome.storage.sync.get(null) as Record<string, string>;
      } catch (error) {
        console.error("Error getting notes from Chrome storage:", error);
        // Fallback to localStorage
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith('noteflow-') && !key.endsWith('-plain')) {
            const noteId = key.replace('noteflow-', '');
            const content = localStorage.getItem(key) || '';
            encryptedNotes[noteId] = content;
          }
        });
      }
    } else {
      // Fallback to localStorage
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('noteflow-') && !key.endsWith('-plain')) {
          const noteId = key.replace('noteflow-', '');
          const content = localStorage.getItem(key) || '';
          encryptedNotes[noteId] = content;
        }
      });
    }
    
    // Decrypt all notes
    const notes: Record<string, string> = {};
    for (const [noteId, encryptedContent] of Object.entries(encryptedNotes)) {
      try {
        notes[noteId] = await decryptContent(encryptedContent);
      } catch (e) {
        console.error(`Error decrypting note ${noteId}:`, e);
        
        // Try to get plaintext version as fallback
        const plainKey = `noteflow-${noteId}-plain`;
        const plainContent = localStorage.getItem(plainKey);
        if (plainContent) {
          notes[noteId] = plainContent;
        } else {
          notes[noteId] = "Error: Could not decrypt note";
        }
      }
    }
    
    return notes;
  } catch (error) {
    console.error("Error processing notes:", error);
    return {};
  }
};

/**
 * Delete a note from Chrome storage
 */
export const deleteNote = async (noteId: string) => {
  if (typeof chrome !== 'undefined' && chrome.storage) {
    try {
      await chrome.storage.sync.remove(noteId);
      // Also remove any local fallback
      localStorage.removeItem(`noteflow-${noteId}`);
      localStorage.removeItem(`noteflow-${noteId}-plain`);
      return true;
    } catch (error) {
      console.error("Error deleting note from Chrome storage:", error);
      // Fallback to localStorage deletion
      localStorage.removeItem(`noteflow-${noteId}`);
      localStorage.removeItem(`noteflow-${noteId}-plain`);
      return true;
    }
  } else {
    // Fallback to localStorage
    localStorage.removeItem(`noteflow-${noteId}`);
    localStorage.removeItem(`noteflow-${noteId}-plain`);
    return true;
  }
};

/**
 * Share note to an external service
 */
export const shareNote = async (content: string, service: 'onedrive' | 'googledrive' | 'device') => {
  try {
    if (service === 'onedrive') {
      // Normally we would use OneDrive SDK or API here
      if (typeof chrome !== 'undefined' && chrome.tabs) {
        chrome.tabs.create({ url: 'https://onedrive.live.com/' });
        return true;
      }
      window.open('https://onedrive.live.com/', '_blank');
    } 
    else if (service === 'googledrive') {
      // Normally we would use Google Drive API here
      if (typeof chrome !== 'undefined' && chrome.tabs) {
        chrome.tabs.create({ url: 'https://drive.google.com/' });
        return true;
      }
      window.open('https://drive.google.com/', '_blank');
    }
    else if (service === 'device') {
      // Use Web Share API if available
      if (navigator.share) {
        await navigator.share({
          title: 'My NoteFlow Note',
          text: content,
        });
        return true;
      }
      
      // Create download link as fallback
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'noteflow-note.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
    return true;
  } catch (error) {
    console.error("Error sharing note:", error);
    return false;
  }
};
