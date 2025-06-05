// Storage service for ONAI notes persistence
class StorageService {
  constructor() {
    this.storageKey = 'onai_notes';
    this.foldersKey = 'onai_folders';
    this.settingsKey = 'onai_settings';
    this.metadataKey = 'onai_metadata';
  }

  // Initialize storage with default data if empty
  initialize() {
    try {
      if (!this.getNotes().length) {
        this.setNotes(this.getDefaultNotes());
      }
      if (!this.getFolders().length) {
        this.setFolders(this.getDefaultFolders());
      }
      return true;
    } catch (error) {
      console.error('Storage initialization failed:', error);
      return false;
    }
  }

  // Notes management
  getNotes() {
    try {
      const notes = localStorage.getItem(this.storageKey);
      return notes ? JSON.parse(notes) : [];
    } catch (error) {
      console.error('Error reading notes from storage:', error);
      return [];
    }
  }

  setNotes(notes) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(notes));
      this.updateMetadata({ lastSync: new Date().toISOString() });
      return true;
    } catch (error) {
      console.error('Error saving notes to storage:', error);
      return false;
    }
  }

  addNote(note) {
    try {
      const notes = this.getNotes();
      const newNote = {
        ...note,
        id: note.id || this.generateId(),
        created_at: note.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
        version: 1
      };
      notes.unshift(newNote);
      this.setNotes(notes);
      return newNote;
    } catch (error) {
      console.error('Error adding note:', error);
      return null;
    }
  }

  updateNote(noteId, updates) {
    try {
      const notes = this.getNotes();
      const noteIndex = notes.findIndex(note => note.id === noteId);
      if (noteIndex === -1) return null;

      const updatedNote = {
        ...notes[noteIndex],
        ...updates,
        updated_at: new Date().toISOString(),
        version: (notes[noteIndex].version || 1) + 1
      };
      
      notes[noteIndex] = updatedNote;
      this.setNotes(notes);
      return updatedNote;
    } catch (error) {
      console.error('Error updating note:', error);
      return null;
    }
  }

  deleteNote(noteId) {
    try {
      const notes = this.getNotes();
      const filteredNotes = notes.filter(note => note.id !== noteId);
      this.setNotes(filteredNotes);
      return true;
    } catch (error) {
      console.error('Error deleting note:', error);
      return false;
    }
  }

  // Folders management
  getFolders() {
    try {
      const folders = localStorage.getItem(this.foldersKey);
      return folders ? JSON.parse(folders) : [];
    } catch (error) {
      console.error('Error reading folders from storage:', error);
      return [];
    }
  }

  setFolders(folders) {
    try {
      localStorage.setItem(this.foldersKey, JSON.stringify(folders));
      return true;
    } catch (error) {
      console.error('Error saving folders to storage:', error);
      return false;
    }
  }

  addFolder(folder) {
    try {
      const folders = this.getFolders();
      const newFolder = {
        ...folder,
        id: folder.id || this.generateId(),
        created_at: folder.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      folders.push(newFolder);
      this.setFolders(folders);
      return newFolder;
    } catch (error) {
      console.error('Error adding folder:', error);
      return null;
    }
  }

  // Settings management
  getSettings() {
    try {
      const settings = localStorage.getItem(this.settingsKey);
      return settings ? JSON.parse(settings) : this.getDefaultSettings();
    } catch (error) {
      console.error('Error reading settings from storage:', error);
      return this.getDefaultSettings();
    }
  }

  setSettings(settings) {
    try {
      localStorage.setItem(this.settingsKey, JSON.stringify(settings));
      return true;
    } catch (error) {
      console.error('Error saving settings to storage:', error);
      return false;
    }
  }

  updateSettings(updates) {
    try {
      const currentSettings = this.getSettings();
      const newSettings = { ...currentSettings, ...updates };
      this.setSettings(newSettings);
      return newSettings;
    } catch (error) {
      console.error('Error updating settings:', error);
      return null;
    }
  }

  // Metadata management
  getMetadata() {
    try {
      const metadata = localStorage.getItem(this.metadataKey);
      return metadata ? JSON.parse(metadata) : {
        version: '1.0.0',
        created: new Date().toISOString(),
        lastSync: new Date().toISOString(),
        totalNotes: 0,
        totalFolders: 0
      };
    } catch (error) {
      console.error('Error reading metadata from storage:', error);
      return {};
    }
  }

  updateMetadata(updates) {
    try {
      const currentMetadata = this.getMetadata();
      const newMetadata = { 
        ...currentMetadata, 
        ...updates,
        totalNotes: this.getNotes().length,
        totalFolders: this.getFolders().length
      };
      localStorage.setItem(this.metadataKey, JSON.stringify(newMetadata));
      return newMetadata;
    } catch (error) {
      console.error('Error updating metadata:', error);
      return null;
    }
  }

  // Import/Export functionality
  exportData() {
    try {
      const data = {
        notes: this.getNotes(),
        folders: this.getFolders(),
        settings: this.getSettings(),
        metadata: this.getMetadata(),
        exportDate: new Date().toISOString(),
        version: '1.0.0'
      };
      return JSON.stringify(data, null, 2);
    } catch (error) {
      console.error('Error exporting data:', error);
      return null;
    }
  }

  importData(jsonData) {
    try {
      const data = JSON.parse(jsonData);
      
      // Validate data structure
      if (!data.notes || !Array.isArray(data.notes)) {
        throw new Error('Invalid data format: notes array missing');
      }

      // Import notes
      if (data.notes.length > 0) {
        this.setNotes(data.notes);
      }

      // Import folders
      if (data.folders && Array.isArray(data.folders)) {
        this.setFolders(data.folders);
      }

      // Import settings
      if (data.settings && typeof data.settings === 'object') {
        this.setSettings(data.settings);
      }

      // Update metadata
      this.updateMetadata({
        lastImport: new Date().toISOString(),
        importedFrom: data.exportDate || 'unknown'
      });

      return {
        success: true,
        imported: {
          notes: data.notes.length,
          folders: data.folders?.length || 0,
          settings: data.settings ? 1 : 0
        }
      };
    } catch (error) {
      console.error('Error importing data:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Backup functionality
  downloadBackup() {
    try {
      const data = this.exportData();
      if (!data) throw new Error('Failed to export data');

      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `onai-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
      return true;
    } catch (error) {
      console.error('Error downloading backup:', error);
      return false;
    }
  }

  // Storage utilities
  getStorageInfo() {
    try {
      const notes = this.getNotes();
      const folders = this.getFolders();
      const settings = this.getSettings();
      
      return {
        totalNotes: notes.length,
        totalFolders: folders.length,
        storageUsed: this.calculateStorageSize(),
        lastSync: this.getMetadata().lastSync,
        isOnline: navigator.onLine
      };
    } catch (error) {
      console.error('Error getting storage info:', error);
      return null;
    }
  }

  calculateStorageSize() {
    try {
      let total = 0;
      for (let key in localStorage) {
        if (key.startsWith('onai_')) {
          total += localStorage[key].length;
        }
      }
      return total;
    } catch (error) {
      return 0;
    }
  }

  clearStorage() {
    try {
      localStorage.removeItem(this.storageKey);
      localStorage.removeItem(this.foldersKey);
      localStorage.removeItem(this.settingsKey);
      localStorage.removeItem(this.metadataKey);
      return true;
    } catch (error) {
      console.error('Error clearing storage:', error);
      return false;
    }
  }

  // Utility functions
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  getDefaultNotes() {
    return [
      {
        id: '1',
        title: 'Welcome to ONAI',
        content: '# Welcome to ONAI\n\nThis is your first note! ONAI is an AI-powered note-taking application that helps you organize your thoughts and enhance your productivity.\n\n## Features\n- Rich text editing\n- AI assistance\n- Smart organization\n- Real-time collaboration\n- End-to-end encryption',
        tags: ['welcome', 'getting-started', 'ai'],
        folder_id: null,
        user_id: 'demo',
        is_shared: false,
        is_public: false,
        is_starred: true,
        ai_generated: false,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        version: 1,
        metadata: {
          word_count: 45,
          character_count: 280,
          reading_time: 1,
          ai_generated: false,
          language: 'en'
        }
      },
      {
        id: '2',
        title: 'AI Features Overview',
        content: '# AI Features in ONAI\n\n## Writing Assistant\n- Grammar and style suggestions\n- Content enhancement\n- Tone adjustment\n\n## Research Helper\n- Fact checking\n- Source finding\n- Summary generation\n\n## Creative Writing\n- Story development\n- Character creation\n- Plot suggestions',
        tags: ['ai', 'features', 'writing'],
        folder_id: '1',
        user_id: 'demo',
        is_shared: false,
        is_public: false,
        is_starred: false,
        ai_generated: true,
        created_at: '2024-01-02T00:00:00Z',
        updated_at: '2024-01-02T00:00:00Z',
        version: 1,
        metadata: {
          word_count: 32,
          character_count: 195,
          reading_time: 1,
          ai_generated: true,
          language: 'en'
        }
      }
    ];
  }

  getDefaultFolders() {
    return [
      {
        id: '1',
        name: 'AI Research',
        color: 'blue',
        user_id: 'demo',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      },
      {
        id: '2',
        name: 'Personal',
        color: 'green',
        user_id: 'demo',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      }
    ];
  }

  getDefaultSettings() {
    return {
      theme: 'dark',
      language: 'en',
      autoSave: true,
      autoSaveInterval: 2000,
      fontSize: 'medium',
      fontFamily: 'Inter',
      lineHeight: 'normal',
      notifications: {
        desktop: true,
        email: false,
        sound: true
      },
      ai: {
        apiKey: '',
        model: 'gemini-2.5-flash',
        temperature: 0.7,
        maxTokens: 1000
      },
      security: {
        encryptionEnabled: true,
        sessionTimeout: 30,
        twoFactorEnabled: false
      },
      editor: {
        defaultEditor: 'rich',
        showWordCount: true,
        showCharacterCount: true,
        spellCheck: true,
        autoCorrect: false
      }
    };
  }
}

// Create and export singleton instance
const storageService = new StorageService();
export default storageService;

