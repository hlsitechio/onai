
import React, { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useNotesManager } from '@/hooks/useNotesManager.tsx';
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
  const [isAISidebarOpen, setIsAISidebarOpen] = useState(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  const { toast } = useToast();
  const { isFocusMode, toggleFocusMode } = useFocusModeManager();
  
  const {
    notes,
    currentNote,
    setCurrentNote,
    loading,
    saving,
    createNote,
    saveNote,
    deleteNote,
  } = useNotesManager();

  // Auto-save functionality
  useEffect(() => {
    if (content.trim() && content !== '<p></p>' && currentNote && content !== currentNote.content) {
      const timer = setTimeout(() => {
        handleSave();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [content, currentNote]);

  // Update content when current note changes
  useEffect(() => {
    if (currentNote) {
      setContent(currentNote.content);
    }
  }, [currentNote]);

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
          setIsAISidebarOpen(true);
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
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [toggleFocusMode]);

  const handleSave = useCallback(async () => {
    if (!currentNote || !content.trim() || content === '<p></p>') {
      toast({
        title: "Nothing to save",
        description: "Your note is empty.",
        variant: "destructive"
      });
      return;
    }

    try {
      await saveNote(currentNote.id, { content });
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
  }, [content, currentNote, saveNote, toast]);

  const handleNoteLoad = useCallback((noteContent: string) => {
    setContent(noteContent);
  }, []);

  const handleDeleteNote = useCallback(async (noteId: string): Promise<boolean> => {
    try {
      const success = await deleteNote(noteId);
      if (success) {
        toast({
          title: "Note deleted",
          description: "The note has been deleted successfully."
        });
        
        // If we deleted the current note, select another one
        if (currentNote?.id === noteId) {
          const remainingNotes = notes.filter(note => note.id !== noteId);
          if (remainingNotes.length > 0) {
            setCurrentNote(remainingNotes[0]);
            setContent(remainingNotes[0].content);
          } else {
            setCurrentNote(null);
            setContent('');
          }
        }
      }
      return success;
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: "Delete failed",
        description: "Failed to delete the note. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  }, [deleteNote, toast, currentNote, notes, setCurrentNote]);

  const createNewNote = useCallback(async () => {
    const newNote = await createNote();
    if (newNote) {
      setCurrentNote(newNote);
      setContent(newNote.content);
      setLastSaved(null);
    }
  }, [createNote, setCurrentNote]);

  const handleImportNotes = useCallback(async (importedNotes: Record<string, string>): Promise<boolean> => {
    try {
      // Convert imported notes to modern format and create them
      for (const [id, content] of Object.entries(importedNotes)) {
        await createNote('Imported Note', content);
      }
      
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
  }, [createNote, toast]);

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

  // Convert notes to legacy format for compatibility
  const allNotes: Record<string, string> = {};
  notes.forEach(note => {
    allNotes[note.id] = note.content;
  });

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
                  <TiptapEditor
                    content={content}
                    setContent={setContent}
                    isFocusMode={isFocusMode}
                  />
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
