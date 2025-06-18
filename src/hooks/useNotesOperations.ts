
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Note } from './useNotesLoader';

export const useNotesOperations = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const createNote = async (title?: string, content?: string): Promise<Note | null> => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to create notes.',
        variant: 'destructive',
      });
      return null;
    }

    try {
      const noteData = {
        title: title || 'Untitled Note',
        content: content || '',
        user_id: user.id,
        content_type: 'html',
      };

      const { data, error } = await supabase
        .from('notes_v2')
        .insert([noteData])
        .select()
        .single();

      if (error) {
        console.error('Error creating note:', error);
        toast({
          title: 'Error creating note',
          description: 'Failed to create a new note. Please try again.',
          variant: 'destructive',
        });
        return null;
      }

      toast({
        title: 'Note created',
        description: 'Your new note has been created successfully.',
      });

      return data as Note;
    } catch (error) {
      console.error('Unexpected error creating note:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred while creating the note.',
        variant: 'destructive',
      });
      return null;
    }
  };

  const saveNote = async (
    noteId: string, 
    updates: Partial<Pick<Note, 'title' | 'content'>>
  ): Promise<Note | boolean> => {
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
        .from('notes_v2')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', noteId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error saving note:', error);
        toast({
          title: 'Error saving note',
          description: 'Failed to save your note. Please try again.',
          variant: 'destructive',
        });
        return false;
      }

      return data as Note;
    } catch (error) {
      console.error('Unexpected error saving note:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred while saving the note.',
        variant: 'destructive',
      });
      return false;
    }
  };

  const deleteNote = async (noteId: string): Promise<boolean> => {
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
        .from('notes_v2')
        .delete()
        .eq('id', noteId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting note:', error);
        toast({
          title: 'Error deleting note',
          description: 'Failed to delete the note. Please try again.',
          variant: 'destructive',
        });
        return false;
      }

      toast({
        title: 'Note deleted',
        description: 'The note has been deleted successfully.',
      });

      return true;
    } catch (error) {
      console.error('Unexpected error deleting note:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred while deleting the note.',
        variant: 'destructive',
      });
      return false;
    }
  };

  return {
    createNote,
    saveNote,
    deleteNote,
  };
};
