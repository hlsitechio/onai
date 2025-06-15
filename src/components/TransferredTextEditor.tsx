
import React, { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useNotesManager } from '@/hooks/useNotesManager';
import { useSupabaseNotes } from '@/hooks/useSupabaseNotes';
import { useFocusModeManager } from '@/hooks/useFocusModeManager';
import EditorLayout from './editor/EditorLayout';
import EditorPanels from './editor/EditorPanels';

const TransferredTextEditor: React.FC = () => {
  const [content, setContent] = useState('');
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);
  const [isAISidebarOpen, setIsAISidebarOpen] = useState(false);
  const [isAIDialogOpen, setIsAIDialogOpen] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  const { toast } = useToast();
  const { isFocusMode, toggleFocusMode } = useFocusModeManager();
  
  const {
    allNotes,
    handleSave: saveNote,
    handleDeleteNote: deleteNote,
    importNotes
  } = useSupabaseNotes();

  // Auto-save functionality
  useEffect(() => {
    if (content.trim() && content !== '<p></p>') {
      const timer = setTimeout(() => {
        handleSave();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [content]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === 's') {
        event.preventDefault();
        handleSave();
      }
      
      if (event.key === 'F11') {
        event.preventDefault();
        toggleFocusMode();
      }
      
      if (event.ctrlKey && event.shiftKey && event.key === 'A') {
        event.preventDefault();
        setIsAIDialogOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [toggleFocusMode]);

  const handleSave = useCallback(async () => {
    if (!content.trim() || content === '<p></p>') {
      toast({
        title: "Nothing to save",
        description: "Your note is empty.",
        variant: "destructive"
      });
      return;
    }

    try {
      await saveNote(content);
      setLastSaved(new Date());
      toast({
        title: "Note saved",
        description: "Your note has been saved successfully."
      });
    } catch (error) {
      console.error('Save error:', error);
      toast({
        title: "Save failed",
        description: "Failed to save your note. Please try again.",
        variant: "destructive"
      });
    }
  }, [content, saveNote, toast]);

  const handleNoteLoad = useCallback((noteContent: string) => {
    setContent(noteContent);
  }, []);

  const handleDeleteNote = useCallback(async (noteId: string): Promise<boolean> => {
    try {
      await deleteNote(noteId);
      toast({
        title: "Note deleted",
        description: "The note has been deleted successfully."
      });
      return true;
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: "Delete failed",
        description: "Failed to delete the note. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  }, [deleteNote, toast]);

  const createNewNote = useCallback(() => {
    setContent('');
    setLastSaved(null);
  }, []);

  const handleImportNotes = useCallback(async (importedNotes: Record<string, string>): Promise<boolean> => {
    try {
      await importNotes(importedNotes);
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
  }, [importNotes, toast]);

  const execCommand = useCallback((command: string, value?: string | null) => {
    // This is mainly for compatibility - most formatting is handled by TiptapEditor
    console.log('Editor command:', command, value);
  }, []);

  const toggleLeftSidebar = useCallback(() => {
    setIsLeftSidebarOpen(prev => !prev);
  }, []);

  const toggleAISidebar = useCallback(() => {
    setIsAISidebarOpen(prev => !prev);
  }, []);

  const lastSavedString = lastSaved ? lastSaved.toISOString() : undefined;

  return (
    <EditorLayout isFocusMode={isFocusMode}>
      <EditorPanels
        isLeftSidebarOpen={isLeftSidebarOpen}
        isAISidebarOpen={isAISidebarOpen}
        isFocusMode={isFocusMode}
        content={content}
        setContent={setContent}
        handleNoteLoad={handleNoteLoad}
        handleSave={handleSave}
        handleDeleteNote={handleDeleteNote}
        allNotes={allNotes}
        createNewNote={createNewNote}
        handleImportNotes={handleImportNotes}
        execCommand={execCommand}
        toggleLeftSidebar={toggleLeftSidebar}
        toggleAISidebar={toggleAISidebar}
        lastSavedString={lastSavedString}
        handleToggleFocusMode={toggleFocusMode}
        isAIDialogOpen={isAIDialogOpen}
        setIsAIDialogOpen={setIsAIDialogOpen}
      />
    </EditorLayout>
  );
};

export default TransferredTextEditor;
