
import { encryptContent, decryptContent } from '../encryptionUtils';
import { 
  getStorageProvider, 
  saveToChrome, 
  saveToLocal, 
  getNotesFromLocalStorage, 
  removeLocalFallbacks 
} from './storageProvider';

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
