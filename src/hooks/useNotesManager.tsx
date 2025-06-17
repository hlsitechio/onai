
import { useState, useCallback } from 'react';
import { useNotesLoader } from './useNotesLoader';
import { useNotesOperations } from './useNotesOperations';

export interface Note {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export const useNotesManager = () => {
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [saving, setSaving] = useState(false);
  
  const { notes, setNotes, loading, refreshNotes } = useNotesLoader();
  const { createNote: createNoteOp, saveNote: saveNoteOp, deleteNote: deleteNoteOp } = useNotesOperations();

  const createNote = useCallback(async (title?: string, content?: string) => {
    const newNote = await createNoteOp(title, content);
    if (newNote) {
      setNotes(prev => [newNote, ...prev]);
      return newNote;
    }
    return null;
  }, [createNoteOp, setNotes]);

  const saveNote = useCallback(async (noteId: string, updates: Partial<Pick<Note, 'title' | 'content'>>) => {
    setSaving(true);
    try {
      const updatedNote = await saveNoteOp(noteId, updates);
      if (updatedNote && typeof updatedNote === 'object') {
        setNotes(prev => prev.map(note => 
          note.id === noteId ? updatedNote : note
        ));
        
        if (currentNote?.id === noteId) {
          setCurrentNote(updatedNote);
        }
        return true;
      }
      return false;
    } finally {
      setSaving(false);
    }
  }, [saveNoteOp, setNotes, currentNote]);

  const deleteNote = useCallback(async (noteId: string) => {
    const success = await deleteNoteOp(noteId);
    if (success) {
      setNotes(prev => prev.filter(note => note.id !== noteId));
      
      if (currentNote?.id === noteId) {
        const remainingNotes = notes.filter(note => note.id !== noteId);
        setCurrentNote(remainingNotes.length > 0 ? remainingNotes[0] : null);
      }
    }
    return success;
  }, [deleteNoteOp, setNotes, currentNote, notes]);

  const autoSave = useCallback(async (noteId: string, content: string, title?: string) => {
    if (saving) return;

    const updates: Partial<Pick<Note, 'title' | 'content'>> = { content };
    if (title !== undefined) {
      updates.title = title;
    }

    await saveNote(noteId, updates);
  }, [saving, saveNote]);

  return {
    notes,
    currentNote,
    setCurrentNote,
    loading,
    saving,
    createNote,
    saveNote,
    deleteNote,
    autoSave,
    refreshNotes,
  };
};
