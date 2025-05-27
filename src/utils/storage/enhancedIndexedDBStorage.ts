/**
 * Enhanced IndexedDB Storage Provider for OneAI
 * 
 * Features:
 * - Robust error handling and recovery
 * - Data integrity validation
 * - Enhanced security with encryption
 * - Improved performance with bulk operations
 * - Structured schema versioning
 * - Transaction management
 */

import { ErrorCode, ErrorSeverity, createError, logError, safeExecute, StructuredError } from '../errorHandling';
import { createContentHash, decryptNote, encryptNote, verifyContentIntegrity } from '../security/enhancedEncryption';

// IndexedDB configuration
const DB_NAME = 'oneai-notes-db';
const DB_VERSION = 1;
const NOTES_STORE = 'notes';
const METADATA_STORE = 'metadata';
const SYNC_STORE = 'sync';

// Interface for note object
export interface Note {
  id: string;
  content: string;
  contentHash: string;
  encrypted: boolean;
  lastModified: number;
  createdAt: number;
}

// Interface for note metadata
export interface NoteMetadata {
  id: string;
  title: string;
  tags: string[];
  excerpt: string;
  lastModified: number;
  wordCount: number;
  charCount: number;
}

// Interface for sync record
interface SyncRecord {
  id: string;
  operation: 'create' | 'update' | 'delete';
  timestamp: number;
  synced: boolean;
  retryCount: number;
}

// Result of storage operations
export interface StorageOperationResult {
  success: boolean;
  error?: string | StructuredError; // Support both string and StructuredError types
  data?: unknown; // Use unknown instead of any for better type safety
}

/**
 * Opens and initializes the IndexedDB database with appropriate schema
 */
const openDatabase = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    // Create or upgrade database schema
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      // Create object stores if they don't exist
      if (!db.objectStoreNames.contains(NOTES_STORE)) {
        const notesStore = db.createObjectStore(NOTES_STORE, { keyPath: 'id' });
        notesStore.createIndex('by_modified', 'lastModified', { unique: false });
        notesStore.createIndex('by_created', 'createdAt', { unique: false });
      }
      
      if (!db.objectStoreNames.contains(METADATA_STORE)) {
        const metadataStore = db.createObjectStore(METADATA_STORE, { keyPath: 'id' });
        metadataStore.createIndex('by_modified', 'lastModified', { unique: false });
        metadataStore.createIndex('by_title', 'title', { unique: false });
      }
      
      if (!db.objectStoreNames.contains(SYNC_STORE)) {
        const syncStore = db.createObjectStore(SYNC_STORE, { keyPath: 'id' });
        syncStore.createIndex('by_timestamp', 'timestamp', { unique: false });
        syncStore.createIndex('by_synced', 'synced', { unique: false });
      }
    };
    
    // Handle success
    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      resolve(db);
    };
    
    // Handle errors
    request.onerror = (event) => {
      const error = createError(
        ErrorCode.STORAGE_UNAVAILABLE,
        `Failed to open IndexedDB: ${(event.target as IDBOpenDBRequest).error?.message || 'Unknown error'}`,
        ErrorSeverity.ERROR
      );
      logError(error);
      reject(error);
    };
  });
};

/**
 * Enhanced IndexedDB Storage Provider with error handling and security
 */
export class EnhancedIndexedDBStorage {
  private db: IDBDatabase | null = null;
  private dbReady: Promise<IDBDatabase>;
  private encryptionEnabled: boolean;
  
  constructor(encryptionEnabled: boolean = false) {
    this.encryptionEnabled = encryptionEnabled;
    this.dbReady = this.initializeDatabase();
  }
  
  /**
   * Initializes the database connection
   */
  private async initializeDatabase(): Promise<IDBDatabase> {
    try {
      const db = await openDatabase();
      this.db = db;
      return db;
    } catch (error) {
      const errorObj = createError(
        ErrorCode.STORAGE_UNAVAILABLE,
        `Failed to initialize IndexedDB: ${error instanceof Error ? error.message : 'Unknown error'}`,
        ErrorSeverity.ERROR
      );
      logError(errorObj);
      throw errorObj;
    }
  }
  
