
export interface OfflineNote {
  id: string;
  content: string;
  title: string;
  timestamp: number;
  synced: boolean;
  retryCount: number;
}

export interface OfflineData {
  notes: OfflineNote[];
  preferences: any;
  lastSync: number;
}

class OfflineStorageManager {
  private dbName = 'oneai-notes-offline';
  private version = 1;
  private db: IDBDatabase | null = null;

  async initialize(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Notes store
        if (!db.objectStoreNames.contains('notes')) {
          const notesStore = db.createObjectStore('notes', { keyPath: 'id' });
          notesStore.createIndex('timestamp', 'timestamp');
          notesStore.createIndex('synced', 'synced');
        }

        // Preferences store
        if (!db.objectStoreNames.contains('preferences')) {
          db.createObjectStore('preferences', { keyPath: 'key' });
        }

        // Sync queue store
        if (!db.objectStoreNames.contains('syncQueue')) {
          const syncStore = db.createObjectStore('syncQueue', { keyPath: 'id' });
          syncStore.createIndex('priority', 'priority');
        }
      };
    });
  }

  async saveNote(note: OfflineNote): Promise<void> {
    if (!this.db) await this.initialize();
    
    const transaction = this.db!.transaction(['notes'], 'readwrite');
    const store = transaction.objectStore('notes');
    await store.put(note);
  }

  async getNotes(): Promise<OfflineNote[]> {
    if (!this.db) await this.initialize();
    
    const transaction = this.db!.transaction(['notes'], 'readonly');
    const store = transaction.objectStore('notes');
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getUnsyncedNotes(): Promise<OfflineNote[]> {
    if (!this.db) await this.initialize();
    
    const transaction = this.db!.transaction(['notes'], 'readonly');
    const store = transaction.objectStore('notes');
    const index = store.index('synced');
    
    return new Promise((resolve, reject) => {
      const request = index.getAll(false);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async markNoteSynced(noteId: string): Promise<void> {
    if (!this.db) await this.initialize();
    
    const transaction = this.db!.transaction(['notes'], 'readwrite');
    const store = transaction.objectStore('notes');
    const note = await store.get(noteId);
    
    if (note) {
      note.synced = true;
      await store.put(note);
    }
  }

  async savePreference(key: string, value: any): Promise<void> {
    if (!this.db) await this.initialize();
    
    const transaction = this.db!.transaction(['preferences'], 'readwrite');
    const store = transaction.objectStore('preferences');
    await store.put({ key, value });
  }

  async getPreference(key: string): Promise<any> {
    if (!this.db) await this.initialize();
    
    const transaction = this.db!.transaction(['preferences'], 'readonly');
    const store = transaction.objectStore('preferences');
    
    return new Promise((resolve, reject) => {
      const request = store.get(key);
      request.onsuccess = () => resolve(request.result?.value);
      request.onerror = () => reject(request.error);
    });
  }

  async clearData(): Promise<void> {
    if (!this.db) await this.initialize();
    
    const transaction = this.db!.transaction(['notes', 'preferences', 'syncQueue'], 'readwrite');
    await Promise.all([
      transaction.objectStore('notes').clear(),
      transaction.objectStore('preferences').clear(),
      transaction.objectStore('syncQueue').clear()
    ]);
  }

  async getStorageUsage(): Promise<{ used: number; quota: number }> {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate();
      return {
        used: estimate.usage || 0,
        quota: estimate.quota || 0
      };
    }
    return { used: 0, quota: 0 };
  }
}

export const offlineStorage = new OfflineStorageManager();
