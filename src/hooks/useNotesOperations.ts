
import { useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import type { Note } from './useNotesManager';

export const useNotesOperations = () => {
  const { user } = useAuth();
  const { toast } = useToast();

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

      toast({
        title: 'Note created',
        description: 'New note has been created successfully.',
      });

      return data as Note;
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
      return data as Note;
    } catch (error) {
      console.error('Error saving note:', error);
      toast({
        title: 'Error saving note',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
      return false;
    }
  }, [user, toast]);

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
  }, [user, toast]);

  return {
    createNote,
    saveNote,
    deleteNote,
  };
};