  /**
   * Safely executes a database transaction with error handling
   */
  private async executeTransaction<T>(
    storeName: string,
    mode: IDBTransactionMode,
    operation: (store: IDBObjectStore) => Promise<T>
  ): Promise<T> {
    const db = await this.dbReady;
    
    return new Promise<T>((resolve, reject) => {
      try {
        const transaction = db.transaction(storeName, mode);
        const store = transaction.objectStore(storeName);
        
        transaction.onerror = (event) => {
          const error = createError(
            ErrorCode.STORAGE_WRITE_ERROR,
            `Transaction error: ${(event.target as IDBTransaction).error?.message || 'Unknown error'}`,
            ErrorSeverity.ERROR
          );
          logError(error);
          reject(error);
        };
        
        transaction.onabort = (event) => {
          const error = createError(
            ErrorCode.STORAGE_WRITE_ERROR,
            `Transaction aborted: ${(event.target as IDBTransaction).error?.message || 'Unknown error'}`,
            ErrorSeverity.ERROR
          );
          logError(error);
          reject(error);
        };
        
        // Execute the operation
        operation(store)
          .then(resolve)
          .catch(reject);
      } catch (error) {
        const errorObj = createError(
          ErrorCode.STORAGE_WRITE_ERROR,
          `Failed to execute transaction: ${error instanceof Error ? error.message : 'Unknown error'}`,
          ErrorSeverity.ERROR
        );
        logError(errorObj);
        reject(errorObj);
      }
    });
  }
  
