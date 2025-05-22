
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
import { useNoteContent } from "@/hooks/useNoteContent";

const TextEditor = () => {
  const { toast } = useToast();
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);
  const [isAISidebarOpen, setIsAISidebarOpen] = useState(true);
  const { isFocusMode, setFocusMode } = useFocusMode();
  
  // Update document data attribute when focus mode changes
  useEffect(() => {
    document.body.setAttribute('data-focus-mode', isFocusMode.toString());
  }, [isFocusMode]);
  
  const editorRef = useRef<HTMLDivElement>(null);
  const [editorHeight, setEditorHeight] = useState<number>(0);
  const { 
    content, 
    setContent, 
    lastSaved, 
    execCommand, 
    handleSave, 
    handleLoadNote,
    isAIDialogOpen,
    toggleAIDialog,
    setIsAIDialogOpen
  } = useNoteContent();
  
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
      toast({
        title: "Note saved",
        description: "Your note has been saved successfully",
      });
    }
  }, [handleSave, toast]);
  
  // Register the keyboard shortcut effect
  useEffect(() => {
    window.addEventListener('keydown', handleKeyboardShortcut);
    return () => window.removeEventListener('keydown', handleKeyboardShortcut);
  }, [handleKeyboardShortcut]); // Only depend on the callback itself, which already has dependencies
  
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
      "py-8 sm:py-12 px-4 relative transition-all duration-500 min-h-screen"
    )}>
      {/* Global overlay that only appears in focus mode */}
      {isFocusMode && (
        <>
          {/* Base background layer with blur effect */}
          <div className="fixed inset-0 pointer-events-none transition-all duration-500 bg-black/95 backdrop-blur-xl z-10">
            {/* Animated gradient orbs for visual interest */}
            <div className="absolute top-1/4 -left-[10%] w-[30%] h-[30%] rounded-full bg-gradient-to-r from-noteflow-900/20 to-noteflow-700/5 blur-[80px] animate-float-slow"></div>
            <div className="absolute bottom-1/4 -right-[10%] w-[25%] h-[25%] rounded-full bg-gradient-to-l from-noteflow-800/10 to-purple-900/5 blur-[70px] animate-float-medium"></div>
          </div>
          
          {/* Focus mode spotlight effect */}
          <div className="fixed inset-0 bg-black/95 backdrop-blur-2xl z-20 pointer-events-none">
            {/* Subtle spotlight effect on the editor in focus mode */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-radial from-noteflow-900/5 to-transparent blur-3xl"></div>
          </div>
        </>
      )}
      
      <div className={cn(
        "container mx-auto max-w-7xl relative",
        isFocusMode ? "z-30" : "z-10"
      )}>
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left sidebar with notes list - with animation */}
          <div className={cn(
            "w-full md:w-72 shrink-0 mb-4 md:mb-0 transition-all duration-300 ease-in-out",
            isLeftSidebarOpen ? "opacity-100" : "opacity-0 max-w-0 md:max-w-0 overflow-hidden"
          )}>
            {isLeftSidebarOpen && (
              <div className="animate-fadeIn">
                <NotesSidebar 
                  currentContent={content} 
                  onLoadNote={handleLoadNote} 
                  onSave={handleSave}
                  editorHeight={editorHeight}
                />
              </div>
            )}
          </div>
          
          {/* The editor with enhanced glassmorphism */}
          <div className="flex-1 flex flex-col">
            <div 
              ref={editorRef}
              className={cn(
                "glass-panel-dark rounded-xl overflow-hidden flex flex-col border border-white/5 transition-all duration-500",
                isFocusMode 
                  ? "shadow-[0_0_50px_rgba(76,29,149,0.15)] ring-1 ring-purple-800/20" 
                  : "shadow-[0_8px_30px_rgb(0,0,0,0.4)]"
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
              
              {/* Editor area with responsive dimensions */}
              <div className="flex-1 h-[300px] sm:h-[400px] md:h-[500px] overflow-hidden">
                <EditableContent 
                  content={content} 
                  setContent={setContent} 
                  isFocusMode={isFocusMode}
                />
              </div>
            </div>
            
            {/* AI Dialog - kept for compatibility but can be hidden by default */}
            <AIDialog 
              isOpen={isAIDialogOpen}
              onOpenChange={setIsAIDialogOpen}
              content={content}
              onApplyChanges={setContent}
            />
            
            {/* Additional space at the bottom */}
            <div className="h-6"></div>
          </div>
          
          {/* Right sidebar with AI capabilities - with animation */}
          <div className={cn(
            "w-full md:w-80 lg:w-96 shrink-0 mb-4 md:mb-0 transition-all duration-300 ease-in-out",
            isAISidebarOpen ? "opacity-100" : "opacity-0 max-w-0 md:max-w-0 overflow-hidden"
          )}>
            {isAISidebarOpen && (
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
