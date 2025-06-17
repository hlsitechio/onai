
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';

export interface Note {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export const useNotesManager = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Load all notes for the current user
  const loadNotes = useCallback(async () => {
    if (!user) {
      setNotes([]);
      setCurrentNote(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      setNotes(data || []);
      
      // If no current note is selected and we have notes, select the first one
      if (!currentNote && data && data.length > 0) {
        setCurrentNote(data[0]);
      }
    } catch (error) {
      console.error('Error loading notes:', error);
      toast({
        title: 'Error loading notes',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [user, currentNote, toast]);

  // Create a new note
  const createNote = useCallback(async (title: string = 'Untitled Note', content: string = '') => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to create notes.',
        variant: 'destructive',
      });
      return null;
    }

    try {
      const newNote: Omit<Note, 'created_at' | 'updated_at'> = {
        id: uuidv4(),
        title,
        content,
        user_id: user.id,
      };

      const { data, error } = await supabase
        .from('notes')
        .insert(newNote)
        .select()
        .single();

      if (error) throw error;

      const createdNote = data as Note;
      setNotes(prev => [createdNote, ...prev]);
      setCurrentNote(createdNote);

      toast({
        title: 'Note created',
        description: 'New note has been created successfully.',
      });

      return createdNote;
    } catch (error) {
      console.error('Error creating note:', error);
      toast({
        title: 'Error creating note',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
      return null;
    }
  }, [user, toast]);

  // Save/update a note
  const saveNote = useCallback(async (noteId: string, updates: Partial<Pick<Note, 'title' | 'content'>>) => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to save notes.',
        variant: 'destructive',
      });
      return false;
    }

    try {
      setSaving(true);
      const { data, error } = await supabase
        .from('notes')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', noteId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      const updatedNote = data as Note;
      
      // Update notes list
      setNotes(prev => prev.map(note => 
        note.id === noteId ? updatedNote : note
      ));

      // Update current note if it's the one being saved
      if (currentNote?.id === noteId) {
        setCurrentNote(updatedNote);
      }

      return true;
    } catch (error) {
      console.error('Error saving note:', error);
      toast({
        title: 'Error saving note',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
      return false;
    } finally {
      setSaving(false);
    }
  }, [user, currentNote, toast]);

  // Delete a note
  const deleteNote = useCallback(async (noteId: string) => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to delete notes.',
        variant: 'destructive',
      });
      return false;
    }

    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', noteId)
        .eq('user_id', user.id);

      if (error) throw error;

      setNotes(prev => prev.filter(note => note.id !== noteId));
      
      // If the deleted note was the current note, select another one
      if (currentNote?.id === noteId) {
        const remainingNotes = notes.filter(note => note.id !== noteId);
        setCurrentNote(remainingNotes.length > 0 ? remainingNotes[0] : null);
      }

      toast({
        title: 'Note deleted',
        description: 'Note has been deleted successfully.',
      });

      return true;
    } catch (error) {
      console.error('Error deleting note:', error);
      toast({
        title: 'Error deleting note',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
      return false;
    }
  }, [user, currentNote, notes, toast]);

  // Auto-save functionality
  const autoSave = useCallback(async (noteId: string, content: string, title?: string) => {
    if (!user || saving) return;

    const updates: Partial<Pick<Note, 'title' | 'content'>> = { content };
    if (title !== undefined) {
      updates.title = title;
    }

    await saveNote(noteId, updates);
  }, [user, saving, saveNote]);

  // Load notes when user changes
  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

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
    refreshNotes: loadNotes,
  };
};
