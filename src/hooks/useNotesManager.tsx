
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Note {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export function useNotesManager() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Extract clean text from HTML content
  const extractTextFromHTML = (htmlContent: string): string => {
    if (!htmlContent) return '';
    
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    const textContent = tempDiv.textContent || tempDiv.innerText || '';
    return textContent.trim();
  };

  // Generate title from content
  const generateTitleFromContent = (content: string): string => {
    const textContent = extractTextFromHTML(content);
    
    if (textContent && textContent.length > 0) {
      const firstLine = textContent.split('\n')[0].trim();
      if (firstLine) {
        return firstLine.substring(0, 50) + (firstLine.length > 50 ? '...' : '');
      }
    }
    
    return `Note ${new Date().toLocaleDateString()}`;
  };

  // Load notes when user is authenticated
  useEffect(() => {
    if (user) {
      loadNotes();
    } else {
      setLoading(false);
      setNotes([]);
      setCurrentNote(null);
    }
  }, [user]);

  const loadNotes = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('notes_v2')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      setNotes(data || []);
      
      // Set current note to the most recent one if none is selected
      if (!currentNote && data && data.length > 0) {
        setCurrentNote(data[0]);
      }
    } catch (error) {
      console.error('Error loading notes:', error);
      toast({
        title: 'Error loading notes',
        description: 'Failed to load your notes. Please try refreshing.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const createNote = async (title?: string, content?: string) => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to create notes.',
        variant: 'destructive',
      });
      return null;
    }

    try {
      const noteContent = content || '';
      const noteTitle = title || generateTitleFromContent(noteContent);

      const newNote = {
        title: noteTitle,
        content: noteContent,
        user_id: user.id,
        content_type: 'html',
        is_public: false,
        is_encrypted: false,
      };

      const { data, error } = await supabase
        .from('notes_v2')
        .insert(newNote)
        .select()
        .single();

      if (error) throw error;

      const createdNote = data as Note;
      setNotes(prev => [createdNote, ...prev]);
      
      toast({
        title: 'Note created',
        description: 'New note created successfully.',
      });

      return createdNote;
    } catch (error) {
      console.error('Error creating note:', error);
      toast({
        title: 'Error creating note',
        description: 'Failed to create a new note. Please try again.',
        variant: 'destructive',
      });
      return null;
    }
  };

  const saveNote = async (noteId: string, updates: Partial<Note>) => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to save notes.',
        variant: 'destructive',
      });
      return false;
    }

    // Improved content validation - check for actual text content
    const content = updates.content || '';
    const textContent = extractTextFromHTML(content);
    
    if (!textContent.trim() && content === '<p></p>') {
      toast({
        title: 'Cannot save empty note',
        description: 'Please add some content before saving.',
        variant: 'destructive',
      });
      return false;
    }

    try {
      setSaving(true);
      
      // Auto-generate title from content if title is not provided or is generic
      let finalUpdates = { ...updates };
      if (!updates.title || updates.title === 'Untitled Note' || updates.title.startsWith('Note ')) {
        finalUpdates.title = generateTitleFromContent(content);
      }
      
      const { data, error } = await supabase
        .from('notes_v2')
        .update({
          ...finalUpdates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', noteId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      // Update local state
      setNotes(prev => 
        prev.map(note => 
          note.id === noteId ? { ...note, ...data } : note
        )
      );

      if (currentNote?.id === noteId) {
        setCurrentNote(prev => prev ? { ...prev, ...data } : null);
      }

      return true;
    } catch (error) {
      console.error('Error saving note:', error);
      toast({
        title: 'Error saving note',
        description: 'Failed to save the note. Please try again.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setSaving(false);
    }
  };

  const deleteNote = async (noteId: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('notes_v2')
        .delete()
        .eq('id', noteId)
        .eq('user_id', user.id);

      if (error) throw error;

      setNotes(prev => prev.filter(note => note.id !== noteId));
      
      if (currentNote?.id === noteId) {
        setCurrentNote(null);
      }

      return true;
    } catch (error) {
      console.error('Error deleting note:', error);
      return false;
    }
  };

  return {
    notes,
    currentNote,
    setCurrentNote,
    loading,
    saving,
    createNote,
    saveNote,
    deleteNote,
    loadNotes,
  };
}
