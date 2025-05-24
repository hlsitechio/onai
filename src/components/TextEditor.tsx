
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
    isSupabaseReady
  } = useSupabaseNotes();
  
  // Create a wrapper function that matches the expected signature
  const handleNoteLoad = useCallback((content: string) => {
    setContent(content);
  }, [setContent]);
  
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
        "mx-auto px-1 sm:px-2 md:px-3 max-w-[90%] lg:max-w-[92%] xl:max-w-[94%] relative",
        isFocusMode ? "z-[101]" : "z-10"
      )}>
        <div className="flex flex-col md:flex-row gap-1 lg:gap-2 justify-center w-full">
          {/* Left sidebar - hidden in focus mode */}
          <div className={cn(
            "md:w-64 lg:w-72 shrink-0 mb-4 md:mb-0 transition-all duration-300 ease-in-out",
            isLeftSidebarOpen && !isFocusMode ? "opacity-100" : "opacity-0 max-w-0 md:max-w-0 overflow-hidden"
          )}>
            {isLeftSidebarOpen && !isFocusMode && (
              <div className="animate-fadeIn">
                <NotesSidebar 
                  currentContent={content} 
                  onLoadNote={handleNoteLoad}
                  onSave={handleSave}
                  onDeleteNote={handleDeleteNote}
                  editorHeight={0}
                  allNotes={allNotes}
                  onCreateNew={createNewNote}
                />
              </div>
            )}
          </div>
          
          {/* The editor container */}
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
          />
          
          {/* Right sidebar - hidden in focus mode */}
          <div className={cn(
            "md:w-64 lg:w-72 shrink-0 mb-4 md:mb-0 transition-all duration-300 ease-in-out",
            isAISidebarOpen && !isFocusMode ? "opacity-100" : "opacity-0 max-w-0 md:max-w-0 overflow-hidden"
          )}>
            {isAISidebarOpen && !isFocusMode && (
              <div className="animate-fadeIn">
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
