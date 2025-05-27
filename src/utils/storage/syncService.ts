import { getDeviceId, getUnsyncedNotes, markNoteAsSynced, updateSyncMetadata } from './indexedDBStorage';
import { StorageOperationResult } from './notesOperations';

// Base URL for the sync server
// In production, set this to your actual server URL
const API_URL = import.meta.env.VITE_SYNC_SERVER_URL || 'http://localhost:3000';

// Optional delay between sync attempts (in milliseconds)
const SYNC_INTERVAL = 30000; // 30 seconds

// Interface for the sync status
export interface SyncStatus {
  lastSyncTime: string | null;
  isSyncing: boolean;
  syncError: string | null;
  pendingChanges: number;
}

// Initial sync status
let syncStatus: SyncStatus = {
  lastSyncTime: null,
  isSyncing: false,
  syncError: null,
  pendingChanges: 0
};

// Store sync status observers
const syncStatusObservers: ((status: SyncStatus) => void)[] = [];

// Update sync status and notify observers
const updateSyncStatus = (newStatus: Partial<SyncStatus>) => {
  syncStatus = { ...syncStatus, ...newStatus };
  syncStatusObservers.forEach(observer => observer(syncStatus));
};

/**
 * Subscribe to sync status updates
 */
export const subscribeSyncStatus = (callback: (status: SyncStatus) => void): () => void => {
  syncStatusObservers.push(callback);
  
  // Immediately notify with current status
  callback(syncStatus);
  
  // Return unsubscribe function
  return () => {
    const index = syncStatusObservers.indexOf(callback);
    if (index !== -1) {
      syncStatusObservers.splice(index, 1);
    }
  };
};

/**
 * Check server health
 */
export const checkServerHealth = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    return response.ok;
  } catch (error) {
    console.error("Server health check failed:", error);
    return false;
  }
};

/**
 * Manually trigger sync process
 */
export const syncNotes = async (): Promise<StorageOperationResult> => {
  if (syncStatus.isSyncing) {
    return { 
      success: false, 
      error: 'Sync already in progress' 
    };
  }
  
  updateSyncStatus({ 
    isSyncing: true, 
    syncError: null 
  });
  
  try {
    // Check server health first
    const isServerAvailable = await checkServerHealth();
    
    if (!isServerAvailable) {
      throw new Error('Sync server is not available');
    }
    
    // Get device ID for anonymous sync
    const deviceId = getDeviceId();
    
    // Get unsynced notes from IndexedDB
    const unsyncedNotes = await getUnsyncedNotes();
    updateSyncStatus({ pendingChanges: unsyncedNotes.length });
    
    if (unsyncedNotes.length === 0) {
      console.log('No unsynced notes to push to server');
      updateSyncStatus({ 
        isSyncing: false,
        lastSyncTime: new Date().toISOString(),
        pendingChanges: 0
      });
      return { success: true };
    }
    
    // Prepare data for sync
    const syncData = {
      notes: unsyncedNotes,
      last_sync: syncStatus.lastSyncTime
    };
    
    // Send sync request
    const response = await fetch(`${API_URL}/api/sync/${deviceId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(syncData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Sync failed');
    }
    
    const result = await response.json();
    
    // Handle conflicts if any
    if (result.conflicts && result.conflicts.length > 0) {
      console.warn('Sync conflicts detected:', result.conflicts);
      // For now, we'll just log conflicts
      // In a real implementation, you might want to show a conflict resolution UI
    }
    
    // Mark synced notes in IndexedDB
    for (const note of unsyncedNotes) {
      await markNoteAsSynced(note.id, note.sync_hash || '');
    }
    
    // Update sync metadata
    await updateSyncMetadata();
    
    // Update sync status
    updateSyncStatus({ 
      isSyncing: false,
      lastSyncTime: new Date().toISOString(),
      pendingChanges: 0
    });
    
    console.log('Sync completed successfully');
    return { success: true };
    
  } catch (error) {
    console.error('Sync error:', error);
    
    updateSyncStatus({ 
      isSyncing: false,
      syncError: error instanceof Error ? error.message : 'Unknown sync error'
    });
    
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown sync error'
    };
  }
};

/**
 * Share a note via the sync server
 */
export const shareNoteViaServer = async (
  content: string, 
  title?: string, 
  expiresIn?: number
): Promise<{ success: boolean; shareId?: string; error?: string }> => {
  try {
    // Check server health first
    const isServerAvailable = await checkServerHealth();
    
    if (!isServerAvailable) {
      throw new Error('Share server is not available');
    }
    
    const response = await fetch(`${API_URL}/api/share`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        content,
        title,
        expires_in: expiresIn
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Sharing failed');
    }
    
    const result = await response.json();
    
    if (!result.success || !result.share_id) {
      throw new Error('Failed to get share ID');
    }
    
    return {
      success: true,
      shareId: result.share_id
    };
    
  } catch (error) {
    console.error('Share error:', error);
    
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown sharing error'
    };
  }
};

/**
 * Get a shared note by ID
 */
export const getSharedNoteFromServer = async (shareId: string): Promise<{ 
  success: boolean; 
  content?: string; 
  title?: string;
  error?: string 
}> => {
  try {
    const response = await fetch(`${API_URL}/api/share/${shareId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to retrieve shared note');
    }
    
    const sharedNote = await response.json();
    
    return {
      success: true,
      content: sharedNote.content,
      title: sharedNote.title
    };
    
  } catch (error) {
    console.error('Error retrieving shared note:', error);
    
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error retrieving shared note'
    };
  }
};

/**
 * Setup automatic background sync
 */
export const setupBackgroundSync = (intervalMs = SYNC_INTERVAL): () => void => {
  // Don't sync in SSR environment
  if (typeof window === 'undefined') return () => {};
  
  // Set up periodic sync
  const intervalId = setInterval(async () => {
    try {
      // Check if there are pending changes before syncing
      const unsyncedNotes = await getUnsyncedNotes();
      
      if (unsyncedNotes.length > 0) {
        await syncNotes();
      }
    } catch (error) {
      console.error('Background sync error:', error);
    }
  }, intervalMs);
  
  // Return cleanup function
  return () => clearInterval(intervalId);
};

// Automatically update pending changes count
const updatePendingChangesCount = async () => {
  try {
    // Wrap this in a try-catch to handle initialization issues
    const unsyncedNotes = await getUnsyncedNotes()
      .catch(err => {
        console.warn('Could not fetch unsynced notes, database may still be initializing');
        return [];
      });
    
    // Only update if we have a valid array
    if (Array.isArray(unsyncedNotes)) {
      updateSyncStatus({ pendingChanges: unsyncedNotes.length });
    } else {
      updateSyncStatus({ pendingChanges: 0 });
    }
  } catch (error) {
    console.error('Error updating pending changes count:', error);
    // Set pending changes to 0 to avoid UI inconsistencies
    updateSyncStatus({ pendingChanges: 0 });
  }
};

// Initialize - update pending changes on startup
updatePendingChangesCount();
