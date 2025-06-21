
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
}

export function useNotesManager() {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load notes when user is authenticated
  useEffect(() => {
    const loadNotes = async () => {
      if (!user || authLoading) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const notesData = await getAllNotesSecurely();
        
        // Convert the Record<string, string> to Note[]
        const notesList: Note[] = Object.entries(notesData).map(([id, content]) => ({
          id,
          title: content.split('\n')[0]?.slice(0, 50) || 'Untitled',
          content,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          user_id: user.id
        }));

        setNotes(notesList);
        
        // Set current note to the first one if available
        if (notesList.length > 0 && !currentNote) {
          setCurrentNote(notesList[0]);
        }
      } catch (error) {
        console.error('Error loading notes:', error);
        toast({
          title: 'Error loading notes',
          description: 'Failed to load your notes from Supabase.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    loadNotes();
  }, [user, authLoading, toast]);

  const createNote = useCallback(async (title?: string, content?: string): Promise<Note | null> => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to create notes.',
        variant: 'destructive',
      });
      return null;
    }

    try {
      const newNote: Note = {
        id: uuidv4(),
        title: title || 'New Note',
        content: content || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user_id: user.id
      };

      // Save to Supabase
      const result = await saveNoteSecurely(newNote.id, newNote.content);
      
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
      console.error('Error creating note:', error);
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
      toast({
        title: 'Authentication required',
        description: 'Please sign in to save notes.',
        variant: 'destructive',
      });
      return false;
    }

    try {
      setSaving(true);
      
      const noteToUpdate = notes.find(note => note.id === noteId);
      if (!noteToUpdate) {
        throw new Error('Note not found');
      }

      const updatedContent = updates.content || noteToUpdate.content;
      
      // Save to Supabase
      const result = await saveNoteSecurely(noteId, updatedContent);
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to save note');
      }

      // Update local state
      const updatedNote = {
        ...noteToUpdate,
        ...updates,
        updated_at: new Date().toISOString()
      };

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
      console.error('Error saving note:', error);
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
      toast({
        title: 'Authentication required',
        description: 'Please sign in to delete notes.',
        variant: 'destructive',
      });
      return false;
    }

    try {
      // Delete from Supabase
      const result = await deleteNoteSecurely(noteId);
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to delete note');
      }

      // Update local state
      setNotes(prev => prev.filter(note => note.id !== noteId));
      
      // If we deleted the current note, clear it
      if (currentNote?.id === noteId) {
        setCurrentNote(null);
      }

      toast({
        title: 'Note deleted',
        description: 'Your note has been deleted from Supabase.',
      });

      return true;
    } catch (error) {
      console.error('Error deleting note:', error);
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
  };
}
