
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { 
  saveNoteSecurely, 
  getAllNotesSecurely, 
  deleteNoteSecurely
} from '@/utils/enhancedSupabaseStorage';
import { checkContentSecurity } from '@/utils/securityValidation';
import { v4 as uuidv4 } from 'uuid';

export function useSecureNotesManager() {
  const { toast } = useToast();
  const [content, setContent] = useState<string>('');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [currentNoteId, setCurrentNoteId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [allNotes, setAllNotes] = useState<Record<string, string>>({});

  // Load notes with security validation
  useEffect(() => {
    const loadSavedNotes = async () => {
      setIsLoading(true);
      try {
        const notes = await getAllNotesSecurely();
        setAllNotes(notes);
        
        const noteIds = Object.keys(notes);
        if (noteIds.length > 0) {
          const mostRecentId = noteIds[0];
          setContent(notes[mostRecentId]);
          setCurrentNoteId(mostRecentId);
        }
      } catch (error) {
        console.error('Error loading notes:', error);
        toast({
          title: 'Error Loading Notes',
          description: 'There was an error loading your notes. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSavedNotes();
  }, [toast]);

  // Save note with enhanced security
  const handleSave = useCallback(async () => {
    try {
      // Validate content before saving
      const securityCheck = checkContentSecurity(content);
      if (!securityCheck.isValid) {
        toast({
          title: 'Content Validation Failed',
          description: securityCheck.error || 'Content contains invalid or unsafe elements',
          variant: 'destructive',
        });
        return;
      }

      const noteId = currentNoteId || uuidv4();
      const result = await saveNoteSecurely(noteId, content, true);
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      setCurrentNoteId(noteId);
      setLastSaved(new Date());
      
      // Refresh notes list
      const updatedNotes = await getAllNotesSecurely();
      setAllNotes(updatedNotes);
      
      toast({
        title: 'Note Saved Successfully',
        description: 'Your note has been securely saved to the cloud',
      });
    } catch (error) {
      console.error('Error saving note:', error);
      toast({
        title: 'Save Failed',
        description: 'There was an error saving your note. Please try again.',
        variant: 'destructive',
      });
    }
  }, [content, currentNoteId, toast]);

  // Delete note with security checks
  const handleDeleteNote = useCallback(async (noteId: string) => {
    try {
      const result = await deleteNoteSecurely(noteId);
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      // Remove from local storage if it's the current note
      if (currentNoteId === noteId) {
        setContent('');
        setCurrentNoteId(null);
      }
      
      // Refresh notes list
      const updatedNotes = await getAllNotesSecurely();
      setAllNotes(updatedNotes);
      
      toast({
        title: 'Note Deleted',
        description: 'The note has been permanently deleted.',
      });
      
      return true;
    } catch (error) {
      console.error('Error deleting note:', error);
      toast({
        title: 'Delete Failed',
        description: 'There was an error deleting the note. Please try again.',
        variant: 'destructive',
      });
      return false;
    }
  }, [currentNoteId, toast]);

  // Load a specific note with security validation
  const handleLoadNote = useCallback((noteId: string, noteContent: string) => {
    const securityCheck = checkContentSecurity(noteContent);
    if (!securityCheck.isValid) {
      toast({
        title: 'Security Warning',
        description: 'This note contains potentially unsafe content and cannot be loaded.',
        variant: 'destructive',
      });
      return;
    }
    
    setContent(noteContent);
    setCurrentNoteId(noteId);
    
    toast({
      title: 'Note Loaded',
      description: 'The note has been securely loaded into the editor.',
    });
  }, [toast]);

  // Create a new note
  const createNewNote = useCallback(() => {
    setContent('');
    setCurrentNoteId(null);
    
    toast({
      title: 'New Note Created',
      description: 'Start typing to create your new secure note.',
    });
  }, [toast]);

  return {
    content,
    setContent,
    lastSaved,
    handleSave,
    handleLoadNote,
    handleDeleteNote,
    currentNoteId,
    isLoading,
    allNotes,
    createNewNote
  };
}
