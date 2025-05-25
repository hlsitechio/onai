
import React, { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { useIsMobileDevice } from "@/hooks/useIsMobileDevice";
import MobileLayout from "./mobile/MobileLayout";
import NotesSidebar from "./NotesSidebar";
import AISidebar from "./notes/AISidebar";
import EditorContainer from "./editor/EditorContainer";
import FocusModeOverlay from "./editor/FocusModeOverlay";
import { cn } from "@/lib/utils";
import { useFocusModeManager } from "@/hooks/useFocusModeManager";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useSupabaseNotes } from "@/hooks/useSupabaseNotes";
import { useEditorContainerState } from "@/hooks/useEditorContainerState";

const TextEditor = () => {
  const { toast } = useToast();
  const isMobileDevice = useIsMobileDevice();
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);
  const [isAISidebarOpen, setIsAISidebarOpen] = useState(true);
  
  // Focus mode management
  const { isFocusMode, setFocusMode, toggleFocusMode } = useFocusModeManager();
  
  // AI Agent state
  const { isAIAgentVisible, toggleAIAgent } = useEditorContainerState();
  
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

  // Use mobile layout for mobile devices
  if (isMobileDevice) {
    return <MobileLayout />;
  }
  
  return (
    <section id="editor-section" className={cn(
      "pt-0 pb-4 sm:pb-6 px-3 relative transition-all duration-500 min-h-screen w-full overflow-hidden border-0"
    )}>
      {/* Enhanced focus mode overlay */}
      <FocusModeOverlay isFocusMode={isFocusMode} />
      
      <div className={cn(
        "mx-auto px-1 sm:px-2 md:px-3 max-w-full relative h-full",
        isFocusMode ? "z-[101]" : "z-10"
      )}>
        <div className="flex flex-col md:flex-row gap-1 lg:gap-2 justify-center w-full h-full">
          {/* Left sidebar - equal width panel (1/3) with fixed height */}
          <div className={cn(
            "shrink-0 mb-4 md:mb-0 transition-all duration-300 ease-in-out",
            isLeftSidebarOpen && !isFocusMode 
              ? "opacity-100 w-full md:w-1/3" 
              : "opacity-0 w-0 overflow-hidden"
          )}>
            {isLeftSidebarOpen && !isFocusMode && (
              <div className="animate-fadeIn h-full">
                <NotesSidebar 
                  currentContent={content} 
                  onLoadNote={handleNoteLoad}
                  onSave={handleSave}
                  onDeleteNote={handleDeleteNote}
                  editorHeight={0}
                  allNotes={allNotes}
                  onCreateNew={createNewNote}
                  onImportNotes={handleImportNotes}
                />
              </div>
            )}
          </div>
          
          {/* The editor container - equal width panel (1/3) when both sidebars open with fixed height */}
          <div className={cn(
            "transition-all duration-300 ease-in-out",
            // When both sidebars are open, all panels take 1/3 width
            isLeftSidebarOpen && isAISidebarOpen && !isFocusMode && "w-full md:w-1/3",
            // When only one sidebar is open, editor takes 2/3 width  
            ((isLeftSidebarOpen && !isAISidebarOpen) || (!isLeftSidebarOpen && isAISidebarOpen)) && !isFocusMode && "w-full md:w-2/3",
            // When no sidebars are open or in focus mode, editor takes full width
            ((!isLeftSidebarOpen && !isAISidebarOpen) || isFocusMode) && "w-full"
          )}>
            <EditorContainer
              content={content}
              setContent={setContent}
              execCommand={execCommand}
              handleSave={handleSave}
              toggleLeftSidebar={toggleLeftSidebar}
              toggleAISidebar={toggleAISidebar}
              isLeftSidebarOpen={isLeftSidebarOpen}
              isAISidebarOpen={isAISidebarOpen}
              lastSaved={lastSaved}
              isFocusMode={isFocusMode}
              toggleFocusMode={handleToggleFocusMode}
              isAIDialogOpen={isAIDialogOpen}
              setIsAIDialogOpen={setIsAIDialogOpen}
              onToggleAIAgent={toggleAIAgent}
              isAIAgentVisible={isAIAgentVisible}
            />
          </div>
          
          {/* Right sidebar - equal width panel (1/3) with fixed height */}
          <div className={cn(
            "shrink-0 mb-4 md:mb-0 transition-all duration-300 ease-in-out",
            isAISidebarOpen && !isFocusMode 
              ? "opacity-100 w-full md:w-1/3" 
              : "opacity-0 w-0 overflow-hidden"
          )}>
            {isAISidebarOpen && !isFocusMode && (
              <div className="animate-fadeIn h-full">
                <AISidebar
                  content={content}
                  onApplyChanges={setContent}
                  editorHeight={0}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TextEditor;
