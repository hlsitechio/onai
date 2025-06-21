
import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface UseEditorHandlersProps {
  content: string;
  currentNote: any;
  notes: any[];
  setCurrentNote: (note: any) => void;
  setContent: (content: string) => void;
  setLastSaved: (date: Date | null) => void;
  saveNote: (id: string, updates: any) => Promise<boolean>;
  createNote: (title?: string, content?: string) => Promise<any>;
  deleteNote: (id: string) => Promise<boolean>;
}

export function useEditorHandlers({
  content,
  currentNote,
  notes,
  setCurrentNote,
  setContent,
  setLastSaved,
  saveNote,
  createNote,
  deleteNote,
}: UseEditorHandlersProps) {
  const { toast } = useToast();

  const handleSave = useCallback(async () => {
    if (!currentNote) {
      // If no current note, create a new one
      const newNote = await createNote();
      if (newNote) {
        setCurrentNote(newNote);
        await saveNote(newNote.id, { content });
      }
      return;
    }

    // Improved content validation
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    const textContent = tempDiv.textContent || tempDiv.innerText || '';
    
    if (!textContent.trim() && content === '<p></p>') {
      toast({
        title: "Cannot save empty note",
        description: "Please add some content before saving.",
        variant: "destructive"
      });
      return;
    }

    try {
      const success = await saveNote(currentNote.id, { content });
      if (success) {
        setLastSaved(new Date());
        toast({
          title: "Note saved",
          description: "Your note has been saved successfully."
        });
      }
    } catch (error) {
      console.error('Save error:', error);
      toast({
        title: "Save failed",
        description: "Failed to save your note. Please try again.",
        variant: "destructive"
      });
    }
  }, [content, currentNote, saveNote, createNote, setCurrentNote, setLastSaved, toast]);

  const handleNoteLoad = useCallback((noteContent: string) => {
    setContent(noteContent);
  }, [setContent]);

  const handleDeleteNote = useCallback(async (noteId: string): Promise<boolean> => {
    try {
      const success = await deleteNote(noteId);
      if (success) {
        toast({
          title: "Note deleted",
          description: "The note has been deleted successfully."
        });
        
        // If we deleted the current note, select another one or create a new one
        if (currentNote?.id === noteId) {
          const remainingNotes = notes.filter(note => note.id !== noteId);
          if (remainingNotes.length > 0) {
            setCurrentNote(remainingNotes[0]);
            setContent(remainingNotes[0].content);
          } else {
            // Create a new note if no notes remain
            const newNote = await createNote();
            if (newNote) {
              setCurrentNote(newNote);
              setContent('');
            }
          }
        }
      }
      return success;
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: "Delete failed",
        description: "Failed to delete the note. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  }, [deleteNote, toast, currentNote, notes, setCurrentNote, setContent, createNote]);

  const createNewNote = useCallback(async () => {
    const newNote = await createNote();
    if (newNote) {
      setCurrentNote(newNote);
      setContent('');
      setLastSaved(null);
    }
  }, [createNote, setCurrentNote, setContent, setLastSaved]);

  const handleImportNotes = useCallback(async (importedNotes: Record<string, string>): Promise<boolean> => {
    try {
      // Convert imported notes to modern format and create them
      for (const [id, content] of Object.entries(importedNotes)) {
        await createNote('Imported Note', content);
      }
      
      toast({
        title: "Notes imported",
        description: `Successfully imported ${Object.keys(importedNotes).length} notes.`
      });
      return true;
    } catch (error) {
      console.error('Import error:', error);
      toast({
        title: "Import failed",
        description: "Failed to import notes. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  }, [createNote, toast]);

  return {
    handleSave,
    handleNoteLoad,
    handleDeleteNote,
    createNewNote,
    handleImportNotes,
  };
}
