
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export interface Note {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export const useNotesLoader = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const loadNotes = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('notes_v2')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error loading notes:', error);
        toast({
          title: 'Error loading notes',
          description: 'Failed to load your notes. Please try again.',
          variant: 'destructive',
        });
        return;
      }

      setNotes(data || []);
    } catch (error) {
      console.error('Unexpected error loading notes:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred while loading notes.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const refreshNotes = () => {
    loadNotes();
  };

  useEffect(() => {
    loadNotes();
  }, [user]);

  return {
    notes,
    setNotes,
    loading,
    refreshNotes,
  };
};
