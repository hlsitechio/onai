import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  saveNoteToSupabase, 
  getAllNotesFromSupabase, 
  deleteNoteFromSupabase,
  shareNoteViaSupabase,
  initializeSupabaseSchema
} from '@/utils/supabaseStorage';
import { v4 as uuidv4 } from 'uuid';

export function useAuthenticatedSupabaseNotes() {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [content, setContent] = useState<string>('');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isAIDialogOpen, setIsAIDialogOpen] = useState(false);
  const [currentNoteId, setCurrentNoteId] = useState<string | null>(null);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [allNotes, setAllNotes] = useState<Record<string, string>>({});
  const [isSupabaseReady, setIsSupabaseReady] = useState(false);
  
  // Add refs to prevent excessive polling
  const initializationComplete = useRef(false);
  const lastFetchTime = useRef<number>(0);
  const fetchCooldown = 5000; // 5 seconds minimum between fetches

  // Initialize Supabase schema when user is authenticated
  useEffect(() => {
    const initialize = async () => {
      if (authLoading || !user || initializationComplete.current) {
        if (!authLoading && !user) {
          setIsLoading(false);
        }
        return;
      }

      try {
        console.log('Initializing Supabase for authenticated user...');
        
        const result = await initializeSupabaseSchema();
        setIsSupabaseReady(result.success);
        initializationComplete.current = true;
        
        if (!result.success) {
          console.error('Failed to initialize Supabase schema:', result.error);
          toast({
            title: 'Database Connection Issue',
            description: 'Could not connect to the database. Please try refreshing.',
            variant: 'destructive',
          });
        } else {
          console.log('Supabase initialized successfully for user');
        }
      } catch (error) {
        console.error('Error initializing Supabase:', error);
        setIsSupabaseReady(false);
        initializationComplete.current = true;
        toast({
          title: 'Initialization Error',
          description: 'There was an error connecting to the database.',
          variant: 'destructive',
        });
      }
    };
    
    initialize();
  }, [user, authLoading, toast]);

  // Load content from Supabase when ready and authenticated
  useEffect(() => {
    const loadSavedNotes = async () => {
      if (!isSupabaseReady || !user || !initializationComplete.current) {
        setIsLoading(false);
        return;
      }

      // Prevent excessive API calls
      const now = Date.now();
      if (now - lastFetchTime.current < fetchCooldown) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      lastFetchTime.current = now;

      try {
        console.log('Loading notes for authenticated user...');
        
        const supabaseNotes = await getAllNotesFromSupabase();
        setAllNotes(supabaseNotes);
        
        const noteIds = Object.keys(supabaseNotes);
        
        if (noteIds.length > 0) {
          // Load the most recent note
          const mostRecentId = noteIds[0];
          setContent(supabaseNotes[mostRecentId]);
          setCurrentNoteId(mostRecentId);
          localStorage.setItem('onlinenote-last-edited-id', mostRecentId);
        } else {
          // Start with an empty editor
          setContent('');
          setCurrentNoteId(null);
        }
      } catch (error) {
        console.error('Error loading saved notes:', error);
        toast({
          title: 'Load Error',
          description: 'Failed to load your notes. Please try refreshing.',
          variant: 'destructive',
        });
        setContent('');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSavedNotes();
  }, [isSupabaseReady, user, toast]);
  
  // Handle auto-saving to localStorage as backup
  useEffect(() => {
    if (!content || !user) return;
    
    const saveInterval = setInterval(() => {
      localStorage.setItem('onlinenote-content', content);
      setLastSaved(new Date());
    }, 5000);

    return () => clearInterval(saveInterval);
  }, [content, user]);

  // Execute commands on the editor
  const execCommand = useCallback((command: string, value: string | null = null) => {
    if (!user) return;
    
    try {
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
            newText = beforeSelection + `<u>${selectedText}</u>` + afterSelection;
            newCursorPos = start + 3 + selectedText.length + 4;
            break;
          default:
            newText = activeElement.value;
            newCursorPos = end;
        }

        setContent(newText);
        
        setTimeout(() => {
          if (activeElement) {
            activeElement.focus();
            activeElement.setSelectionRange(newCursorPos, newCursorPos);
          }
        }, 0);
      } else {
        document.execCommand(command, false, value);
      }
    } catch (error) {
      console.error(`Error executing command ${command}:`, error);
    }
  }, [setContent, user]);
  
  // Handle manual save with persistence to Supabase
  const handleSave = useCallback(async () => {
    if (!user || !isSupabaseReady) {
      toast({
        title: 'Not authenticated',
        description: 'Please sign in to save your notes.',
        variant: 'destructive',
      });
      return;
    }

    try {
      localStorage.setItem('onlinenote-content', content);
      
      const noteId = currentNoteId || uuidv4();
      
      const result = await saveNoteToSupabase(noteId, content);
      
      if (!result.success) {
        throw new Error(result.error || 'Save failed');
      }
      
      setCurrentNoteId(noteId);
      setLastSaved(new Date());
      localStorage.setItem('onlinenote-last-edited-id', noteId);
      
      // Refresh the notes list with cooldown check
      const now = Date.now();
      if (now - lastFetchTime.current >= fetchCooldown) {
        lastFetchTime.current = now;
        const updatedNotes = await getAllNotesFromSupabase();
        setAllNotes(updatedNotes);
      }
      
      toast({
        title: 'Saved successfully',
        description: 'Your note has been saved to the cloud',
      });
    } catch (error) {
      console.error('Error saving note:', error);
      toast({
        title: 'Save failed',
        description: 'There was an error saving your note. Please try again.',
        variant: 'destructive',
      });
    }
  }, [content, toast, currentNoteId, isSupabaseReady, user]);

  // Handle sharing a note
  const handleShareNote = useCallback(async () => {
    if (!user || !isSupabaseReady) {
      toast({
        title: 'Not authenticated',
        description: 'Please sign in to share notes.',
        variant: 'destructive',
      });
      return null;
    }

    try {
      await handleSave();
      
      const shareResult = await shareNoteViaSupabase(content, 'link');
      
      if (shareResult.success && shareResult.shareUrl) {
        setShareUrl(shareResult.shareUrl);
        toast({
          title: 'Note shared',
          description: 'Share link has been created. You can now copy and share it.',
        });
        return shareResult.shareUrl;
      } else {
        throw new Error(shareResult.error || 'Share failed');
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
  }, [content, handleSave, toast, isSupabaseReady, user]);

  // Handle loading a note
  const handleLoadNote = useCallback((noteId: string, noteContent: string) => {
    if (!user) return;
    
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
  }, [toast, user]);

  // Handle deleting a note
  const handleDeleteNote = useCallback(async (noteId: string) => {
    if (!user || !isSupabaseReady) {
      toast({
        title: 'Not authenticated',
        description: 'Please sign in to delete notes.',
        variant: 'destructive',
      });
      return false;
    }

    try {
      const result = await deleteNoteFromSupabase(noteId);
      
      if (!result.success) {
        throw new Error(result.error || 'Delete failed');
      }
      
      if (currentNoteId === noteId) {
        localStorage.removeItem('onlinenote-last-edited-id');
      }
      
      // Refresh notes list with cooldown check
      const now = Date.now();
      if (now - lastFetchTime.current >= fetchCooldown) {
        lastFetchTime.current = now;
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
  }, [currentNoteId, toast, isSupabaseReady, user]);

  // Toggle AI dialog
  const toggleAIDialog = useCallback(() => {
    setIsAIDialogOpen(prev => !prev);
  }, []);

  // Create a new empty note
  const createNewNote = useCallback(() => {
    if (!user) return;
    
    setContent('');
    setCurrentNoteId(null);
    localStorage.removeItem('onlinenote-last-edited-id');
    localStorage.setItem('onlinenote-content', '');
    
    toast({
      title: 'New note created',
      description: 'Start typing to create your new note.',
    });
  }, [toast, user]);

  // Import notes functionality
  const importNotes = useCallback(async (importedNotes: Record<string, string>) => {
    if (!user || !isSupabaseReady) {
      toast({
        title: 'Not authenticated',
        description: 'Please sign in to import notes.',
        variant: 'destructive',
      });
      return false;
    }

    try {
      const mergedNotes = { ...allNotes };
      let importCount = 0;
      
      for (const [noteId, noteContent] of Object.entries(importedNotes)) {
        if (noteContent && typeof noteContent === 'string') {
          let finalNoteId = noteId;
          if (mergedNotes[noteId]) {
            finalNoteId = `${noteId}-imported-${Date.now()}`;
          }
          
          mergedNotes[finalNoteId] = noteContent;
          
          await saveNoteToSupabase(finalNoteId, noteContent);
          importCount++;
        }
      }
      
      setAllNotes(mergedNotes);
      
      toast({
        title: 'Notes imported successfully',
        description: `Imported ${importCount} notes`,
      });
      
      return true;
    } catch (error) {
      console.error('Error importing notes:', error);
      toast({
        title: 'Import failed',
        description: 'There was an error importing the notes.',
        variant: 'destructive',
      });
      return false;
    }
  }, [allNotes, isSupabaseReady, toast, user]);

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
    isLoading: isLoading || authLoading || !user,
    allNotes,
    createNewNote,
    isSupabaseReady: isSupabaseReady && !!user,
    importNotes,
    isAuthenticated: !!user && !authLoading
  };
}
