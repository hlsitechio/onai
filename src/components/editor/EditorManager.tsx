import React, { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useSupabaseNotes } from '@/hooks/useSupabaseNotes';
import { useFocusModeManager } from '@/hooks/useFocusModeManager';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '../ui/resizable';
import SidebarPanel from './SidebarPanel';
import NotesSidebar from '../NotesSidebar';
import AISidebar from '../notes/AISidebar';
import TiptapEditor from './TiptapEditor';
import EditorToolbar from './EditorToolbar';
import { cn } from '@/lib/utils';

const EditorManager: React.FC = () => {
  const [content, setContent] = useState('');
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);
  const [isAISidebarOpen, setIsAISidebarOpen] = useState(true); // Changed to true by default
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

  // PWA shortcuts handling
  useEffect(() => {
    const handlePWAShortcuts = (event: CustomEvent) => {
      switch (event.type) {
        case 'pwa:new-note':
          createNewNote();
          toast({
            title: 'New Note',
            description: 'Started a new note from app shortcut.',
          });
          break;
        case 'pwa:open-ai':
          setIsAIDialogOpen(true);
          toast({
            title: 'AI Assistant',
            description: 'AI assistant opened from app shortcut.',
          });
          break;
      }
    };

    window.addEventListener('pwa:new-note', handlePWAShortcuts as EventListener);
    window.addEventListener('pwa:open-ai', handlePWAShortcuts as EventListener);

    return () => {
      window.removeEventListener('pwa:new-note', handlePWAShortcuts as EventListener);
      window.removeEventListener('pwa:open-ai', handlePWAShortcuts as EventListener);
    };
  }, []);

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
      await saveNote();
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
    console.log('Editor command:', command, value);
  }, []);

  const toggleLeftSidebar = useCallback(() => {
    setIsLeftSidebarOpen(prev => !prev);
  }, []);

  const toggleAISidebar = useCallback(() => {
    setIsAISidebarOpen(prev => !prev);
  }, []);

  const lastSavedString = lastSaved ? lastSaved.toISOString() : undefined;

  // Check if content is empty (only contains empty paragraph tags or is truly empty)
  const isContentEmpty = !content || content === '<p></p>' || content.trim() === '';

  return (
    <div className={cn(
      "min-h-screen w-full relative",
      "bg-gradient-to-br from-[#050510] to-[#0a0518]"
    )}>
      {/* Focus mode overlay */}
      {isFocusMode && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm animate-fadeIn" />
      )}
      
      {/* Main content container */}
      <div className={cn(
        "w-full h-screen relative",
        isFocusMode ? "z-[101]" : "z-10"
      )}>
        <div className="w-full h-full overflow-hidden">
          <ResizablePanelGroup 
            direction="horizontal" 
            className="h-full w-full"
            autoSaveId="noteflow-main-layout"
          >
            {/* Left sidebar - Notes */}
            {isLeftSidebarOpen && !isFocusMode && (
              <>
                <ResizablePanel 
                  id="notes-panel"
                  defaultSize={25} 
                  minSize={15} 
                  maxSize={45}
                  collapsible={false}
                  className="min-w-0"
                >
                  <SidebarPanel>
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
                  </SidebarPanel>
                </ResizablePanel>
                <ResizableHandle 
                  withHandle={true}
                  className="w-2 hover:w-3 transition-all duration-200 z-30"
                />
              </>
            )}
            
            {/* Main editor panel */}
            <ResizablePanel 
              id="editor-panel"
              minSize={30}
              className="flex flex-col min-w-0"
            >
              <div className={cn(
                "flex flex-col h-full transition-all duration-300 ease-in-out",
                "bg-gradient-to-br from-[#03010a] to-[#0a0518]",
                "rounded-lg border border-white/5 overflow-hidden",
                "shadow-[0_8px_30px_rgb(0,0,0,0.4)]"
              )}>
                {/* Editor Toolbar */}
                <EditorToolbar
                  execCommand={execCommand}
                  handleSave={handleSave}
                  toggleLeftSidebar={toggleLeftSidebar}
                  toggleAISidebar={toggleAISidebar}
                  isLeftSidebarOpen={isLeftSidebarOpen}
                  isAISidebarOpen={isAISidebarOpen}
                  lastSaved={lastSavedString}
                  isFocusMode={isFocusMode}
                  toggleFocusMode={toggleFocusMode}
                />

                {/* Main Editor Area */}
                <div className="flex-1 relative overflow-hidden">
                  <div className={cn(
                    "relative h-full w-full mx-auto",
                    "bg-gradient-to-br from-[#03010a] to-[#0a0518]",
                    "rounded-lg border border-white/5"
                  )}>
                    <TiptapEditor
                      content={content}
                      setContent={setContent}
                      isFocusMode={isFocusMode}
                    />
                  </div>
                  
                  {/* Centralized Empty State - Only show when content is truly empty */}
                  {isContentEmpty && (
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center max-w-md px-6">
                          <div className="mb-6 opacity-60">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-noteflow-400 to-noteflow-600 flex items-center justify-center">
                              <span className="text-2xl">✨</span>
                            </div>
                          </div>
                          <h3 className="text-xl font-medium text-white mb-3">
                            Start writing with AI assistance
                          </h3>
                          <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                            Type your thoughts, select text for AI enhancements, or use keyboard shortcuts for quick actions.
                          </p>
                          <div className="text-xs text-slate-500 space-y-2">
                            <div className="flex items-center justify-center gap-2">
                              <span>•</span>
                              <span>Select text to see AI options</span>
                            </div>
                            <div className="flex items-center justify-center gap-2">
                              <span>•</span>
                              <span>Press <kbd className="bg-white/10 px-1.5 py-0.5 rounded text-noteflow-200">Ctrl+Shift+A</kbd> for AI Agent</span>
                            </div>
                            <div className="flex items-center justify-center gap-2">
                              <span>•</span>
                              <span>Use formatting buttons in the toolbar</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </ResizablePanel>
            
            {/* Right sidebar - AI Assistant */}
            {isAISidebarOpen && !isFocusMode && (
              <>
                <ResizableHandle 
                  withHandle={true}
                  className="w-2 hover:w-3 transition-all duration-200 z-30"
                />
                <ResizablePanel 
                  id="ai-panel"
                  defaultSize={25} 
                  minSize={15} 
                  maxSize={45}
                  collapsible={false}
                  className="min-w-0"
                >
                  <SidebarPanel>
                    <AISidebar
                      content={content}
                      onApplyChanges={setContent}
                      editorHeight={0}
                    />
                  </SidebarPanel>
                </ResizablePanel>
              </>
            )}
          </ResizablePanelGroup>
        </div>
      </div>
    </div>
  );
};

export default EditorManager;
