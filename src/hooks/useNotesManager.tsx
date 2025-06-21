
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { saveNoteSecurely, getAllNotesSecurely, deleteNoteSecurely } from '@/utils/enhancedSupabaseStorage';
import { v4 as uuidv4 } from 'uuid';

export interface Note {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  user_id?: string;
  parent_id?: string | null;
}

export function useNotesManager() {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadNotes = useCallback(async () => {
    if (!user || authLoading) {
      console.log('useNotesManager: No user or still loading auth');
      setLoading(false);
      return;
    }

    try {
      console.log('useNotesManager: Loading notes for user:', user.id);
      setLoading(true);
      const notesData = await getAllNotesSecurely();
      console.log('useNotesManager: Loaded notes data:', notesData);
      
      const notesList: Note[] = Object.entries(notesData).map(([id, content]) => ({
        id,
        title: content.split('\n')[0]?.slice(0, 50) || 'Untitled',
        content,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user_id: user.id,
        parent_id: null
      }));

      console.log('useNotesManager: Processed notes list:', notesList);
      setNotes(notesList);
      
      if (notesList.length > 0 && !currentNote) {
        console.log('useNotesManager: Setting current note to first note:', notesList[0]);
        setCurrentNote(notesList[0]);
      }
    } catch (error) {
      console.error('useNotesManager: Error loading notes:', error);
      toast({
        title: 'Error loading notes',
        description: 'Failed to load your notes from Supabase.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [user, authLoading, toast, currentNote]);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  const createNote = useCallback(async (title?: string, content?: string): Promise<Note | null> => {
    if (!user) {
      console.log('useNotesManager: Cannot create note - no user');
      toast({
        title: 'Authentication required',
        description: 'Please sign in to create notes.',
        variant: 'destructive',
      });
      return null;
    }

    try {
      console.log('useNotesManager: Creating new note');
      const newNote: Note = {
        id: uuidv4(),
        title: title || 'New Note',
        content: content || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user_id: user.id,
        parent_id: null
      };

      console.log('useNotesManager: Saving new note to Supabase:', newNote);
      const result = await saveNoteSecurely(newNote.id, newNote.content);
      console.log('useNotesManager: Save result:', result);
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to create note');
      }

      setNotes(prev => [newNote, ...prev]);
      setCurrentNote(newNote);

      toast({
        title: 'Note created',
        description: 'Your new note has been created successfully.',
      });

      return newNote;
    } catch (error) {
      console.error('useNotesManager: Error creating note:', error);
      toast({
        title: 'Error creating note',
        description: 'Failed to create a new note.',
        variant: 'destructive',
      });
      return null;
    }
  }, [user, toast]);

  const saveNote = useCallback(async (noteId: string, updates: Partial<Note>): Promise<boolean> => {
    if (!user) {
      console.log('useNotesManager: Cannot save note - no user');
      toast({
        title: 'Authentication required',
        description: 'Please sign in to save notes.',
        variant: 'destructive',
      });
      return false;
    }

    try {
      console.log('useNotesManager: Attempting to save note:', noteId, updates);
      setSaving(true);
      
      const noteToUpdate = notes.find(note => note.id === noteId);
      if (!noteToUpdate) {
        console.error('useNotesManager: Note not found:', noteId);
        throw new Error('Note not found');
      }

      const updatedContent = updates.content || noteToUpdate.content;
      console.log('useNotesManager: Saving content to Supabase:', updatedContent.substring(0, 100) + '...');
      
      const result = await saveNoteSecurely(noteId, updatedContent);
      console.log('useNotesManager: Supabase save result:', result);
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to save note');
      }

      const updatedNote = {
        ...noteToUpdate,
        ...updates,
        updated_at: new Date().toISOString()
      };

      console.log('useNotesManager: Updating local state with:', updatedNote);
      setNotes(prev => prev.map(note => 
        note.id === noteId ? updatedNote : note
      ));

      if (currentNote?.id === noteId) {
        setCurrentNote(updatedNote);
      }

      toast({
        title: 'Note saved',
        description: 'Your note has been saved to Supabase.',
      });

      return true;
    } catch (error) {
      console.error('useNotesManager: Error saving note:', error);
      toast({
        title: 'Error saving note',
        description: 'Failed to save your note to Supabase.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setSaving(false);
    }
  }, [user, notes, currentNote, toast]);

  const deleteNote = useCallback(async (noteId: string): Promise<boolean> => {
    if (!user) {
      console.log('useNotesManager: Cannot delete note - no user');
      toast({
        title: 'Authentication required',
        description: 'Please sign in to delete notes.',
        variant: 'destructive',
      });
      return false;
    }

    try {
      console.log('useNotesManager: Deleting note:', noteId);
      const result = await deleteNoteSecurely(noteId);
      console.log('useNotesManager: Delete result:', result);
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to delete note');
      }

      setNotes(prev => prev.filter(note => note.id !== noteId));
      
      if (currentNote?.id === noteId) {
        setCurrentNote(null);
      }

      toast({
        title: 'Note deleted',
        description: 'Your note has been deleted from Supabase.',
      });

      return true;
    } catch (error) {
      console.error('useNotesManager: Error deleting note:', error);
      toast({
        title: 'Error deleting note',
        description: 'Failed to delete your note from Supabase.',
        variant: 'destructive',
      });
      return false;
    }
  }, [user, currentNote, toast]);

  return {
    notes,
    currentNote,
    setCurrentNote,
    loading: loading || authLoading,
    saving,
    createNote,
    saveNote,
    deleteNote,
    loadNotes,
  };
}
