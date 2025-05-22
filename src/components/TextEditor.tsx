
import React, { useState, useRef, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import NotesSidebar from "./NotesSidebar";
import AdBanner from "./AdBanner";
import TextEditorToolbar from "./TextEditorToolbar";
import EditableContent from "./EditableContent";
import AIDialog from "./notes/AIDialog";
import AISidebar from "./notes/AISidebar";
import { useNoteContent } from "@/hooks/useNoteContent";

const TextEditor = () => {
  const { toast } = useToast();
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);
  const [isAISidebarOpen, setIsAISidebarOpen] = useState(true);
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
  
  return (
    <section id="editor-section" className="py-12 px-4 relative">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left sidebar with notes list */}
          {isLeftSidebarOpen && (
            <div className="w-full md:w-72 shrink-0 mb-4 md:mb-0">
              <NotesSidebar 
                currentContent={content} 
                onLoadNote={handleLoadNote} 
                onSave={handleSave}
                editorHeight={editorHeight}
              />
            </div>
          )}
          
          {/* The editor with enhanced glassmorphism */}
          <div className="flex-1 flex flex-col">
            <div 
              ref={editorRef}
              className="glass-panel-dark rounded-xl overflow-hidden flex flex-col shadow-[0_8px_30px_rgb(0,0,0,0.4)] border border-white/5"
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
              />
              
              {/* Editor area with responsive dimensions */}
              <div className="flex-1 h-[300px] sm:h-[400px] md:h-[500px] overflow-hidden">
                <EditableContent content={content} setContent={setContent} />
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
          
          {/* Right sidebar with AI capabilities */}
          {isAISidebarOpen && (
            <div className="w-full md:w-80 lg:w-96 shrink-0 mb-4 md:mb-0">
              <AISidebar
                content={content}
                onApplyChanges={setContent}
                editorHeight={editorHeight}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default TextEditor;
