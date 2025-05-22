
import { useState, useEffect, useCallback } from "react";
import { saveNote } from "@/utils/notesStorage";
import { useToast } from "@/hooks/use-toast";

export function useNoteContent() {
  const { toast } = useToast();
  const [content, setContent] = useState<string>("");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isAIDialogOpen, setIsAIDialogOpen] = useState(false);
  
  // Load content from localStorage on initial render
  useEffect(() => {
    const savedContent = localStorage.getItem("noteflow-content");
    if (savedContent) {
      setContent(savedContent);
    }
  }, []);
  
  // Control auto-saving
  useEffect(() => {
    if (!content) return;
    
    const saveInterval = setInterval(() => {
      localStorage.setItem("noteflow-content", content);
      setLastSaved(new Date());
    }, 5000); // Auto-save every 5 seconds

    return () => clearInterval(saveInterval);
  }, [content]);

  // Execute commands on the editor with better handling
  const execCommand = useCallback((command: string, value: string | null = null) => {
    try {
      document.execCommand(command, false, value);
      
      // Special handling for formatting commands to make sure they work
      if (['bold', 'italic', 'underline'].includes(command)) {
        // Focus back on the editor after command execution
        setTimeout(() => {
          const selection = window.getSelection();
          if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            range.collapse(false); // Move cursor to end of selection
          }
        }, 0);
      }
    } catch (error) {
      console.error(`Error executing command ${command}:`, error);
    }
  }, []);
  
  // Handle manual save with better error handling
  const handleSave = useCallback(async () => {
    try {
      localStorage.setItem("noteflow-content", content);
      
      // Save to Chrome Storage with timestamp as ID
      const noteId = Date.now().toString();
      const result = await saveNote(noteId, content);
      
      setLastSaved(new Date());
      
      if (!result.success && result.error) {
        throw new Error(result.error);
      }
      
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
    }
  }, [content, toast]);

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
    localStorage.setItem("noteflow-content", noteContent);
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
    handleLoadNote,
    isAIDialogOpen,
    toggleAIDialog,
    setIsAIDialogOpen
  };
}
