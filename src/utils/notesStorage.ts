
// Helper functions to work with Chrome Storage and new encryption format
import { encryptContent, decryptContent } from './encryptionUtils';

// Types
export type StorageProviderType = 'chrome' | 'local';
export interface StorageOperationResult {
  success: boolean;
  error?: string;
  shareUrl?: string;
  newNoteId?: string;
}

// Constants
const STORAGE_PREFIX = 'noteflow-';
const SYSTEM_KEYS = ['noteflow-encryption-key'];

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
 * Save a note to storage with encryption using new format
 */
export const saveNote = async (noteId: string, content: string): Promise<StorageOperationResult> => {
  try {
    // Only encrypt if content is substantial
    let finalContent = content;
    if (content.trim() && content.length >= 10) {
      try {
        finalContent = await encryptContent(content);
      } catch (encryptError) {
        console.error("Encryption failed, saving as plain text:", encryptError);
        finalContent = content;
      }
    }
    
    const provider = getStorageProvider();
    
    // Save to appropriate storage
    if (provider === 'chrome') {
      const result = await saveToChrome(noteId, finalContent);
      if (!result.success) {
        // Fallback to localStorage if Chrome API fails
        return saveToLocal(noteId, finalContent);
      }
      return result;
    } else {
      return saveToLocal(noteId, finalContent);
    }
  } catch (error) {
    console.error("Error saving note:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error saving note' 
    };
  }
};

/**
 * Get all saved notes from storage with proper decryption
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
        encryptedNotes = getNotesFromLocalStorage();
      }
    } else {
      encryptedNotes = getNotesFromLocalStorage();
    }
    
    // Decrypt all notes using the new format
    const notes: Record<string, string> = {};
    for (const [noteId, encryptedContent] of Object.entries(encryptedNotes)) {
      // Skip system keys
      if (SYSTEM_KEYS.includes(noteId)) {
        continue;
      }

      try {
        const decryptedContent = await decryptContent(encryptedContent);
        // Only include notes with valid content
        if (decryptedContent && typeof decryptedContent === 'string') {
          notes[noteId] = decryptedContent;
        }
      } catch (decryptError) {
        console.error(`Error decrypting note ${noteId}:`, decryptError);
        // Include with error message instead of skipping
        notes[noteId] = `[Error: Could not decrypt note - ${decryptError.message}]`;
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
    if (SYSTEM_KEYS.includes(key)) {
      return;
    }
    
    if (key.startsWith(STORAGE_PREFIX)) {
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
        removeLocalFallbacks(noteId);
        return { success: true };
      } catch (error) {
        console.error("Error deleting note from Chrome storage:", error);
        removeLocalFallbacks(noteId);
        return { success: true };
      }
    } else {
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
};

/**
 * Rename a note in storage
 */
export const renameNote = async (oldNoteId: string, newNoteId: string): Promise<StorageOperationResult> => {
  try {
    const allNotes = await getAllNotes();
    
    if (!allNotes[oldNoteId]) {
      return { success: false, error: 'Note not found' };
    }
    
    if (allNotes[newNoteId]) {
      return { success: false, error: 'A note with this name already exists' };
    }
    
    const content = allNotes[oldNoteId];
    const saveResult = await saveNote(newNoteId, content);
    
    if (!saveResult.success) {
      return saveResult;
    }
    
    const deleteResult = await deleteNote(oldNoteId);
    
    if (!deleteResult.success) {
      return deleteResult;
    }
    
    return { success: true, newNoteId };
  } catch (error) {
    console.error("Error renaming note:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error renaming note' 
    };
  }
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
