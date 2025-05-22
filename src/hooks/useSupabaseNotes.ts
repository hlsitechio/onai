import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { 
  saveNoteToSupabase, 
  getAllNotesFromSupabase, 
  deleteNoteFromSupabase,
  shareNoteViaSupabase,
  initializeSupabaseSchema
} from '@/utils/supabaseStorage';
import { v4 as uuidv4 } from 'uuid';

export function useSupabaseNotes() {
  const { toast } = useToast();
  const [content, setContent] = useState<string>('');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isAIDialogOpen, setIsAIDialogOpen] = useState(false);
  const [currentNoteId, setCurrentNoteId] = useState<string | null>(null);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [allNotes, setAllNotes] = useState<Record<string, string>>({});
  const [isSupabaseReady, setIsSupabaseReady] = useState(false);

  // Initialize Supabase schema on first load
  useEffect(() => {
    const initialize = async () => {
      try {
        const result = await initializeSupabaseSchema();
        setIsSupabaseReady(result.success);
        
        if (!result.success) {
          console.error('Failed to initialize Supabase schema:', result.error);
          toast({
            title: 'Supabase Initialization Error',
            description: 'Could not connect to the database. Using local storage instead.',
            variant: 'destructive',
          });
        }
      } catch (error) {
        console.error('Error initializing Supabase:', error);
        setIsSupabaseReady(false);
      }
    };
    
    initialize();
  }, [toast]);

  // Load content from Supabase with fallback to local storage
  useEffect(() => {
    const loadSavedNotes = async () => {
      setIsLoading(true);
      try {
        // First check if there's a last edited note ID in localStorage
        const lastEditedId = localStorage.getItem('onlinenote-last-edited-id');
        const currentContent = localStorage.getItem('onlinenote-content');
        
        // Try to get notes from Supabase if it's ready
        let supabaseNotes: Record<string, string> = {};
        if (isSupabaseReady) {
          supabaseNotes = await getAllNotesFromSupabase();
          setAllNotes(supabaseNotes);
        }
        
        const noteIds = Object.keys(supabaseNotes);
        
        if (noteIds.length > 0) {
          // If we have saved notes, prioritize the last edited one
          if (lastEditedId && supabaseNotes[lastEditedId]) {
            setContent(supabaseNotes[lastEditedId]);
            setCurrentNoteId(lastEditedId);
          } else {
            // Otherwise use the most recent note (first in the array since they're sorted by updated_at DESC)
            const mostRecentId = noteIds[0];
            setContent(supabaseNotes[mostRecentId]);
            setCurrentNoteId(mostRecentId);
            // Update the last edited ID
            localStorage.setItem('onlinenote-last-edited-id', mostRecentId);
          }
        } else if (currentContent) {
          // If no saved notes but we have content in localStorage, use that
          setContent(currentContent);
        } else {
          // Start with an empty editor
          setContent('');
        }
      } catch (error) {
        console.error('Error loading saved notes:', error);
        // Start with an empty editor even on errors
        setContent('');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (isSupabaseReady) {
      loadSavedNotes();
    }
  }, [isSupabaseReady]);
  
  // Handle auto-saving to localStorage
  useEffect(() => {
    if (!content) return;
    
    const saveInterval = setInterval(() => {
      localStorage.setItem('onlinenote-content', content);
      setLastSaved(new Date());
    }, 5000); // Auto-save to localStorage every 5 seconds

    return () => clearInterval(saveInterval);
  }, [content]);

  // Execute commands on the editor (same as in useNoteContent)
  const execCommand = useCallback((command: string, value: string | null = null) => {
    try {
      // Special handling for different commands with textarea
      const activeElement = document.activeElement as HTMLTextAreaElement;
      const isTextarea = activeElement && activeElement.tagName === 'TEXTAREA';

      if (isTextarea) {
        const start = activeElement.selectionStart || 0;
        const end = activeElement.selectionEnd || 0;
        const selectedText = activeElement.value.substring(start, end);
        const beforeSelection = activeElement.value.substring(0, start);
        const afterSelection = activeElement.value.substring(end);
        
        let newText = '';
        let newCursorPos = start;

        // Handle markdown formatting commands
        switch(command) {
          case 'bold':
            newText = beforeSelection + `**${selectedText}**` + afterSelection;
            newCursorPos = start + 2 + selectedText.length + 2;
            break;
          case 'italic':
            newText = beforeSelection + `_${selectedText}_` + afterSelection;
            newCursorPos = start + 1 + selectedText.length + 1;
            break;
          case 'underline':
            // No direct markdown for underline, using HTML
            newText = beforeSelection + `<u>${selectedText}</u>` + afterSelection;
            newCursorPos = start + 3 + selectedText.length + 4;
            break;
          case 'justifyLeft':
          case 'justifyCenter':
          case 'justifyRight':
            // For alignment, we can't really do this in markdown easily
            newText = activeElement.value;
            newCursorPos = end;
            break;
          case 'undo':
          case 'redo':
            // Let the browser handle these
            document.execCommand(command, false, value);
            return;
          default:
            // For other commands, maintain the text
            newText = activeElement.value;
            newCursorPos = end;
        }

        // Update the content
        setContent(newText);
        
        // Set the cursor position after formatting
        setTimeout(() => {
          if (activeElement) {
            activeElement.focus();
            activeElement.setSelectionRange(newCursorPos, newCursorPos);
          }
        }, 0);
      } else {
        // Fallback to document.execCommand for contentEditable elements
        document.execCommand(command, false, value);
      }
    } catch (error) {
      console.error(`Error executing command ${command}:`, error);
    }
  }, [setContent]);
  
  // Handle manual save with persistence to Supabase
  const handleSave = useCallback(async () => {
    try {
      // Always save to localStorage as a backup
      localStorage.setItem('onlinenote-content', content);
      
      // Generate a new note ID or use the current one
      const noteId = currentNoteId || uuidv4();
      
      let result = { success: true };
      
      // If Supabase is ready, save there
      if (isSupabaseReady) {
        result = await saveNoteToSupabase(noteId, content);
      }
      
      // Update the current note ID and last saved timestamp
      setCurrentNoteId(noteId);
      setLastSaved(new Date());
      
      // Store the last edited ID for future loads
      localStorage.setItem('onlinenote-last-edited-id', noteId);
      
      if (!result.success && result.error) {
        throw new Error(result.error);
      }
      
      // Refresh the notes list
      if (isSupabaseReady) {
        const updatedNotes = await getAllNotesFromSupabase();
        setAllNotes(updatedNotes);
      }
      
      toast({
        title: 'Saved successfully',
        description: isSupabaseReady 
          ? 'Your note has been saved to the cloud'
          : 'Your note has been saved locally',
      });
    } catch (error) {
      console.error('Error saving note:', error);
      toast({
        title: 'Save failed',
        description: 'There was an error saving your note. Please try again.',
        variant: 'destructive',
      });
    }
  }, [content, toast, currentNoteId, isSupabaseReady]);

  // Handle sharing a note
  const handleShareNote = useCallback(async () => {
    try {
      // Make sure the note is saved first
      await handleSave();
      
      let shareResult;
      
      if (isSupabaseReady) {
        // Use Supabase for sharing
        shareResult = await shareNoteViaSupabase(content, 'link');
      } else {
        // Use local device download as fallback
        shareResult = await shareNoteViaSupabase(content, 'device');
      }
      
      if (shareResult.success && shareResult.shareUrl) {
        setShareUrl(shareResult.shareUrl);
        toast({
          title: 'Note shared',
          description: 'Share link has been created. You can now copy and share it.',
        });
        return shareResult.shareUrl;
      } else if (shareResult.error) {
        throw new Error(shareResult.error);
      }
    } catch (error) {
      console.error('Error sharing note:', error);
      toast({
        title: 'Share failed',
        description: 'There was an error creating a share link. Please try again.',
        variant: 'destructive',
      });
      return null;
    }
  }, [content, handleSave, toast, isSupabaseReady]);

  // Handle loading a note
  const handleLoadNote = useCallback((noteId: string, noteContent: string) => {
    if (!noteContent) {
      toast({
        title: 'Empty note',
        description: 'Cannot load an empty note.',
        variant: 'destructive',
      });
      return;
    }
    
    setContent(noteContent);
    setCurrentNoteId(noteId);
    localStorage.setItem('onlinenote-content', noteContent);
    localStorage.setItem('onlinenote-last-edited-id', noteId);
    
    toast({
      title: 'Note loaded',
      description: 'The note has been loaded into the editor.',
    });
  }, [toast]);

  // Handle deleting a note
  const handleDeleteNote = useCallback(async (noteId: string) => {
    try {
      if (isSupabaseReady) {
        const result = await deleteNoteFromSupabase(noteId);
        
        if (!result.success && result.error) {
          throw new Error(result.error);
        }
      }
      
      // Remove from local storage if it's the current note
      if (currentNoteId === noteId) {
        localStorage.removeItem('onlinenote-last-edited-id');
        // Don't clear content if it's the active note - user might want to save it with a new ID
      }
      
      // Refresh notes list
      if (isSupabaseReady) {
        const updatedNotes = await getAllNotesFromSupabase();
        setAllNotes(updatedNotes);
      }
      
      toast({
        title: 'Note deleted',
        description: 'The note has been permanently deleted.',
      });
      
      return true;
    } catch (error) {
      console.error('Error deleting note:', error);
      toast({
        title: 'Delete failed',
        description: 'There was an error deleting the note. Please try again.',
        variant: 'destructive',
      });
      return false;
    }
  }, [currentNoteId, toast, isSupabaseReady]);

  // Toggle AI dialog
  const toggleAIDialog = useCallback(() => {
    setIsAIDialogOpen(prev => !prev);
  }, []);

  // Create a new empty note
  const createNewNote = useCallback(() => {
    setContent('');
    setCurrentNoteId(null);
    localStorage.removeItem('onlinenote-last-edited-id');
    localStorage.setItem('onlinenote-content', '');
    
    toast({
      title: 'New note created',
      description: 'Start typing to create your new note.',
    });
  }, [toast]);

  return {
    content,
    setContent,
    lastSaved,
    execCommand,
    handleSave,
    handleShareNote,
    shareUrl,
    handleLoadNote,
    handleDeleteNote,
    isAIDialogOpen,
    toggleAIDialog,
    setIsAIDialogOpen,
    currentNoteId,
    isLoading,
    allNotes,
    createNewNote,
    isSupabaseReady
  };
}
