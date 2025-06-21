
import React, { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useNotesManager } from '@/hooks/useNotesManager.tsx';
import { useFocusModeManager } from '@/hooks/useFocusModeManager';
import { useAuth } from '@/contexts/AuthContext';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '../ui/resizable';
import SidebarPanel from './SidebarPanel';
import NotesSidebar from '../NotesSidebar';
import AISidebar from '../notes/AISidebar';
import PlateEditor from './PlateEditor';
import EditorToolbar from './EditorToolbar';
import UserMenu from '@/components/UserMenu';
import { cn } from '@/lib/utils';
import { Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const EditorManager: React.FC = () => {
  const [content, setContent] = useState('');
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);
  const [isAISidebarOpen, setIsAISidebarOpen] = useState(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  const { toast } = useToast();
  const { isFocusMode, toggleFocusMode } = useFocusModeManager();
  const { user, loading: authLoading } = useAuth();
  
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

  // Show loading state while authenticating
  if (authLoading) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-[#050510] to-[#0a0518] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-noteflow-400 mx-auto mb-4" />
          <p className="text-gray-300">Loading your notes...</p>
        </div>
      </div>
    );
  }

  // Show authentication required state
  if (!user) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-[#050510] to-[#0a0518] flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-4">Authentication Required</h2>
          <p className="text-gray-400 mb-6">Please sign in to access your notes and start taking notes.</p>
          <Button 
            onClick={() => window.location.href = '/auth'} 
            className="bg-noteflow-500 hover:bg-noteflow-600"
          >
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  // Auto-save functionality with improved content detection
  useEffect(() => {
    if (!currentNote || !content.trim()) return;
    
    // Better content validation
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    const textContent = tempDiv.textContent || tempDiv.innerText || '';
    
    if (textContent.trim() && content !== '<p></p>' && content !== currentNote.content) {
      const timer = setTimeout(() => {
        handleSave();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [content, currentNote]);

  // Update content when current note changes
  useEffect(() => {
    if (currentNote) {
      setContent(currentNote.content || '');
    } else {
      setContent('');
    }
  }, [currentNote]);

  // Create initial note for new users
  useEffect(() => {
    if (user && !loading && notes.length === 0 && !currentNote) {
      createNewNote();
    }
  }, [user, loading, notes.length, currentNote]);

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
    if (!currentNote) {
      // If no current note, create a new one
      const newNote = await createNote();
      if (newNote) {
        setCurrentNote(newNote);
        await saveNote(newNote.id, { content });
      }
      return;
    }

    // Improved content validation
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    const textContent = tempDiv.textContent || tempDiv.innerText || '';
    
    if (!textContent.trim() && content === '<p></p>') {
      toast({
        title: "Cannot save empty note",
        description: "Please add some content before saving.",
        variant: "destructive"
      });
      return;
    }

    try {
      const success = await saveNote(currentNote.id, { content });
      if (success) {
        setLastSaved(new Date());
        toast({
          title: "Note saved",
          description: "Your note has been saved successfully."
        });
      }
    } catch (error) {
      console.error('Save error:', error);
      toast({
        title: "Save failed",
        description: "Failed to save your note. Please try again.",
        variant: "destructive"
      });
    }
  }, [content, currentNote, saveNote, createNote, toast]);

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
        
        // If we deleted the current note, select another one or create a new one
        if (currentNote?.id === noteId) {
          const remainingNotes = notes.filter(note => note.id !== noteId);
          if (remainingNotes.length > 0) {
            setCurrentNote(remainingNotes[0]);
            setContent(remainingNotes[0].content);
          } else {
            // Create a new note if no notes remain
            const newNote = await createNote();
            if (newNote) {
              setCurrentNote(newNote);
              setContent('');
            }
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
  }, [deleteNote, toast, currentNote, notes, setCurrentNote, createNote]);

  const createNewNote = useCallback(async () => {
    const newNote = await createNote();
    if (newNote) {
      setCurrentNote(newNote);
      setContent('');
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
      {/* Global animated background overlay */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            background: `
              radial-gradient(circle at 20% 50%, rgba(120, 60, 255, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(255, 60, 120, 0.08) 0%, transparent 50%),
              radial-gradient(circle at 40% 80%, rgba(60, 255, 200, 0.06) 0%, transparent 50%)
            `
          }}
        />
      </div>
      
      {/* Main content container with focus mode handling */}
      <div className={cn(
        "w-full h-screen relative z-10",
        isFocusMode && "z-[101]"
      )}>
        {/* Header - conditionally rendered based on focus mode */}
        {!isFocusMode && (
          <div className="absolute top-0 left-0 right-0 z-20 bg-black/20 backdrop-blur-sm border-b border-white/10">
            <div className="flex items-center justify-between h-16 px-6">
              <div className="flex items-center space-x-4">
                <h1 className="text-xl font-bold bg-gradient-to-r from-noteflow-400 to-purple-400 bg-clip-text text-transparent">
                  Online Note AI
                </h1>
              </div>
              <UserMenu />
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className={cn(
          "w-full h-full overflow-hidden",
          !isFocusMode && "pt-16"  
        )}>
          {isFocusMode ? (
            // Focus mode layout - simplified single panel
            <div className="h-full w-full bg-black">
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
                  isLeftSidebarOpen={false}
                  isAISidebarOpen={false}
                  lastSaved={lastSavedString}
                  isFocusMode={isFocusMode}
                  toggleFocusMode={toggleFocusMode}
                />

                {/* Main Editor Area */}
                <div className="flex-1 relative overflow-hidden">
                  <PlateEditor
                    content={content}
                    setContent={setContent}
                    isFocusMode={isFocusMode}
                  />
                </div>
              </div>
            </div>
          ) : (
            // Normal mode layout - resizable panels with free movement
            <ResizablePanelGroup 
              direction="horizontal" 
              className="h-full w-full"
              autoSaveId="noteflow-main-layout"
            >
              {/* Left sidebar - Notes */}
              {isLeftSidebarOpen && (
                <>
                  <ResizablePanel 
                    id="notes-panel"
                    defaultSize={25} 
                    minSize={5} 
                    maxSize={80}
                    collapsible={true}
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
                    className="w-1 hover:w-2 transition-all duration-150 z-30"
                  />
                </>
              )}
              
              {/* Main editor panel */}
              <ResizablePanel 
                id="editor-panel"
                minSize={10}
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
                    <PlateEditor
                      content={content}
                      setContent={setContent}
                      isFocusMode={isFocusMode}
                    />
                  </div>
                </div>
              </ResizablePanel>
              
              {/* Right sidebar - AI Assistant */}
              {isAISidebarOpen && (
                <>
                  <ResizableHandle 
                    withHandle={true}
                    className="w-1 hover:w-2 transition-all duration-150 z-30"
                  />
                  <ResizablePanel 
                    id="ai-panel"
                    defaultSize={25} 
                    minSize={5} 
                    maxSize={80}
                    collapsible={true}
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
          )}
        </div>
      </div>

      {/* Focus mode overlay - only when transitioning */}
      {isFocusMode && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm pointer-events-none animate-fadeIn" />
      )}
    </div>
  );
};

export default EditorManager;
