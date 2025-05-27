import { v4 as uuidv4 } from 'uuid';
import { StorageOperationResult } from './notesOperations';

// Constants
const DB_NAME = 'oneai-notes';
const DB_VERSION = 1;
const NOTES_STORE = 'notes';
const SYNC_STORE = 'sync_metadata';

export interface NoteRecord {
  id: string;
  content: string;
  title: string;
  created_at: string;
  updated_at: string;
  is_encrypted: boolean;
  is_synced: boolean;
  sync_hash?: string; // Hash for conflict detection
}

export interface SyncMetadata {
  last_sync: string;
  device_id: string;
}

/**
 * Initialize the IndexedDB database
 */
export const initIndexedDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      reject(new Error("Your browser doesn't support IndexedDB"));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => {
      console.error("IndexedDB error:", event);
      reject(new Error("Failed to open IndexedDB"));
    };

    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      // Create notes store
      if (!db.objectStoreNames.contains(NOTES_STORE)) {
        const notesStore = db.createObjectStore(NOTES_STORE, { keyPath: 'id' });
        notesStore.createIndex('by_updated', 'updated_at', { unique: false });
        notesStore.createIndex('by_sync_status', 'is_synced', { unique: false });
      }
      
      // Create sync metadata store
      if (!db.objectStoreNames.contains(SYNC_STORE)) {
        const syncStore = db.createObjectStore(SYNC_STORE, { keyPath: 'device_id' });
        syncStore.createIndex('by_last_sync', 'last_sync', { unique: false });
      }
    };
  });
};

/**
 * Get a reference to the database
 */
export const getDB = async (): Promise<IDBDatabase> => {
  try {
    return await initIndexedDB();
  } catch (error) {
    console.error("Error getting IndexedDB:", error);
    throw error;
  }
};

/**
 * Save a note to IndexedDB
 */
export const saveNoteToIndexedDB = async (
  noteId: string,
  content: string,
  isEncrypted: boolean = false,
  title?: string
): Promise<StorageOperationResult> => {
  try {
    const db = await getDB();
    
    // Generate title from content if not provided
    const noteTitle = title || content
      .split('\n')[0]
      .substring(0, 50)
      .trim() || 'Untitled Note';
    
    // Get current timestamp
    const now = new Date().toISOString();
    
    // Check if note exists to determine created_at date
    const existingNote = await getNoteById(noteId);
    
    const noteRecord: NoteRecord = {
      id: noteId,
      content,
      title: noteTitle,
      created_at: existingNote ? existingNote.created_at : now,
      updated_at: now,
      is_encrypted: isEncrypted,
      is_synced: false,
      sync_hash: generateContentHash(content)
    };
    
    return new Promise((resolve) => {
      const transaction = db.transaction([NOTES_STORE], 'readwrite');
      
      transaction.oncomplete = () => {
        resolve({ success: true });
      };
      
      transaction.onerror = (event) => {
        console.error("Transaction error:", event);
        resolve({ 
          success: false, 
          error: 'Error saving note to IndexedDB' 
        });
      };
      
      const notesStore = transaction.objectStore(NOTES_STORE);
      notesStore.put(noteRecord);
    });
    
  } catch (error) {
    console.error("Error saving note to IndexedDB:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error saving to IndexedDB'
    };
  }
};

/**
 * Get a single note by ID
 */
export const getNoteById = async (noteId: string): Promise<NoteRecord | null> => {
  try {
    const db = await getDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([NOTES_STORE], 'readonly');
      const notesStore = transaction.objectStore(NOTES_STORE);
      const request = notesStore.get(noteId);
      
      request.onsuccess = () => {
        resolve(request.result || null);
      };
      
      request.onerror = (event) => {
        console.error("Error getting note:", event);
        reject(new Error('Failed to get note'));
      };
    });
    
  } catch (error) {
    console.error("Error getting note from IndexedDB:", error);
    return null;
  }
};

/**
 * Get all notes from IndexedDB
 */
export const getAllNotesFromIndexedDB = async (): Promise<Record<string, string>> => {
  try {
    const db = await getDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([NOTES_STORE], 'readonly');
      const notesStore = transaction.objectStore(NOTES_STORE);
      const index = notesStore.index('by_updated');
      const request = index.openCursor(null, 'prev'); // Sort by updated_at descending
      
      const notes: Record<string, string> = {};
      
      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        
        if (cursor) {
          const note = cursor.value as NoteRecord;
          notes[note.id] = note.content;
          cursor.continue();
        } else {
          resolve(notes);
        }
      };
      
      request.onerror = (event) => {
        console.error("Error getting notes:", event);
        reject(new Error('Failed to get notes'));
      };
    });
    
  } catch (error) {
    console.error("Error getting notes from IndexedDB:", error);
    return {};
  }
};

