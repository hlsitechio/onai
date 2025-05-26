
// Re-export all functionality from the refactored modules
export type { StorageProviderType } from './storage/storageProvider';
export type { StorageOperationResult } from './storage/notesOperations';

export { 
  saveNote, 
  getAllNotes, 
  deleteNote, 
  renameNote 
} from './storage/notesOperations';

export { shareNote } from './storage/shareOperations';

export { 
  getStorageProvider 
} from './storage/storageProvider';
