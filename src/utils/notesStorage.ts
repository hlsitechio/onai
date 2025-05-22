
// Helper functions to work with Chrome Storage
import { encryptContent, decryptContent } from './encryptionUtils';

// Types
export type StorageProviderType = 'chrome' | 'local';
export interface StorageOperationResult {
  success: boolean;
  error?: string;
}

// Constants
const STORAGE_PREFIX = 'noteflow-';
const PLAIN_SUFFIX = '-plain';
const SYSTEM_KEYS = ['noteflow-encryption-key']; // List of system keys to be filtered out

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
      // Skip system keys like the encryption key
      if (SYSTEM_KEYS.includes(noteId)) {
        continue;
      }

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
    // Filter out system keys
    if (SYSTEM_KEYS.includes(key)) {
      return;
    }
    
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
 * Share note to an external service or generate a shareable link
 */
export const shareNote = async (
  content: string, 
  service: 'onedrive' | 'googledrive' | 'device' | 'link'
): Promise<StorageOperationResult & { shareUrl?: string }> => {
  try {
    // Generate a simple hash for the content to use as an identifier
    const generateSimpleHash = (text: string) => {
      let hash = 0;
      for (let i = 0; i < text.length; i++) {
        const char = text.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
      }
      // Convert to positive hex string and add timestamp for uniqueness
      return Math.abs(hash).toString(16) + Date.now().toString(16);
    };

    // Handle direct share options
    if (service === 'device') {
      // Use Web Share API if available
      if (navigator.share) {
        await navigator.share({
          title: 'My OneAI Note',
          text: content,
        });
        return { success: true };
      }
      
      // If Web Share API not available, create a shareable link instead
      service = 'link';
    }
    
    if (service === 'link') {
      // Generate a unique hash for this content
      const contentHash = generateSimpleHash(content);
      
      // Store the content in localStorage with the hash as a key
      // This allows retrieval of shared notes via URL params
      localStorage.setItem(`share-${contentHash}`, content);
      
      // Create a shareable URL with the hash as a parameter
      const shareUrl = `${window.location.origin}${window.location.pathname}?note=${contentHash}`;
      
      // Return success with the share URL
      return { 
        success: true,
        shareUrl
      };
    }

    // Fallback for other services (not currently implemented)
    if (service === 'onedrive' || service === 'googledrive') {
      return { 
        success: false, 
        error: 'External sharing services are not currently supported'
      };
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
