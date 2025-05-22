
// Helper functions to work with Chrome Storage
import { encryptContent, decryptContent } from './encryptionUtils';
import { useToast } from "@/hooks/use-toast";

// Types
export type StorageProviderType = 'chrome' | 'local';
export interface StorageOperationResult {
  success: boolean;
  error?: string;
}

// Constants
const STORAGE_PREFIX = 'noteflow-';
const PLAIN_SUFFIX = '-plain';

/**
 * Detect which storage provider to use
 */
const getStorageProvider = (): StorageProviderType => {
  if (typeof chrome !== 'undefined' && chrome.storage) {
    return 'chrome';
  }
  return 'local';
};

/**
 * Save content using Chrome storage API
 */
const saveToChrome = async (key: string, value: string): Promise<StorageOperationResult> => {
  try {
    await chrome.storage.sync.set({ [key]: value });
    return { success: true };
  } catch (error) {
    console.error("Error saving to Chrome storage:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error saving to Chrome storage' 
    };
  }
};

/**
 * Save content to localStorage
 */
const saveToLocal = (key: string, value: string): StorageOperationResult => {
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${key}`, value);
    return { success: true };
  } catch (error) {
    console.error("Error saving to localStorage:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error saving to localStorage' 
    };
  }
};

/**
 * Save a note to storage with encryption
 */
export const saveNote = async (noteId: string, content: string): Promise<StorageOperationResult> => {
  try {
    // Encrypt the content before saving
    const encryptedContent = await encryptContent(content);
    const provider = getStorageProvider();
    
    // Save to appropriate storage
    if (provider === 'chrome') {
      const result = await saveToChrome(noteId, encryptedContent);
      if (!result.success) {
        // Fallback to localStorage if Chrome API fails
        return saveToLocal(noteId, encryptedContent);
      }
      return result;
    } else {
      // Use localStorage
      return saveToLocal(noteId, encryptedContent);
    }
  } catch (error) {
    console.error("Error encrypting or saving note:", error);
    
    // Last resort fallback - save unencrypted content
    try {
      localStorage.setItem(`${STORAGE_PREFIX}${noteId}${PLAIN_SUFFIX}`, content);
      return { 
        success: true, 
        error: 'Saved unencrypted as fallback due to encryption error' 
      };
    } catch (e) {
      return { 
        success: false, 
        error: 'Failed to save note even in fallback mode' 
      };
    }
  }
};

/**
 * Get all saved notes from storage
 */
export const getAllNotes = async (): Promise<Record<string, string>> => {
  try {
    let encryptedNotes: Record<string, string> = {};
    const provider = getStorageProvider();
    
    if (provider === 'chrome') {
      try {
        encryptedNotes = await chrome.storage.sync.get(null) as Record<string, string>;
      } catch (error) {
        console.error("Error getting notes from Chrome storage:", error);
        // Fallback to localStorage
        encryptedNotes = getNotesFromLocalStorage();
      }
    } else {
      // Fallback to localStorage
      encryptedNotes = getNotesFromLocalStorage();
    }
    
    // Decrypt all notes
    const notes: Record<string, string> = {};
    for (const [noteId, encryptedContent] of Object.entries(encryptedNotes)) {
      try {
        notes[noteId] = await decryptContent(encryptedContent);
      } catch (e) {
        console.error(`Error decrypting note ${noteId}:`, e);
        
        // Try to get plaintext version as fallback
        const plainKey = `${STORAGE_PREFIX}${noteId}${PLAIN_SUFFIX}`;
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
 * Helper to get notes from localStorage
 */
const getNotesFromLocalStorage = (): Record<string, string> => {
  const notes: Record<string, string> = {};
  
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith(STORAGE_PREFIX) && !key.endsWith(PLAIN_SUFFIX)) {
      const noteId = key.replace(STORAGE_PREFIX, '');
      const content = localStorage.getItem(key) || '';
      notes[noteId] = content;
    }
  });
  
  return notes;
};

/**
 * Delete a note from storage
 */
export const deleteNote = async (noteId: string): Promise<StorageOperationResult> => {
  const provider = getStorageProvider();
  
  try {
    if (provider === 'chrome') {
      try {
        await chrome.storage.sync.remove(noteId);
        // Also remove any local fallbacks
        removeLocalFallbacks(noteId);
        return { success: true };
      } catch (error) {
        console.error("Error deleting note from Chrome storage:", error);
        // Fallback to localStorage deletion
        removeLocalFallbacks(noteId);
        return { success: true };
      }
    } else {
      // Use localStorage
      removeLocalFallbacks(noteId);
      return { success: true };
    }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error deleting note' 
    };
  }
};

/**
 * Helper to remove local fallbacks
 */
const removeLocalFallbacks = (noteId: string): void => {
  localStorage.removeItem(`${STORAGE_PREFIX}${noteId}`);
  localStorage.removeItem(`${STORAGE_PREFIX}${noteId}${PLAIN_SUFFIX}`);
};

/**
 * Share note to an external service
 */
export const shareNote = async (
  content: string, 
  service: 'onedrive' | 'googledrive' | 'device'
): Promise<StorageOperationResult> => {
  try {
    if (service === 'onedrive') {
      // Normally we would use OneDrive SDK or API here
      openExternalUrl('https://onedrive.live.com/');
    } 
    else if (service === 'googledrive') {
      // Normally we would use Google Drive API here
      openExternalUrl('https://drive.google.com/');
    }
    else if (service === 'device') {
      // Use Web Share API if available
      if (navigator.share) {
        await navigator.share({
          title: 'My NoteFlow Note',
          text: content,
        });
        return { success: true };
      }
      
      // Create download link as fallback
      downloadAsFile(content);
    }
    return { success: true };
  } catch (error) {
    console.error("Error sharing note:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error sharing note' 
    };
  }
};

/**
 * Helper to open external URL
 */
const openExternalUrl = (url: string): void => {
  if (typeof chrome !== 'undefined' && chrome.tabs) {
    chrome.tabs.create({ url });
  } else {
    window.open(url, '_blank');
  }
};

/**
 * Helper to download content as a file
 */
const downloadAsFile = (content: string): void => {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'noteflow-note.txt';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
