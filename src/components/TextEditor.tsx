
import React, { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { useIsMobileDevice } from "@/hooks/useIsMobileDevice";
import MobileLayout from "./mobile/MobileLayout";
import EditorLayout from "./editor/EditorLayout";
import EditorPanels from "./editor/EditorPanels";
import { useFocusModeManager } from "@/hooks/useFocusModeManager";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useSupabaseNotes } from "@/hooks/useSupabaseNotes";

const TextEditor = () => {
  const { toast } = useToast();
  const isMobileDevice = useIsMobileDevice();
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);
  const [isAISidebarOpen, setIsAISidebarOpen] = useState(true);
  
  // Focus mode management
  const { isFocusMode, setFocusMode, toggleFocusMode } = useFocusModeManager();
  
  // Use Supabase notes hook for proper save functionality
  const { 
    content, 
    setContent, 
    lastSaved, 
    execCommand, 
    handleSave, 
    handleLoadNote,
    handleDeleteNote,
    isAIDialogOpen,
    toggleAIDialog,
    setIsAIDialogOpen,
    allNotes,
    createNewNote,
    isSupabaseReady,
    importNotes
  } = useSupabaseNotes();
  
  // Create a wrapper function that matches the expected signature
  const handleNoteLoad = useCallback((content: string) => {
    setContent(content);
  }, [setContent]);
  
  // Handle import notes with proper integration
  const handleImportNotes = useCallback(async (importedNotes: Record<string, string>) => {
    try {
      const success = await importNotes(importedNotes);
      if (success) {
        toast({
          title: "Notes imported successfully",
          description: `Imported ${Object.keys(importedNotes).length} notes`
        });
      } else {
        toast({
          title: "Import failed",
          description: "Some notes could not be imported",
          variant: "destructive"
        });
      }
      return success;
    } catch (error) {
      console.error('Error importing notes:', error);
      toast({
        title: "Import error",
        description: "An error occurred while importing notes",
        variant: "destructive"
      });
      return false;
    }
  }, [importNotes, toast]);
  
  // Define regular functions for sidebar toggles
  const toggleLeftSidebar = () => {
    setIsLeftSidebarOpen(!isLeftSidebarOpen);
  };
  
  const toggleAISidebar = () => {
    setIsAISidebarOpen(!isAISidebarOpen);
  };
  
  const handleToggleFocusMode = () => {
    toggleFocusMode();
    // When entering focus mode, close both sidebars
    if (!isFocusMode) {
      setIsLeftSidebarOpen(false);
      setIsAISidebarOpen(false);
    }
  };
  
  // Setup keyboard shortcuts
  useKeyboardShortcuts({
    handleSave,
    toggleFocusMode: handleToggleFocusMode,
    toggleLeftSidebar,
    toggleAISidebar,
    isFocusMode,
    setFocusMode
  });

  // Convert lastSaved Date to string format for the toolbar
  const lastSavedString = lastSaved ? lastSaved.toISOString() : undefined;

  // Use mobile layout for mobile devices
  if (isMobileDevice) {
    return <MobileLayout />;
  }
  
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
        handleToggleFocusMode={handleToggleFocusMode}
        isAIDialogOpen={isAIDialogOpen}
        setIsAIDialogOpen={setIsAIDialogOpen}
      />
    </EditorLayout>
  );
};

export default TextEditor;
