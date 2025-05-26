
export type StorageProviderType = 'chrome' | 'local';

const STORAGE_PREFIX = 'noteflow-';

/**
 * Detect which storage provider to use
 */
export const getStorageProvider = (): StorageProviderType => {
  if (typeof chrome !== 'undefined' && chrome.storage) {
    return 'chrome';
  }
  return 'local';
};

/**
 * Save content using Chrome storage API
 */
export const saveToChrome = async (key: string, value: string): Promise<{ success: boolean; error?: string }> => {
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
export const saveToLocal = (key: string, value: string): { success: boolean; error?: string } => {
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
 * Helper to get notes from localStorage
 */
export const getNotesFromLocalStorage = (): Record<string, string> => {
  const notes: Record<string, string> = {};
  const SYSTEM_KEYS = ['noteflow-encryption-key'];
  
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
 * Helper to remove local fallbacks
 */
export const removeLocalFallbacks = (noteId: string): void => {
  localStorage.removeItem(`${STORAGE_PREFIX}${noteId}`);
};
