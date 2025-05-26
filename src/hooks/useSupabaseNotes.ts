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
import { decryptContent } from '@/utils/encryptionUtils';

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

  // Load content from Supabase with proper decryption handling
  useEffect(() => {
    const loadSavedNotes = async () => {
      setIsLoading(true);
      try {
        const lastEditedId = localStorage.getItem('onlinenote-last-edited-id');
        const currentContent = localStorage.getItem('onlinenote-content');
        
        // Decrypt local content if it's encrypted
        let decryptedLocalContent = currentContent;
        if (currentContent) {
          try {
            decryptedLocalContent = await decryptContent(currentContent);
          } catch (decryptError) {
            console.log('Local content is not encrypted or decryption failed, using as-is');
            decryptedLocalContent = currentContent;
          }
        }
        
        let supabaseNotes: Record<string, string> = {};
        if (isSupabaseReady) {
          supabaseNotes = await getAllNotesFromSupabase();
          setAllNotes(supabaseNotes);
        }
        
        const noteIds = Object.keys(supabaseNotes);
        
        if (noteIds.length > 0) {
          if (lastEditedId && supabaseNotes[lastEditedId]) {
            setContent(supabaseNotes[lastEditedId]);
            setCurrentNoteId(lastEditedId);
          } else {
            const mostRecentId = noteIds[0];
            setContent(supabaseNotes[mostRecentId]);
            setCurrentNoteId(mostRecentId);
            localStorage.setItem('onlinenote-last-edited-id', mostRecentId);
          }
        } else if (decryptedLocalContent) {
          setContent(decryptedLocalContent);
        } else {
          setContent('');
        }
      } catch (error) {
        console.error('Error loading saved notes:', error);
        setContent('');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (isSupabaseReady !== null) {
      loadSavedNotes();
    }
  }, [isSupabaseReady]);
  
  // Handle auto-saving to localStorage with encryption
  useEffect(() => {
    if (!content) return;
    
    const saveInterval = setInterval(() => {
      localStorage.setItem('onlinenote-content', content);
      setLastSaved(new Date());
    }, 5000);

    return () => clearInterval(saveInterval);
  }, [content]);

  // Execute commands on the editor
  const execCommand = useCallback((command: string, value: string | null = null) => {
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
          case 'justifyLeft':
          case 'justifyCenter':
          case 'justifyRight':
            newText = activeElement.value;
            newCursorPos = end;
            break;
          case 'undo':
          case 'redo':
            document.execCommand(command, false, value);
            return;
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
  }, [setContent]);
  
  // Handle manual save with Supabase integration
  const handleSave = useCallback(async () => {
    try {
      localStorage.setItem('onlinenote-content', content);
      
      const noteId = currentNoteId || uuidv4();
      
      let result: { success: boolean, error?: string } = { success: true, error: undefined };
      
      if (isSupabaseReady) {
        result = await saveNoteToSupabase(noteId, content, true); // Enable encryption
      }
      
      setCurrentNoteId(noteId);
      setLastSaved(new Date());
      localStorage.setItem('onlinenote-last-edited-id', noteId);
      
      if (!result.success && result.error) {
        throw new Error(result.error);
      }
      
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
      await handleSave();
      
      let shareResult;
      
      if (isSupabaseReady) {
        shareResult = await shareNoteViaSupabase(content, 'link');
      } else {
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
      return null;
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
      
      if (currentNoteId === noteId) {
        localStorage.removeItem('onlinenote-last-edited-id');
      }
      
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

  // Import notes functionality
  const importNotes = useCallback(async (importedNotes: Record<string, string>) => {
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
          
          if (isSupabaseReady) {
            await saveNoteToSupabase(finalNoteId, noteContent, true); // Enable encryption
          }
          
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
  }, [allNotes, isSupabaseReady, toast]);

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
    isSupabaseReady,
    importNotes
  };
}
