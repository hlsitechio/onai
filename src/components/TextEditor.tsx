
import React, { useState, useRef, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import NotesSidebar from "./NotesSidebar";
import AdBanner from "./AdBanner";
import TextEditorToolbar from "./TextEditorToolbar";
import EditableContent from "./EditableContent";
import AIDialog from "./notes/AIDialog";
import AISidebar from "./notes/AISidebar";
import { cn } from "@/lib/utils";
import { useFocusMode } from "@/contexts";
import { useSupabaseNotes } from "@/hooks/useSupabaseNotes";

const TextEditor = () => {
  const { toast } = useToast();
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);
  const [isAISidebarOpen, setIsAISidebarOpen] = useState(true);
  const { isFocusMode, setFocusMode } = useFocusMode();
  
  // Update document data attribute when focus mode changes
  useEffect(() => {
    document.body.setAttribute('data-focus-mode', isFocusMode.toString());
    
    // Prevent scrolling in focus mode
    if (isFocusMode) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isFocusMode]);
  
  const editorRef = useRef<HTMLDivElement>(null);
  const [editorHeight, setEditorHeight] = useState<number>(0);
  
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
  
  // Update editor height for sidebar matching
  useEffect(() => {
    if (editorRef.current) {
      const updateEditorHeight = () => {
        const height = editorRef.current?.getBoundingClientRect().height || 0;
        setEditorHeight(height);
      };
      
      updateEditorHeight();
      window.addEventListener('resize', updateEditorHeight);
      
      // Update height on content changes too
      const observer = new MutationObserver(updateEditorHeight);
      observer.observe(editorRef.current, { 
        childList: true, 
        subtree: true,
        characterData: true
      });
      
      return () => {
        window.removeEventListener('resize', updateEditorHeight);
        observer.disconnect();
      };
    }
  }, [editorRef, content]);
  
  // Define all hooks first, before any regular functions
  const handleKeyboardShortcut = useCallback((e: KeyboardEvent) => {
    // Ctrl+S for save
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      handleSave();
    }
    
    // F11 for focus mode
    if (e.key === 'F11') {
      e.preventDefault();
      toggleFocusMode();
    }
    
    // Ctrl+B for sidebar toggle
    if (e.ctrlKey && e.key === 'b') {
      e.preventDefault();
      toggleLeftSidebar();
    }
    
    // Ctrl+G for AI sidebar
    if (e.ctrlKey && e.key === 'g') {
      e.preventDefault();
      toggleAISidebar();
    }
    
    // Escape to exit focus mode
    if (e.key === 'Escape' && isFocusMode) {
      e.preventDefault();
      setFocusMode(false);
    }
  }, [handleSave, isFocusMode]);
  
  // Register the keyboard shortcut effect
  useEffect(() => {
    window.addEventListener('keydown', handleKeyboardShortcut);
    return () => window.removeEventListener('keydown', handleKeyboardShortcut);
  }, [handleKeyboardShortcut]);
  
  // Define regular functions after all hooks
  const toggleLeftSidebar = () => {
    setIsLeftSidebarOpen(!isLeftSidebarOpen);
  };
  
  const toggleAISidebar = () => {
    setIsAISidebarOpen(!isAISidebarOpen);
  };
  
  const toggleFocusMode = () => {
    setFocusMode(!isFocusMode);
    // When entering focus mode, close both sidebars
    if (!isFocusMode) {
      setIsLeftSidebarOpen(false);
      setIsAISidebarOpen(false);
    }
  };
  
  return (
    <section id="editor-section" className={cn(
      "pt-0 pb-4 sm:pb-6 px-3 relative transition-all duration-500 min-h-screen w-full overflow-hidden border-0"
    )}>
      {/* Enhanced focus mode overlay */}
      {isFocusMode && (
        <>
          {/* Full page blur overlay */}
          <div className="fixed inset-0 z-[100] pointer-events-none">
            {/* Black overlay with blur */}
            <div className="absolute inset-0 bg-black/95 backdrop-blur-2xl"></div>
            
            {/* Subtle animated gradients for depth */}
            <div className="absolute top-1/4 -left-[10%] w-[30%] h-[30%] rounded-full bg-gradient-to-r from-purple-900/20 to-blue-900/10 blur-[100px] animate-pulse"></div>
            <div className="absolute bottom-1/4 -right-[10%] w-[25%] h-[25%] rounded-full bg-gradient-to-l from-purple-800/15 to-pink-900/10 blur-[80px] animate-pulse"></div>
          </div>
        </>
      )}
      
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
                  editorHeight={editorHeight}
                  allNotes={allNotes}
                  onCreateNew={createNewNote}
                />
              </div>
            )}
          </div>
          
          {/* The editor with enhanced focus mode styling */}
          <div className="flex-1 flex flex-col min-w-0 md:min-w-0 lg:min-w-0 xl:min-w-0 max-w-full mx-auto">
            <div 
              ref={editorRef}
              className={cn(
                "rounded-xl overflow-hidden flex flex-col transition-all duration-500",
                isFocusMode 
                  ? "shadow-[0_0_80px_rgba(147,51,234,0.4)] ring-2 ring-purple-500/30 bg-black/80 backdrop-blur-xl" 
                  : "bg-black/30 backdrop-blur-lg"
              )}
            >
              {/* Toolbar */}
              <TextEditorToolbar 
                execCommand={execCommand}
                handleSave={handleSave}
                toggleSidebar={toggleLeftSidebar}
                toggleAI={toggleAISidebar}
                isSidebarOpen={isLeftSidebarOpen}
                isAISidebarOpen={isAISidebarOpen}
                lastSaved={lastSaved}
                isFocusMode={isFocusMode}
                toggleFocusMode={toggleFocusMode}
              />
              
              {/* Editor area with focus mode sizing */}
              <div className={cn(
                "flex-1 overflow-hidden relative transition-all duration-500",
                isFocusMode 
                  ? "h-[80vh] max-h-[80vh]" 
                  : "h-[450px] sm:h-[600px] md:h-[700px] lg:h-[800px] xl:h-[900px] 2xl:h-[950px]"
              )}>
                <EditableContent 
                  content={content} 
                  setContent={setContent} 
                  isFocusMode={isFocusMode}
                />
              </div>
            </div>
            
            {/* AI Dialog */}
            <AIDialog 
              isOpen={isAIDialogOpen}
              onOpenChange={setIsAIDialogOpen}
              content={content}
              onApplyChanges={setContent}
            />
            
            {/* Additional space at the bottom - hidden in focus mode */}
            {!isFocusMode && <div className="h-6"></div>}
          </div>
          
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
                  editorHeight={editorHeight}
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
