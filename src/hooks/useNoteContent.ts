
import { useState, useEffect, useCallback } from "react";
import { saveNote, getAllNotes, shareNote } from "@/utils/notesStorage";
import { useToast } from "@/hooks/use-toast";

export function useNoteContent() {
  const { toast } = useToast();
  const [content, setContent] = useState<string>("");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isAIDialogOpen, setIsAIDialogOpen] = useState(false);
  const [currentNoteId, setCurrentNoteId] = useState<string | null>(null);
  const [shareUrl, setShareUrl] = useState<string | null>(null);

  // Clear any existing demo welcome text from localStorage on first load
  useEffect(() => {
    // Check if this is the first load by looking for a special flag
    const isFirstRun = !localStorage.getItem("onlinenote-initialized");
    if (isFirstRun) {
      // Clear any existing welcome text or demo content
      localStorage.removeItem("onlinenote-content");
      // Set the initialization flag to prevent clearing again
      localStorage.setItem("onlinenote-initialized", "true");
    }
  }, []);

  // Load content from storage with improved prioritization
  useEffect(() => {
    const loadSavedNotes = async () => {
      try {
        // First check if there's a last edited note ID in localStorage
        const lastEditedId = localStorage.getItem("onlinenote-last-edited-id");
        const currentContent = localStorage.getItem("onlinenote-content");
        
        // Get all saved notes
        const allNotes = await getAllNotes();
        const noteIds = Object.keys(allNotes);
        
        if (noteIds.length > 0) {
          // If we have saved notes, prioritize the last edited one
          if (lastEditedId && allNotes[lastEditedId]) {
            setContent(allNotes[lastEditedId]);
            setCurrentNoteId(lastEditedId);
          } else {
            // Otherwise use the most recent note (last in the array)
            const mostRecentId = noteIds[noteIds.length - 1];
            setContent(allNotes[mostRecentId]);
            setCurrentNoteId(mostRecentId);
            // Update the last edited ID
            localStorage.setItem("onlinenote-last-edited-id", mostRecentId);
          }
        } else if (currentContent) {
          // If no saved notes but we have content in localStorage, use that
          setContent(currentContent);
        } else {
          // Start with an empty editor
          setContent("");
        }
      } catch (error) {
        console.error("Error loading saved notes:", error);
        // Start with an empty editor even on errors
        setContent("");
      }
    };
    
    loadSavedNotes();
  }, []);
  
  // Control auto-saving and implement daily cache clearing
  useEffect(() => {
    if (!content) return;
    
    // Auto-save content to localStorage
    const saveInterval = setInterval(() => {
      localStorage.setItem("onlinenote-content", content);
      setLastSaved(new Date());
    }, 5000); // Auto-save every 5 seconds
    
    // Check for daily cache clearing
    const checkCacheClearing = () => {
      // Get the last clear date
      const lastClearDate = localStorage.getItem("onlinenote-last-clear-date");
      const currentDate = new Date().toDateString();
      
      // If no clear date or it's a different day, clear cache
      if (!lastClearDate || lastClearDate !== currentDate) {
        console.log('Daily cache clearing triggered');
        
        // Don't clear immediately during session - schedule for page close/refresh
        const shouldClearOnExit = localStorage.getItem("onlinenote-clear-on-exit") !== "true";
        if (shouldClearOnExit) {
          localStorage.setItem("onlinenote-clear-on-exit", "true");
        }
        
        // Update last clear date
        localStorage.setItem("onlinenote-last-clear-date", currentDate);
      }
    };
    
    // Run check immediately and then every hour
    checkCacheClearing();
    const clearCheckInterval = setInterval(checkCacheClearing, 3600000); // Check every hour
    
    // Setup beforeunload event for clearing on exit
    const handleBeforeUnload = () => {
      const shouldClearOnExit = localStorage.getItem("onlinenote-clear-on-exit") === "true";
      if (shouldClearOnExit) {
        // Save current note before clearing for emergency recovery
        const emergencyBackup = JSON.stringify({
          content,
          timestamp: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
        });
        localStorage.setItem("onlinenote-emergency-backup", emergencyBackup);
        
        // Clear all user notes except essential app settings
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('noteflow-') && !key.includes('settings') && !key.includes('init')) {
            localStorage.removeItem(key);
          }
        }
        
        // Clear the exit flag
        localStorage.removeItem("onlinenote-clear-on-exit");
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      clearInterval(saveInterval);
      clearInterval(clearCheckInterval);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [content]);

  // Execute commands on the editor with better handling for textarea
  const execCommand = useCallback((command: string, value: string | null = null) => {
    try {
      // Special handling for different commands with textarea
      // Since document.execCommand doesn't work with textareas directly
      // We need to manually update the content with the appropriate formatting

      // Get the active element to see if a textarea is focused
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
            // Just maintain the current text
            newText = activeElement.value;
            newCursorPos = end;
            break;
          case 'undo':
          case 'redo':
            // Let the browser handle these
            document.execCommand(command, false, value);
            return;
          default:
            // For other commands, we'll just maintain the text
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
  
  // Handle manual save with better error handling and persistence
  const handleSave = useCallback(async () => {
    // Skip if content is empty
    if (!content.trim()) {
      toast({
        title: "Nothing to save",
        description: "Please add some content to your note before saving."
      });
      return;
    }
    
    try {
      // Save to localStorage for immediate persistence
      localStorage.setItem("onlinenote-content", content);
      
      // Generate a new note ID or use the current one
      const noteId = currentNoteId || Date.now().toString();
      
      // Try multiple times in case of failure (improved reliability)
      let saveAttempts = 0;
      let result;
      
      while (saveAttempts < 3) {
        // Save the note with the ID
        result = await saveNote(noteId, content);
        
        if (result.success) break;
        saveAttempts++;
        await new Promise(resolve => setTimeout(resolve, 500)); // Wait before retry
      }
      
      if (!result || !result.success) {
        throw new Error(result?.error || "Failed to save after multiple attempts");
      }
      
      // Update the current note ID and last saved timestamp
      setCurrentNoteId(noteId);
      setLastSaved(new Date());
      
      // Store the last edited ID for future loads
      localStorage.setItem("onlinenote-last-edited-id", noteId);
      
      // Add security token to track legitimate saves
      const securityToken = Math.random().toString(36).substring(2, 15);
      localStorage.setItem("onlinenote-security-token", securityToken);
      
      toast({
        title: "Saved successfully",
        description: "Your note has been saved to storage",
      });
    } catch (error) {
      console.error("Error saving note:", error);
      toast({
        title: "Save failed",
        description: "There was an error saving your note. Please try again.",
        variant: "destructive",
      });
      
      // Create a secure backup in case of failure
      try {
        const secureBackup = JSON.stringify({
          content,
          timestamp: new Date().toISOString(),
          recoveryId: Math.random().toString(36).substring(2, 15)
        });
        localStorage.setItem("onlinenote-secure-backup", secureBackup);
      } catch (backupError) {
        console.error("Failed to create backup:", backupError);
      }
    }
  }, [content, toast, currentNoteId]);

  // Handle sharing a note with a simple hash-based system
  const handleShareNote = useCallback(async () => {
    try {
      // Make sure the note is saved first
      await handleSave();
      
      // Create a unique shareable hash for this note
      const result = await shareNote(content, 'device');
      
      if (result.success && result.shareUrl) {
        setShareUrl(result.shareUrl);
        toast({
          title: "Note shared",
          description: "Share link has been created. You can now copy and share it.",
        });
        return result.shareUrl;
      } else if (result.error) {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error sharing note:", error);
      toast({
        title: "Share failed",
        description: "There was an error creating a share link. Please try again.",
        variant: "destructive",
      });
      return null;
    }
  }, [content, handleSave, toast]);

  // Handle loading a note with validation
  const handleLoadNote = useCallback((noteContent: string) => {
    if (!noteContent) {
      toast({
        title: "Empty note",
        description: "Cannot load an empty note.",
        variant: "destructive",
      });
      return;
    }
    
    setContent(noteContent);
    localStorage.setItem("onlinenote-content", noteContent);
    toast({
      title: "Note loaded",
      description: "The note has been loaded into the editor.",
    });
  }, [toast]);

  // Toggle AI dialog
  const toggleAIDialog = useCallback(() => {
    setIsAIDialogOpen(prev => !prev);
  }, []);

  return {
    content,
    setContent,
    lastSaved,
    execCommand,
    handleSave,
    handleShareNote,
    shareUrl,
    handleLoadNote,
    isAIDialogOpen,
    toggleAIDialog,
    setIsAIDialogOpen,
    currentNoteId
  };
}