  /**
   * Creates or updates a note
   */
  public async saveNote(
    id: string,
    content: string,
    title?: string
  ): Promise<StorageOperationResult> {
    return safeExecute(
      async () => {
        // Prepare note data
        const now = Date.now();
        const contentHash = createContentHash(content);
        
        // Extract title from content if not provided
        const derivedTitle = title || content.split('\n')[0].replace(/^#+ /, '').substring(0, 50) || 'Untitled Note';
        
        // Calculate word and character counts
        const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
        const charCount = content.length;
        
        // Extract a short excerpt for preview
        const excerpt = content.substring(0, 150).replace(/\n/g, ' ');
        
        let noteContent = content;
        let encrypted = false;
        
        // Encrypt the content if enabled
        if (this.encryptionEnabled) {
          const { encryptedData } = await encryptNote(content);
          noteContent = encryptedData;
          encrypted = true;
        }
        
        // Get existing note if it exists
        let existingNote: Note | undefined;
        try {
          existingNote = await this.getNote(id);
        } catch (error) {
          // Ignore if note doesn't exist
        }
        
        // Create note object
        const note: Note = {
          id,
          content: noteContent,
          contentHash,
          encrypted,
          lastModified: now,
          createdAt: existingNote?.createdAt || now
        };
        
        // Create metadata object
        const metadata: NoteMetadata = {
          id,
          title: derivedTitle,
          tags: [],
          excerpt,
          lastModified: now,
          wordCount,
          charCount
        };
        
        // Create sync record
        const syncRecord: SyncRecord = {
          id,
          operation: existingNote ? 'update' : 'create',
          timestamp: now,
          synced: false,
          retryCount: 0
        };
        
        // Save note, metadata, and sync record in parallel
        await Promise.all([
          this.executeTransaction(NOTES_STORE, 'readwrite', async (store) => {
            return new Promise<void>((resolve, reject) => {
              const request = store.put(note);
              request.onsuccess = () => resolve();
              request.onerror = () => reject(request.error);
            });
          }),
          
          this.executeTransaction(METADATA_STORE, 'readwrite', async (store) => {
            return new Promise<void>((resolve, reject) => {
              const request = store.put(metadata);
              request.onsuccess = () => resolve();
              request.onerror = () => reject(request.error);
            });
          }),
          
          this.executeTransaction(SYNC_STORE, 'readwrite', async (store) => {
            return new Promise<void>((resolve, reject) => {
              const request = store.put(syncRecord);
              request.onsuccess = () => resolve();
              request.onerror = () => reject(request.error);
            });
          })
        ]);
        
        return {
          success: true,
          data: { id, lastModified: now }
        };
      },
      ErrorCode.STORAGE_WRITE_ERROR,
      `Failed to save note with ID: ${id}`,
      ErrorSeverity.ERROR
    );
  }
  
  /**
   * Retrieves a note by ID
   */
  public async getNote(id: string): Promise<Note> {
    const result = await safeExecute(
      async () => {
        return this.executeTransaction(NOTES_STORE, 'readonly', async (store) => {
          return new Promise<Note>((resolve, reject) => {
            const request = store.get(id);
            
            request.onsuccess = () => {
              const note = request.result as Note;
              if (!note) {
                reject(new Error(`Note with ID ${id} not found`));
                return;
              }
              resolve(note);
            };
            
            request.onerror = () => reject(request.error);
          });
        });
      },
      ErrorCode.STORAGE_READ_ERROR,
      `Failed to retrieve note with ID: ${id}`,
      ErrorSeverity.ERROR
    );
    
    if (!result.success || !result.data) {
      // Handle both string and StructuredError types
      const errorMessage = typeof result.error === 'string' 
        ? result.error 
        : result.error?.message || 'Failed to retrieve note';
      throw new Error(errorMessage);
    }
    
    return result.data;
  }
  
  /**
   * Gets a note's content, decrypting if necessary
   */
  public async getNoteContent(id: string): Promise<string> {
    const result = await safeExecute(
      async () => {
        const note = await this.getNote(id);
        
        // If the note is encrypted, decrypt it
        if (note.encrypted) {
          // For demo purposes, we're using a fixed password
          // In a real app, you would need to handle password management
          const defaultPassword = 'oneai-secure-password';
          const { content } = await decryptNote(note.content, defaultPassword);
          
          // Verify content integrity
          if (!verifyContentIntegrity(content, note.contentHash)) {
            throw new Error('Content integrity check failed. The note may have been tampered with.');
          }
          
          return content;
        }
        
        // For unencrypted notes, verify integrity directly
        if (!verifyContentIntegrity(note.content, note.contentHash)) {
          throw new Error('Content integrity check failed. The note may have been tampered with.');
        }
        
        return note.content;
      },
      ErrorCode.STORAGE_READ_ERROR,
      `Failed to retrieve note content for ID: ${id}`,
      ErrorSeverity.ERROR
    );
    
    if (!result.success || !result.data) {
      // Handle both string and StructuredError types
      const errorMessage = typeof result.error === 'string' 
        ? result.error 
        : result.error?.message || 'Failed to retrieve note content';
      throw new Error(errorMessage);
    }
    
    return result.data;
  }
  
  /**
   * Gets metadata for a note
   */
  public async getNoteMetadata(id: string): Promise<NoteMetadata> {
    const result = await safeExecute(
      async () => {
        return this.executeTransaction(METADATA_STORE, 'readonly', async (store) => {
          return new Promise<NoteMetadata>((resolve, reject) => {
            const request = store.get(id);
            
            request.onsuccess = () => {
              const metadata = request.result as NoteMetadata;
              if (!metadata) {
                reject(new Error(`Metadata for note with ID ${id} not found`));
                return;
              }
              resolve(metadata);
            };
            
            request.onerror = () => reject(request.error);
          });
        });
      },
      ErrorCode.STORAGE_READ_ERROR,
      `Failed to retrieve metadata for note with ID: ${id}`,
      ErrorSeverity.ERROR
    );
    
    if (!result.success || !result.data) {
      // Handle both string and StructuredError types
      const errorMessage = typeof result.error === 'string' 
        ? result.error 
        : result.error?.message || 'Failed to retrieve note metadata';
      throw new Error(errorMessage);
    }
    
    return result.data;
  }
  
  /**
   * Deletes a note and its metadata
   */
  public async deleteNote(id: string): Promise<StorageOperationResult> {
    return safeExecute(
      async () => {
        const now = Date.now();
        
        // Create sync record for deletion
        const syncRecord: SyncRecord = {
          id,
          operation: 'delete',
          timestamp: now,
          synced: false,
          retryCount: 0
        };
        
        // Delete note, metadata, and add sync record in parallel
        await Promise.all([
          this.executeTransaction(NOTES_STORE, 'readwrite', async (store) => {
            return new Promise<void>((resolve, reject) => {
              const request = store.delete(id);
              request.onsuccess = () => resolve();
              request.onerror = () => reject(request.error);
            });
          }),
          
          this.executeTransaction(METADATA_STORE, 'readwrite', async (store) => {
            return new Promise<void>((resolve, reject) => {
              const request = store.delete(id);
              request.onsuccess = () => resolve();
              request.onerror = () => reject(request.error);
            });
          }),
          
          this.executeTransaction(SYNC_STORE, 'readwrite', async (store) => {
            return new Promise<void>((resolve, reject) => {
              const request = store.put(syncRecord);
              request.onsuccess = () => resolve();
              request.onerror = () => reject(request.error);
            });
          })
        ]);
        
        return { success: true };
      },
      ErrorCode.STORAGE_WRITE_ERROR,
      `Failed to delete note with ID: ${id}`,
      ErrorSeverity.ERROR
    );
  }
  
  /**
   * Gets all notes with their metadata
   */
  public async getAllNotes(): Promise<Record<string, string>> {
    const result = await safeExecute(
      async () => {
        // Get all metadata first (this is faster than getting all notes)
        const metadata = await this.executeTransaction(METADATA_STORE, 'readonly', async (store) => {
          return new Promise<NoteMetadata[]>((resolve, reject) => {
            const request = store.index('by_modified').openCursor(null, 'prev');
            const results: NoteMetadata[] = [];
            
            request.onsuccess = (event) => {
              const cursor = (event.target as IDBRequest).result as IDBCursorWithValue;
              if (cursor) {
                results.push(cursor.value);
                cursor.continue();
              } else {
                resolve(results);
              }
            };
            
            request.onerror = () => reject(request.error);
          });
        });
        
        // Get all note contents (potentially slower due to decryption)
        const notesMap: Record<string, string> = {};
        
        for (const meta of metadata) {
          try {
            const content = await this.getNoteContent(meta.id);
            notesMap[meta.id] = content;
          } catch (error) {
            console.error(`Failed to retrieve content for note ${meta.id}:`, error);
            // Continue with other notes even if one fails
          }
        }
        
        return notesMap;
      },
      ErrorCode.STORAGE_READ_ERROR,
      'Failed to retrieve all notes',
      ErrorSeverity.ERROR
    );
    
    if (!result.success || !result.data) {
      // Handle both string and StructuredError types
      const errorMessage = typeof result.error === 'string' 
        ? result.error 
        : result.error?.message || 'Failed to retrieve all notes';
      throw new Error(errorMessage);
    }
    
    return result.data;
  }
  
  /**
   * Gets all note metadata
   */
  public async getAllNoteMetadata(): Promise<NoteMetadata[]> {
    const result = await safeExecute(
      async () => {
        return this.executeTransaction(METADATA_STORE, 'readonly', async (store) => {
          return new Promise<NoteMetadata[]>((resolve, reject) => {
            const request = store.index('by_modified').openCursor(null, 'prev');
            const results: NoteMetadata[] = [];
            
            request.onsuccess = (event) => {
              const cursor = (event.target as IDBRequest).result as IDBCursorWithValue;
              if (cursor) {
                results.push(cursor.value);
                cursor.continue();
              } else {
                resolve(results);
              }
            };
            
            request.onerror = () => reject(request.error);
          });
        });
      },
      ErrorCode.STORAGE_READ_ERROR,
      'Failed to retrieve all note metadata',
      ErrorSeverity.ERROR
    );
    
    if (!result.success || !result.data) {
      // Handle both string and StructuredError types
      const errorMessage = typeof result.error === 'string' 
        ? result.error 
        : result.error?.message || 'Failed to retrieve all note metadata';
      throw new Error(errorMessage);
    }
    
    return result.data;
  }
  
  /**
   * Gets all pending sync operations
   */
  public async getPendingSyncOperations(): Promise<SyncRecord[]> {
    const result = await safeExecute(
      async () => {
        return this.executeTransaction(SYNC_STORE, 'readonly', async (store) => {
          return new Promise<SyncRecord[]>((resolve, reject) => {
            const request = store.index('by_synced').openCursor(IDBKeyRange.only(false));
            const results: SyncRecord[] = [];
            
            request.onsuccess = (event) => {
              const cursor = (event.target as IDBRequest).result as IDBCursorWithValue;
              if (cursor) {
                results.push(cursor.value);
                cursor.continue();
              } else {
                resolve(results);
              }
            };
            
            request.onerror = () => reject(request.error);
          });
        });
      },
      ErrorCode.STORAGE_READ_ERROR,
      'Failed to retrieve pending sync operations',
      ErrorSeverity.ERROR
    );
    
    if (!result.success || !result.data) {
      // Handle both string and StructuredError types
      const errorMessage = typeof result.error === 'string' 
        ? result.error 
        : result.error?.message || 'Failed to retrieve pending sync operations';
      throw new Error(errorMessage);
    }
    
    return result.data;
  }
  
  /**
   * Marks a sync operation as complete
   */
  public async markSyncComplete(id: string): Promise<StorageOperationResult> {
    return safeExecute(
      async () => {
        await this.executeTransaction(SYNC_STORE, 'readwrite', async (store) => {
          return new Promise<void>((resolve, reject) => {
            const getRequest = store.get(id);
            
            getRequest.onsuccess = () => {
              const syncRecord = getRequest.result as SyncRecord;
              if (!syncRecord) {
                resolve(); // No record to update
                return;
              }
              
              syncRecord.synced = true;
              const updateRequest = store.put(syncRecord);
              updateRequest.onsuccess = () => resolve();
              updateRequest.onerror = () => reject(updateRequest.error);
            };
            
            getRequest.onerror = () => reject(getRequest.error);
          });
        });
        
        return { success: true };
      },
      ErrorCode.STORAGE_WRITE_ERROR,
      `Failed to mark sync complete for operation with ID: ${id}`,
      ErrorSeverity.ERROR
    );
  }
  
  /**
   * Imports notes in bulk
   */
  public async importNotes(
    notes: Record<string, string>
  ): Promise<StorageOperationResult> {
    return safeExecute(
      async () => {
        let importCount = 0;
        const now = Date.now();
        
        for (const [id, content] of Object.entries(notes)) {
          if (!content) continue;
          
          try {
            // Use the saveNote method to properly handle each note
            await this.saveNote(id, content);
            importCount++;
          } catch (error) {
            console.error(`Failed to import note with ID ${id}:`, error);
            // Continue with other notes even if one fails
          }
        }
        
        return {
          success: true,
          data: { importCount }
        };
      },
      ErrorCode.STORAGE_WRITE_ERROR,
      'Failed to import notes',
      ErrorSeverity.ERROR
    );
  }
  
  /**
   * Searches notes by content or title
   */
  public async searchNotes(query: string): Promise<NoteMetadata[]> {
    const result = await safeExecute(
      async () => {
        // First get all metadata
        const allMetadata = await this.getAllNoteMetadata();
        
        // Filter by query
        const normalizedQuery = query.toLowerCase();
        
        const matchingMetadata = allMetadata.filter(metadata => 
          metadata.title.toLowerCase().includes(normalizedQuery) ||
          metadata.excerpt.toLowerCase().includes(normalizedQuery)
        );
        
        return matchingMetadata;
      },
      ErrorCode.STORAGE_READ_ERROR,
      `Failed to search notes for query: ${query}`,
      ErrorSeverity.ERROR
    );
    
    if (!result.success || !result.data) {
      // Handle both string and StructuredError types
      const errorMessage = typeof result.error === 'string' 
        ? result.error 
        : result.error?.message || 'Failed to search notes';
      throw new Error(errorMessage);
    }
    
    return result.data;
  }
  
  /**
   * Closes the database connection
   */
  public close(): void {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }
}

// Create a singleton instance
export const enhancedIndexedDBStorage = new EnhancedIndexedDBStorage(false);
