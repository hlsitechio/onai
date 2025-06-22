
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Note, NoteFilters } from '../types/note';
import { NoteStorageService } from '../services/noteStorage';
import { toast } from 'sonner';

interface NotesContextType {
  notes: Note[];
  filteredNotes: Note[];
  currentNote: Note | null;
  filters: NoteFilters;
  isLoading: boolean;
  createNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Note>;
  updateNote: (id: string, updates: Partial<Omit<Note, 'id' | 'createdAt'>>) => Promise<Note | null>;
  deleteNote: (id: string) => Promise<boolean>;
  setCurrentNote: (note: Note | null) => void;
  setFilters: (filters: NoteFilters) => void;
  refreshNotes: () => void;
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
};

export const NotesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [filters, setFilters] = useState<NoteFilters>({});
  const [isLoading, setIsLoading] = useState(true);

  const refreshNotes = () => {
    setIsLoading(true);
    try {
      const loadedNotes = NoteStorageService.getAllNotes();
      setNotes(loadedNotes);
    } catch (error) {
      toast.error('Failed to load notes');
      console.error('Error loading notes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshNotes();
  }, []);

  const createNote = async (noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Promise<Note> => {
    try {
      const newNote = NoteStorageService.saveNote(noteData);
      setNotes(prev => [...prev, newNote]);
      toast.success('Note created successfully');
      return newNote;
    } catch (error) {
      toast.error('Failed to create note');
      throw error;
    }
  };

  const updateNote = async (id: string, updates: Partial<Omit<Note, 'id' | 'createdAt'>>): Promise<Note | null> => {
    try {
      const updatedNote = NoteStorageService.updateNote(id, updates);
      if (updatedNote) {
        setNotes(prev => prev.map(note => note.id === id ? updatedNote : note));
        if (currentNote?.id === id) {
          setCurrentNote(updatedNote);
        }
        toast.success('Note updated successfully');
      }
      return updatedNote;
    } catch (error) {
      toast.error('Failed to update note');
      throw error;
    }
  };

  const deleteNote = async (id: string): Promise<boolean> => {
    try {
      const success = NoteStorageService.deleteNote(id);
      if (success) {
        setNotes(prev => prev.filter(note => note.id !== id));
        if (currentNote?.id === id) {
          setCurrentNote(null);
        }
        toast.success('Note deleted successfully');
      }
      return success;
    } catch (error) {
      toast.error('Failed to delete note');
      throw error;
    }
  };

  // Filter notes based on current filters
  const filteredNotes = notes.filter(note => {
    if (filters.category && note.category !== filters.category) return false;
    if (filters.isFavorite !== undefined && note.isFavorite !== filters.isFavorite) return false;
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      const matchesTitle = note.title.toLowerCase().includes(searchLower);
      const matchesContent = note.content.toLowerCase().includes(searchLower);
      const matchesTags = note.tags.some(tag => tag.toLowerCase().includes(searchLower));
      if (!matchesTitle && !matchesContent && !matchesTags) return false;
    }
    if (filters.tags && filters.tags.length > 0) {
      const hasMatchingTag = filters.tags.some(filterTag => 
        note.tags.includes(filterTag)
      );
      if (!hasMatchingTag) return false;
    }
    return true;
  });

  return (
    <NotesContext.Provider
      value={{
        notes,
        filteredNotes,
        currentNote,
        filters,
        isLoading,
        createNote,
        updateNote,
        deleteNote,
        setCurrentNote,
        setFilters,
        refreshNotes,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
};
