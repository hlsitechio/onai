
import React, { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { useIsMobileDevice } from "@/hooks/useIsMobileDevice";
import MobileLayout from "./mobile/MobileLayout";
import NotesSidebar from "./NotesSidebar";
import AISidebar from "./notes/AISidebar";
import EditorContainer from "./editor/EditorContainer";
import FocusModeOverlay from "./editor/FocusModeOverlay";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "./ui/resizable";
import { cn } from "@/lib/utils";
import { useFocusModeManager } from "@/hooks/useFocusModeManager";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useSupabaseNotes } from "@/hooks/useSupabaseNotes";
import "../styles/rotating-border.css";

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
    <section id="editor-section" className={cn(
      "pt-0 pb-4 sm:pb-6 px-3 relative transition-all duration-500 min-h-screen w-full overflow-hidden border-0"
    )}>
      {/* Enhanced focus mode overlay */}
      <FocusModeOverlay isFocusMode={isFocusMode} />
      
      <div className={cn(
        "mx-auto px-1 sm:px-2 md:px-3 w-full relative h-full",
        isFocusMode ? "z-[101]" : "z-10"
      )}>
        {/* Rotating border container - only contains the glow and border */}
        <div className={cn(
          "relative w-full", // Position for glow and full width
          isFocusMode && "focus-mode"
        )}>
          {/* Glow effect positioned behind */}
          <div className={cn(
            "rotating-border-glow rotating-border-pulse",
            isFocusMode && "focus-mode"
          )}></div>
          
          {/* Main container with rotating border */}
          <div className={cn(
            "rotating-border-container relative w-full",
            isFocusMode && "focus-mode"
          )}>
            {/* Inner content - this prevents border from covering content */}
            <div className="rotating-border-inner w-full">
              <div className="w-full h-[80vh] md:h-[85vh] lg:h-[90vh] p-3 md:p-4 lg:p-6">
                {/* Resizable Panel Group with enhanced handles */}
                <ResizablePanelGroup 
                  direction="horizontal" 
                  className="h-full rounded-lg border border-white/10"
                >
                  {/* Left sidebar - Notes */}
                  {isLeftSidebarOpen && !isFocusMode && (
                    <>
                      <ResizablePanel defaultSize={25} minSize={15} maxSize={45} className="min-w-[200px]">
                        <div className="h-full animate-fadeIn">
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
                      </ResizablePanel>
                      <ResizableHandle 
                        withHandle 
                        className="w-2 bg-white/5 hover:bg-white/10 transition-colors border-l border-r border-white/10 group"
                      />
                    </>
                  )}
                  
                  {/* The editor container - center panel */}
                  <ResizablePanel 
                    defaultSize={isFocusMode || (!isLeftSidebarOpen && !isAISidebarOpen) ? 100 : 50}
                    minSize={25}
                  >
                    <EditorContainer
                      content={content}
                      setContent={setContent}
                      execCommand={execCommand}
                      handleSave={handleSave}
                      toggleLeftSidebar={toggleLeftSidebar}
                      toggleAISidebar={toggleAISidebar}
                      isLeftSidebarOpen={isLeftSidebarOpen}
                      isAISidebarOpen={isAISidebarOpen}
                      lastSaved={lastSavedString}
                      isFocusMode={isFocusMode}
                      toggleFocusMode={handleToggleFocusMode}
                      isAIDialogOpen={isAIDialogOpen}
                      setIsAIDialogOpen={setIsAIDialogOpen}
                    />
                  </ResizablePanel>
                  
                  {/* Right sidebar - AI Assistant */}
                  {isAISidebarOpen && !isFocusMode && (
                    <>
                      <ResizableHandle 
                        withHandle 
                        className="w-2 bg-white/5 hover:bg-white/10 transition-colors border-l border-r border-white/10 group"
                      />
                      <ResizablePanel defaultSize={25} minSize={15} maxSize={45} className="min-w-[200px]">
                        <div className="h-full animate-fadeIn">
                          <AISidebar
                            content={content}
                            onApplyChanges={setContent}
                            editorHeight={0}
                          />
                        </div>
                      </ResizablePanel>
                    </>
                  )}
                </ResizablePanelGroup>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TextEditor;
