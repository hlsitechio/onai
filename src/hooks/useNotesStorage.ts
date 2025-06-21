
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';

interface Note {
  id: string;
  content: string;
  title?: string;
  createdAt: Date;
  updatedAt: Date;
}

export function useNotesStorage() {
  const { toast } = useToast();
  const [notes, setNotes] = useState<Record<string, Note>>({});
  const [currentContent, setCurrentContent] = useState<string>('');
  const [currentNoteId, setCurrentNoteId] = useState<string | null>(null);

  // Load notes from localStorage on mount
  useEffect(() => {
    try {
      const savedNotes = localStorage.getItem('noteflow-notes');
      if (savedNotes) {
        const parsedNotes = JSON.parse(savedNotes);
        setNotes(parsedNotes);
        
        // Load the last edited note
        const lastEditedId = localStorage.getItem('noteflow-last-note-id');
        if (lastEditedId && parsedNotes[lastEditedId]) {
          setCurrentNoteId(lastEditedId);
          setCurrentContent(parsedNotes[lastEditedId].content);
        }
      }
    } catch (error) {
      console.error('Error loading notes:', error);
    }
  }, []);

  // Save notes to localStorage whenever notes change
  useEffect(() => {
    if (Object.keys(notes).length > 0) {
      localStorage.setItem('noteflow-notes', JSON.stringify(notes));
    }
  }, [notes]);

  const saveNote = useCallback((noteId: string, content: string) => {
    const now = new Date();
    setNotes(prev => ({
      ...prev,
      [noteId]: {
        id: noteId,
        content,
        title: content.split('\n')[0].substring(0, 50) || 'Untitled',
        createdAt: prev[noteId]?.createdAt || now,
        updatedAt: now
      }
    }));
    setCurrentContent(content);
    setCurrentNoteId(noteId);
    localStorage.setItem('noteflow-last-note-id', noteId);
  }, []);

  const loadNote = useCallback((noteId: string) => {
    const note = notes[noteId];
    if (note) {
      setCurrentContent(note.content);
      setCurrentNoteId(noteId);
      localStorage.setItem('noteflow-last-note-id', noteId);
    }
  }, [notes]);

  const createNote = useCallback(() => {
    const newNoteId = uuidv4();
    const now = new Date();
    const newNote: Note = {
      id: newNoteId,
      content: '',
      title: 'New Note',
      createdAt: now,
      updatedAt: now
    };
    
    setNotes(prev => ({
      ...prev,
      [newNoteId]: newNote
    }));
    setCurrentContent('');
    setCurrentNoteId(newNoteId);
    localStorage.setItem('noteflow-last-note-id', newNoteId);
    
    return newNoteId;
  }, []);

  const deleteNote = useCallback((noteId: string) => {
    setNotes(prev => {
      const updated = { ...prev };
      delete updated[noteId];
      return updated;
    });
    
    if (currentNoteId === noteId) {
      setCurrentNoteId(null);
      setCurrentContent('');
      localStorage.removeItem('noteflow-last-note-id');
    }
    
    toast({
      title: 'Note deleted',
      description: 'The note has been deleted successfully.',
    });
  }, [currentNoteId, toast]);

  const renameNote = useCallback((noteId: string, newTitle: string) => {
    setNotes(prev => ({
      ...prev,
      [noteId]: {
        ...prev[noteId],
        title: newTitle,
        updatedAt: new Date()
      }
    }));
  }, []);

  return {
    notes,
    currentContent,
    currentNoteId,
    saveNote,
    loadNote,
    createNote,
    deleteNote,
    renameNote
  };
}