/**
 * Delete a note from IndexedDB
 */
export const deleteNoteFromIndexedDB = async (noteId: string): Promise<StorageOperationResult> => {
  try {
    const db = await getDB();
    
    return new Promise((resolve) => {
      const transaction = db.transaction([NOTES_STORE], 'readwrite');
      
      transaction.oncomplete = () => {
        resolve({ success: true });
      };
      
      transaction.onerror = (event) => {
        console.error("Transaction error:", event);
        resolve({ 
          success: false, 
          error: 'Error deleting note from IndexedDB' 
        });
      };
      
      const notesStore = transaction.objectStore(NOTES_STORE);
      notesStore.delete(noteId);
    });
    
  } catch (error) {
    console.error("Error deleting note from IndexedDB:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error deleting from IndexedDB'
    };
  }
};

/**
 * Mark a note as synced
 */
export const markNoteAsSynced = async (noteId: string, syncHash: string): Promise<void> => {
  try {
    const db = await getDB();
    const note = await getNoteById(noteId);
    
    if (!note) return;
    
    note.is_synced = true;
    note.sync_hash = syncHash;
    
    const transaction = db.transaction([NOTES_STORE], 'readwrite');
    const notesStore = transaction.objectStore(NOTES_STORE);
    notesStore.put(note);
    
  } catch (error) {
    console.error("Error marking note as synced:", error);
  }
};

/**
 * Get all unsynced notes
 */
export const getUnsyncedNotes = async (): Promise<NoteRecord[]> => {
  try {
    const db = await getDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([NOTES_STORE], 'readonly');
      const notesStore = transaction.objectStore(NOTES_STORE);
      const index = notesStore.index('by_sync_status');
      const request = index.openCursor(IDBKeyRange.only(false));
      
      const unsyncedNotes: NoteRecord[] = [];
      
      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        
        if (cursor) {
          unsyncedNotes.push(cursor.value);
          cursor.continue();
        } else {
          resolve(unsyncedNotes);
        }
      };
      
      request.onerror = (event) => {
        console.error("Error getting unsynced notes:", event);
        reject(new Error('Failed to get unsynced notes'));
      };
    });
    
  } catch (error) {
    console.error("Error getting unsynced notes from IndexedDB:", error);
    return [];
  }
};

/**
 * Update sync metadata
 */
export const updateSyncMetadata = async (): Promise<void> => {
  try {
    const db = await getDB();
    const deviceId = getDeviceId();
    const now = new Date().toISOString();
    
    const metadata: SyncMetadata = {
      device_id: deviceId,
      last_sync: now
    };
    
    const transaction = db.transaction([SYNC_STORE], 'readwrite');
    const syncStore = transaction.objectStore(SYNC_STORE);
    syncStore.put(metadata);
    
  } catch (error) {
    console.error("Error updating sync metadata:", error);
  }
};

/**
 * Get device ID (create if doesn't exist)
 */
export const getDeviceId = (): string => {
  let deviceId = localStorage.getItem('oneai-device-id');
  
  if (!deviceId) {
    deviceId = `device-${uuidv4()}`;
    localStorage.setItem('oneai-device-id', deviceId);
  }
  
  return deviceId;
};

/**
 * Generate a hash for content to detect changes
 * This is a simple implementation - in production you might want a more robust hash function
 */
export const generateContentHash = (content: string): string => {
  let hash = 0;
  if (content.length === 0) return hash.toString();
  
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  return hash.toString(16);
};

/**
 * Migrate notes from localStorage to IndexedDB
 */
export const migrateFromLocalStorage = async (): Promise<void> => {
  try {
    const localStorageKeys = Object.keys(localStorage);
    const noteKeyPrefix = 'noteflow-';
    const noteKeys = localStorageKeys.filter(key => key.startsWith(noteKeyPrefix));
    
    if (noteKeys.length === 0) {
      console.log("No notes found in localStorage to migrate");
      return;
    }
    
    console.log(`Migrating ${noteKeys.length} notes from localStorage to IndexedDB`);
    
    for (const key of noteKeys) {
      const noteId = key.replace(noteKeyPrefix, '');
      const content = localStorage.getItem(key);
      
      if (content) {
        await saveNoteToIndexedDB(noteId, content);
      }
    }
    
    console.log("Migration from localStorage complete");
    
  } catch (error) {
    console.error("Error migrating from localStorage:", error);
  }
};
