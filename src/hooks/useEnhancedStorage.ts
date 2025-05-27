import { useEffect, useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { 
  saveNote, 
  getAllNotes, 
  deleteNote, 
  initializeStorage,
  StorageOperationResult
} from '@/utils/storage/notesOperations';
import { 
  syncNotes, 
  setupBackgroundSync, 
  subscribeSyncStatus,
  SyncStatus,
  shareNoteViaServer
} from '@/utils/storage/syncService';
import { toast } from 'sonner';

export interface UseEnhancedStorageResult {
  notes: Record<string, string>;
  loading: boolean;
  error: string | null;
  selectedNoteId: string | null;
  syncStatus: SyncStatus;
  createNote: () => Promise<string>;
  saveCurrentNote: (content: string) => Promise<StorageOperationResult>;
  selectNote: (noteId: string) => void;
  removeNote: (noteId: string) => Promise<StorageOperationResult>;
  shareNote: (noteId: string) => Promise<{ success: boolean; shareUrl?: string; error?: string }>;
  syncAllNotes: () => Promise<StorageOperationResult>;
}

/**
 * Hook for using the enhanced note storage system with IndexedDB and synchronization
 */
export const useEnhancedStorage = (): UseEnhancedStorageResult => {
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    lastSyncTime: null,
    isSyncing: false,
    syncError: null,
    pendingChanges: 0
  });

  // Initialize storage and load notes
  useEffect(() => {
    const initStorage = async () => {
      try {
        setLoading(true);
        
        // Initialize storage system (migrate if needed)
        await initializeStorage();
        
        // Load all notes
        const loadedNotes = await getAllNotes();
        setNotes(loadedNotes);
        
        // Auto-select the first note or create a new one if none exist
        const noteIds = Object.keys(loadedNotes);
        if (noteIds.length > 0) {
          // Sort by most recently modified if possible
          setSelectedNoteId(noteIds[0]);
        } else {
          // Create a default note if none exist
          const newNoteId = await createEmptyNote();
          setSelectedNoteId(newNoteId);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error initializing storage:', err);
        setError(err instanceof Error ? err.message : 'Failed to load notes');
        setLoading(false);
      }
    };
    
    initStorage();
  }, []);
  
  // Set up background sync
  useEffect(() => {
    // Subscribe to sync status updates
    const unsubscribe = subscribeSyncStatus(setSyncStatus);
    
    // Set up background sync (every 30 seconds if there are changes)
    const cleanupSync = setupBackgroundSync(30000);
    
    return () => {
      unsubscribe();
      cleanupSync();
    };
  }, []);
  
  // Helper to create an empty note
  const createEmptyNote = async (): Promise<string> => {
    const newNoteId = `note-${uuidv4()}`;
    const defaultContent = '# Untitled Note\n\nStart writing...';
    
    await saveNote(newNoteId, defaultContent);
    
    // Update local state
    setNotes(prevNotes => ({
      ...prevNotes,
      [newNoteId]: defaultContent
    }));
    
    return newNoteId;
  };
  
  // Create a new note and select it
  const createNote = useCallback(async (): Promise<string> => {
    const newNoteId = await createEmptyNote();
    setSelectedNoteId(newNoteId);
    return newNoteId;
  }, []);
  
  // Save the current note
  const saveCurrentNote = useCallback(async (content: string): Promise<StorageOperationResult> => {
    if (!selectedNoteId) {
      return { success: false, error: 'No note selected' };
    }
    
    try {
      const result = await saveNote(selectedNoteId, content);
      
      if (result.success) {
        // Update local state
        setNotes(prevNotes => ({
          ...prevNotes,
          [selectedNoteId]: content
        }));
      }
      
      return result;
    } catch (err) {
      console.error('Error saving note:', err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to save note' 
      };
    }
  }, [selectedNoteId]);
  
  // Select a note
  const selectNote = useCallback((noteId: string): void => {
    if (notes[noteId]) {
      setSelectedNoteId(noteId);
    }
  }, [notes]);
  
  // Delete a note
  const removeNote = useCallback(async (noteId: string): Promise<StorageOperationResult> => {
    try {
      const result = await deleteNote(noteId);
      
      if (result.success) {
        // Update local state
        setNotes(prevNotes => {
          const updatedNotes = { ...prevNotes };
          delete updatedNotes[noteId];
          return updatedNotes;
        });
        
        // If the deleted note was selected, select another one
        if (selectedNoteId === noteId) {
          const remainingNoteIds = Object.keys(notes).filter(id => id !== noteId);
          if (remainingNoteIds.length > 0) {
            setSelectedNoteId(remainingNoteIds[0]);
          } else {
            setSelectedNoteId(null);
          }
        }
      }
      
      return result;
    } catch (err) {
      console.error('Error removing note:', err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to remove note' 
      };
    }
  }, [notes, selectedNoteId]);
  
  // Share a note
  const shareNote = useCallback(async (noteId: string): Promise<{ success: boolean; shareUrl?: string; error?: string }> => {
    try {
      const noteContent = notes[noteId];
      
      if (!noteContent) {
        return { success: false, error: 'Note not found' };
      }
      
      // Generate a title from the content
      const title = noteContent
        .split('\n')[0]
        .replace(/^#+ /, '') // Remove Markdown heading symbols
        .substring(0, 50)
        .trim() || 'Shared Note';
      
      // Share via server
      const shareResult = await shareNoteViaServer(noteContent, title, 7); // Expire in 7 days
      
      if (!shareResult.success || !shareResult.shareId) {
        throw new Error(shareResult.error || 'Failed to share note');
      }
      
      // Construct the share URL
      const shareUrl = `${window.location.origin}/shared/${shareResult.shareId}`;
      
      // Show success toast
      toast.success('Note shared successfully!', {
        description: 'The share link has been created and is valid for 7 days.',
        action: {
          label: 'Copy Link',
          onClick: () => {
            navigator.clipboard.writeText(shareUrl);
            toast.success('Link copied to clipboard!');
          }
        }
      });
      
      return { success: true, shareUrl };
    } catch (err) {
      console.error('Error sharing note:', err);
      
      // Show error toast
      toast.error('Failed to share note', {
        description: err instanceof Error ? err.message : 'Unknown error occurred'
      });
      
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to share note' 
      };
    }
  }, [notes]);
  
  // Manually trigger sync
  const syncAllNotes = useCallback(async (): Promise<StorageOperationResult> => {
    try {
      const result = await syncNotes();
      
      if (result.success) {
        toast.success('Notes synced successfully!');
      } else if (result.error) {
        toast.error('Sync failed', { description: result.error });
      }
      
      return result;
    } catch (err) {
      console.error('Error syncing notes:', err);
      
      const errorMessage = err instanceof Error ? err.message : 'Failed to sync notes';
      toast.error('Sync failed', { description: errorMessage });
      
      return { 
        success: false, 
        error: errorMessage 
      };
    }
  }, []);
  
  return {
    notes,
    loading,
    error,
    selectedNoteId,
    syncStatus,
    createNote,
    saveCurrentNote,
    selectNote,
    removeNote,
    shareNote,
    syncAllNotes
  };
};
