
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
    const savedContent = localStorage.getItem("onlinenote-content");
    if (savedContent) {
      setContent(savedContent);
    } else {
      // Set a default welcome message with markdown examples
      setContent(`# Welcome to Online Note AI

This is a markdown-enabled editor. Try out some formatting:

## Formatting Examples
- **Bold text** using \`**bold**\`
- _Italic text_ using \`_italic_\`
- Create headings with \`# Heading 1\` or \`## Heading 2\`
- Make lists:
  1. Numbered lists
  2. Just use \`1. \` at the start
- Use \`- \` for bullet points
- > Add quotes with \`> \` at the start

Click the "Preview" button in the bottom right to see your formatted note.

Use the AI button in the toolbar to analyze, improve, or summarize your notes.`);
    }
  }, []);
  
  // Control auto-saving
  useEffect(() => {
    if (!content) return;
    
    const saveInterval = setInterval(() => {
      localStorage.setItem("onlinenote-content", content);
      setLastSaved(new Date());
    }, 5000); // Auto-save every 5 seconds

    return () => clearInterval(saveInterval);
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
  
  // Handle manual save with better error handling
  const handleSave = useCallback(async () => {
    try {
      localStorage.setItem("onlinenote-content", content);
      
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
    handleLoadNote,
    isAIDialogOpen,
    toggleAIDialog,
    setIsAIDialogOpen
  };
}
