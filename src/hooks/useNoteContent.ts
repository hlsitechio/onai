
import { useState, useEffect } from "react";
import { saveNote } from "@/utils/notesStorage";
import { useToast } from "@/hooks/use-toast";

export function useNoteContent() {
  const { toast } = useToast();
  const [content, setContent] = useState<string>(localStorage.getItem("noteflow-content") || "");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  // Control auto-saving
  useEffect(() => {
    const saveInterval = setInterval(() => {
      if (content) {
        localStorage.setItem("noteflow-content", content);
        setLastSaved(new Date());
      }
    }, 5000); // Auto-save every 5 seconds

    return () => clearInterval(saveInterval);
  }, [content]);

  // Execute commands on the editor
  const execCommand = (command: string, value: string | null = null) => {
    document.execCommand(command, false, value);
  };
  
  // Handle manual save
  const handleSave = async () => {
    localStorage.setItem("noteflow-content", content);
    
    // Save to Chrome Storage with timestamp as ID
    const noteId = Date.now().toString();
    await saveNote(noteId, content);
    
    setLastSaved(new Date());
    toast({
      title: "Saved successfully",
      description: "Your note has been saved to Chrome Storage",
    });
  };

  // Handle loading a note
  const handleLoadNote = (noteContent: string) => {
    setContent(noteContent);
    localStorage.setItem("noteflow-content", noteContent);
  };

  return {
    content,
    setContent,
    lastSaved,
    execCommand,
    handleSave,
    handleLoadNote
  };
}
