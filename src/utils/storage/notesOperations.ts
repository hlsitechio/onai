
import { encryptContent, decryptContent } from '../encryptionUtils';
import { 
  getStorageProvider, 
  saveToChrome, 
  saveToLocal, 
  getNotesFromLocalStorage, 
  removeLocalFallbacks 
} from './storageProvider';
import {
  saveNoteToIndexedDB,
  getAllNotesFromIndexedDB,
  deleteNoteFromIndexedDB,
  migrateFromLocalStorage,
  getNoteById
} from './indexedDBStorage';

export interface StorageOperationResult {
  success: boolean;
  error?: string;
  shareUrl?: string;
  newNoteId?: string;
}

const SYSTEM_KEYS = ['noteflow-encryption-key'];

/**
 * Save a note to storage with encryption using new format
 */
/**
 * Initialize the storage system, migrating data from older storage methods if needed
 */
export const initializeStorage = async (): Promise<void> => {
  try {
    // Check if we need to migrate from localStorage to IndexedDB
    const hasLocalStorageNotes = Object.keys(localStorage).some(key => key.startsWith('noteflow-'));
    
    if (hasLocalStorageNotes) {
      await migrateFromLocalStorage();
      console.log('Successfully migrated notes from localStorage to IndexedDB');
    }
  } catch (error) {
    console.error('Error initializing storage:', error);
  }
};

/**
 * Save a note to storage with encryption using new format
 * Prioritizes IndexedDB storage with fallbacks to Chrome and localStorage
 */
export const saveNote = async (noteId: string, content: string): Promise<StorageOperationResult> => {
  try {
    // Only encrypt if content is substantial
    let finalContent = content;
    let isEncrypted = false;
    
    if (content.trim() && content.length >= 10) {
      try {
        finalContent = await encryptContent(content);
        isEncrypted = true;
      } catch (encryptError) {
        console.warn("Encryption failed, saving as plain text:", encryptError);
        finalContent = content;
        isEncrypted = false;
      }
    }
    
    // First try to save to IndexedDB (primary storage)
    try {
      // Generate a title from the content (first line or first few words)
      const title = content
        .split('\n')[0]
        .substring(0, 50)
        .trim() || 'Untitled Note';
      
      const result = await saveNoteToIndexedDB(noteId, content, isEncrypted, title);
      if (result.success) {
        return result;
      }
    } catch (indexedDBError) {
      console.warn("IndexedDB storage failed, falling back to other storage:", indexedDBError);
    }
    
    // Fall back to Chrome/localStorage if IndexedDB fails
    const provider = getStorageProvider();
    
    if (provider === 'chrome') {
      const result = await saveToChrome(noteId, finalContent);
      if (!result.success) {
        // Fallback to localStorage if Chrome API fails
        console.warn("Chrome storage failed, falling back to localStorage:", result.error);
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
 * Get all saved notes from storage with proper decryption and error handling
 */
export const getAllNotes = async (): Promise<Record<string, string>> => {
  try {
    // First try IndexedDB (primary storage)
    try {
      const indexedDBNotes = await getAllNotesFromIndexedDB();
      if (Object.keys(indexedDBNotes).length > 0) {
        return indexedDBNotes;
      }
    } catch (indexedDBError) {
      console.warn("Error getting notes from IndexedDB, falling back to other storage:", indexedDBError);
    }
    
    // Fall back to Chrome/localStorage if IndexedDB fails or has no notes
    let encryptedNotes: Record<string, string> = {};
    const provider = getStorageProvider();
    
    if (provider === 'chrome') {
      try {
        encryptedNotes = await chrome.storage.sync.get(null) as Record<string, string>;
      } catch (error) {
        console.warn("Error getting notes from Chrome storage, using localStorage:", error);
        encryptedNotes = getNotesFromLocalStorage();
      }
    } else {
      encryptedNotes = getNotesFromLocalStorage();
    }
    
    // Decrypt all notes using the new format with better error handling
    const notes: Record<string, string> = {};
    for (const [noteId, encryptedContent] of Object.entries(encryptedNotes)) {
      // Skip system keys
      if (SYSTEM_KEYS.includes(noteId)) {
        continue;
      }

      try {
        const decryptedContent = await decryptContent(encryptedContent);
        // Only include notes with valid content
        if (decryptedContent && typeof decryptedContent === 'string' && decryptedContent.trim()) {
          notes[noteId] = decryptedContent;
        }
      } catch (decryptError) {
        // For decryption errors, include the note with a clear error message
        console.warn(`Could not decrypt note ${noteId}, treating as plain text`);
        if (encryptedContent && typeof encryptedContent === 'string') {
          notes[noteId] = encryptedContent;
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
 * Delete a note from storage
 */
export const deleteNote = async (noteId: string): Promise<StorageOperationResult> => {
  try {
    // First try to delete from IndexedDB (primary storage)
    try {
      const result = await deleteNoteFromIndexedDB(noteId);
      if (result.success) {
        // For consistency, also remove from fallback storage
        const provider = getStorageProvider();
        if (provider === 'chrome') {
          try {
            await chrome.storage.sync.remove(noteId);
          } catch (error) {
            console.warn("Error deleting note from Chrome storage:", error);
          }
        }
        removeLocalFallbacks(noteId);
        return result;
      }
    } catch (indexedDBError) {
      console.warn("Error deleting note from IndexedDB, falling back to other storage:", indexedDBError);
    }
    
    // Fall back to Chrome/localStorage if IndexedDB fails
    const provider = getStorageProvider();
    
    if (provider === 'chrome') {
      try {
        await chrome.storage.sync.remove(noteId);
      } catch (error) {
        console.warn("Error deleting note from Chrome storage:", error);
      }
      // Always clean up local fallbacks
      removeLocalFallbacks(noteId);
      return { success: true };
    } else {
      removeLocalFallbacks(noteId);
      return { success: true };
    }
  } catch (error) {
    console.error("Error deleting note:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error deleting note' 
    };
  }
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
      console.warn("Failed to delete old note after rename:", deleteResult.error);
      // Don't fail the operation if delete fails
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
 * Clear all notes from storage (for cleanup operations)
 */
export const clearAllNotes = async (): Promise<StorageOperationResult> => {
  try {
    // Clear IndexedDB notes (primary storage)
    try {
      // Open a connection to IndexedDB
      const dbRequest = indexedDB.open('oneai-notes', 1);
      
      dbRequest.onsuccess = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Create a transaction to clear the notes store
        const transaction = db.transaction(['notes'], 'readwrite');
        const notesStore = transaction.objectStore('notes');
        notesStore.clear();
        
        db.close();
      };
    } catch (indexedDBError) {
      console.warn("Error clearing IndexedDB storage:", indexedDBError);
    }
    
    // Clear Chrome storage
    const provider = getStorageProvider();
    if (provider === 'chrome') {
      try {
        // Get all notes and remove them
        const allData = await chrome.storage.sync.get(null);
        const noteKeys = Object.keys(allData).filter(key => !SYSTEM_KEYS.includes(key));
        if (noteKeys.length > 0) {
          await chrome.storage.sync.remove(noteKeys);
        }
      } catch (error) {
        console.warn("Error clearing Chrome storage:", error);
      }
    }
    
    // Clear localStorage notes
    const noteflowKeys = Object.keys(localStorage).filter(key => 
      key.startsWith('noteflow-') && !SYSTEM_KEYS.some(sysKey => key.includes(sysKey))
    );
    
    noteflowKeys.forEach(key => localStorage.removeItem(key));
    
    return { success: true };
  } catch (error) {
    console.error("Error clearing all notes:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error clearing notes' 
    };
  }
};
