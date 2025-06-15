
// Background Sync Management Module for OneAI Notes Service Worker

class SyncManager {
  static async syncOfflineNotes() {
    try {
      const db = await CacheManager.openOfflineDB();
      const transaction = db.transaction(['offline_notes'], 'readonly');
      const store = transaction.objectStore('offline_notes');
      const notes = await store.getAll();
      
      const unsyncedNotes = notes.filter(note => !note.synced);
      let syncCount = 0;
      
      for (const note of unsyncedNotes) {
        try {
          const response = await fetch('/api/notes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(note)
          });
          
          if (response.ok) {
            const updateTransaction = db.transaction(['offline_notes'], 'readwrite');
            const updateStore = updateTransaction.objectStore('offline_notes');
            note.synced = true;
            await updateStore.put(note);
            syncCount++;
          }
        } catch (error) {
          console.error('Failed to sync note:', error);
        }
      }
      
      // Notify clients about sync completion
      if (syncCount > 0) {
        const allClients = await clients.matchAll();
        allClients.forEach(client => {
          client.postMessage({
            type: 'SYNC_COMPLETED',
            count: syncCount
          });
        });
      }
    } catch (error) {
      console.error('Background sync failed:', error);
    }
  }

  static async handleConnectivityRestored() {
    console.log('Handling connectivity restored');
    
    // Notify all clients about connectivity restoration
    const allClients = await clients.matchAll();
    allClients.forEach(client => {
      client.postMessage({
        type: 'CONNECTIVITY_RESTORED',
        timestamp: Date.now()
      });
    });
    
    // Trigger sync
    await this.syncOfflineNotes();
  }

  static handleSyncEvent(event) {
    console.log('Background sync triggered:', event.tag);
    
    if (event.tag === 'sync-notes') {
      event.waitUntil(this.syncOfflineNotes());
    } else if (event.tag === 'connectivity-restored') {
      event.waitUntil(this.handleConnectivityRestored());
    }
  }
}

// Export sync manager
self.SyncManager = SyncManager;
