
import React, { useState, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import NotesSidebar from "./NotesSidebar";
import AdBanner from "./AdBanner";
import TextEditorToolbar from "./TextEditorToolbar";
import EditableContent from "./EditableContent";
import AIDialog from "./notes/AIDialog";
import { useNoteContent } from "@/hooks/useNoteContent";

const TextEditor = () => {
  const { toast } = useToast();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
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
      
      return () => {
        window.removeEventListener('resize', updateEditorHeight);
      };
    }
  }, [editorRef]);
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  return (
    <section id="editor-section" className="py-12 px-4 relative">
      <div className="container mx-auto max-w-5xl">
        <div className="flex gap-4">
          {/* The sidebar */}
          {isSidebarOpen && (
            <div className="w-64 shrink-0">
              <NotesSidebar 
                currentContent={content} 
                onLoadNote={handleLoadNote} 
                onSave={handleSave}
                editorHeight={editorHeight}
              />
            </div>
          )}
          
          {/* The editor */}
          <div className="flex-1 flex flex-col">
            <div 
              ref={editorRef}
              className="bg-black/40 backdrop-blur-lg rounded-lg shadow-lg border border-white/10 overflow-hidden"
            >
              {/* Toolbar */}
              <TextEditorToolbar 
                execCommand={execCommand}
                handleSave={handleSave}
                toggleSidebar={toggleSidebar}
                toggleAI={toggleAIDialog}
                isSidebarOpen={isSidebarOpen}
                lastSaved={lastSaved}
              />
              
              {/* Editor area */}
              <EditableContent content={content} setContent={setContent} />
            </div>
            
            {/* AI Dialog */}
            <AIDialog 
              isOpen={isAIDialogOpen}
              onOpenChange={setIsAIDialogOpen}
              content={content}
              onApplyChanges={setContent}
            />
            
            {/* Ad Banner below editor with specific ad slot */}
            <AdBanner size="medium" position="content" className="mt-4" adSlotId="3456789012" />
            
            <div className="mt-4 text-center text-sm text-slate-400">
              Your notes are saved in Chrome Storage and locally in your browser.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TextEditor;
