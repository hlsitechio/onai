
import { Note } from '../types/note';

const NOTES_STORAGE_KEY = 'online-note-ai-notes';

export class NoteStorageService {
  static getAllNotes(): Note[] {
    try {
      const notesJson = localStorage.getItem(NOTES_STORAGE_KEY);
      if (!notesJson) return [];
      
      const notes = JSON.parse(notesJson);
      return notes.map((note: any) => ({
        ...note,
        createdAt: new Date(note.createdAt),
        updatedAt: new Date(note.updatedAt),
      }));
    } catch (error) {
      console.error('Error loading notes:', error);
      return [];
    }
  }

  static saveNote(note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Note {
    const notes = this.getAllNotes();
    const newNote: Note = {
      ...note,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    notes.push(newNote);
    this.saveAllNotes(notes);
    return newNote;
  }

  static updateNote(id: string, updates: Partial<Omit<Note, 'id' | 'createdAt'>>): Note | null {
    const notes = this.getAllNotes();
    const noteIndex = notes.findIndex(note => note.id === id);
    
    if (noteIndex === -1) return null;
    
    const updatedNote = {
      ...notes[noteIndex],
      ...updates,
      updatedAt: new Date(),
    };
    
    notes[noteIndex] = updatedNote;
    this.saveAllNotes(notes);
    return updatedNote;
  }

  static deleteNote(id: string): boolean {
    const notes = this.getAllNotes();
    const filteredNotes = notes.filter(note => note.id !== id);
    
    if (filteredNotes.length === notes.length) return false;
    
    this.saveAllNotes(filteredNotes);
    return true;
  }

  private static saveAllNotes(notes: Note[]): void {
    try {
      localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
    } catch (error) {
      console.error('Error saving notes:', error);
    }
  }
}
