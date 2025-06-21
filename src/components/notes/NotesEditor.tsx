
import React, { useState, useCallback, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Sparkles, PanelRight, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNotesManager, Note } from "@/hooks/useNotesManager";
import { useDeviceDetection } from "@/hooks/useDeviceDetection";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import NotesSidebar from "./NotesSidebar";
import NoteEditor from "./NoteEditor";
import AIChatPanel from "../ai-chat/AIChatPanel";
import MobileLayout from "../mobile/MobileLayout";

// Define the Note interface expected by NotesSidebar
interface SidebarNote {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const NotesEditor: React.FC = () => {
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [aiPanelOpen, setAiPanelOpen] = useState(false);
  const { isMobile } = useDeviceDetection();
  const { toast } = useToast();
  const {
    notes,
    currentNote,
    setCurrentNote,
    loading,
    saving,
    createNote,
    saveNote,
    deleteNote,
    loadNotes,
  } = useNotesManager();

  // Show mobile layout for mobile devices
  if (isMobile) {
    return <MobileLayout />;
  }

  // Convert notes array to Record format for NotesSidebar compatibility
  const notesRecord: Record<string, SidebarNote> = {};
  notes.forEach(note => {
    notesRecord[note.id] = {
      id: note.id,
      title: note.title,
      content: note.content,
      createdAt: new Date(note.created_at),
      updatedAt: new Date(note.updated_at)
    };
  });

  const currentContent = currentNote?.content || '';

  const handleApplyAIContent = (aiContent: string) => {
    if (selectedNoteId && currentContent !== undefined) {
      const newContent = currentContent + '\n\n' + aiContent;
      if (currentNote) {
        saveNote(currentNote.id, { content: newContent });
      }
      toast({
        title: "AI content applied",
        description: "The AI response has been added to your note.",
      });
    } else {
      // Create a new note with AI content
      createNote('New Note', aiContent).then(newNote => {
        if (newNote) {
          setSelectedNoteId(newNote.id);
          setCurrentNote(newNote);
        }
      });
      toast({
        title: "New note created",
        description: "A new note has been created with the AI response.",
      });
    }
  };

  const handleLoadNote = (noteId: string) => {
    const note = notes.find(n => n.id === noteId);
    if (note) {
      setSelectedNoteId(noteId);
      setCurrentNote(note);
    }
  };

  const handleCreateNote = async () => {
    const newNote = await createNote();
    if (newNote) {
      setSelectedNoteId(newNote.id);
      setCurrentNote(newNote);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    const success = await deleteNote(noteId);
    if (success && selectedNoteId === noteId) {
      setSelectedNoteId(null);
      setCurrentNote(null);
    }
  };

  const handleRenameNote = async (noteId: string, newTitle: string) => {
    await saveNote(noteId, { title: newTitle });
  };

  const handleContentChange = (content: string) => {
    if (currentNote) {
      saveNote(currentNote.id, { content });
    }
  };

  return (
    <div className="h-screen flex bg-gradient-to-br from-[#050510] to-[#0a0518] overflow-hidden">
      <ResizablePanelGroup 
        direction="horizontal" 
        className="h-full w-full"
        autoSaveId="notes-editor-layout"
      >
        {/* Notes Sidebar */}
        {sidebarOpen && (
          <>
            <ResizablePanel 
              id="notes-sidebar"
              defaultSize={20} 
              minSize={10} 
              maxSize={60}
              collapsible={true}
              className="min-w-0"
            >
              <NotesSidebar
                notes={notesRecord}
                selectedNoteId={selectedNoteId}
                onLoadNote={handleLoadNote}
                onCreateNote={handleCreateNote}
                onDeleteNote={handleDeleteNote}
                onRenameNote={handleRenameNote}
                saving={saving}
              />
            </ResizablePanel>
            <ResizableHandle withHandle={true} />
          </>
        )}

        {/* Main Editor Area */}
        <ResizablePanel 
          id="main-editor"
          minSize={20}
          className="flex flex-col"
        >
          {/* Top Bar */}
          <div className="h-14 bg-black/20 border-b border-white/10 flex items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="text-white hover:bg-white/10"
              >
                <PanelRight className={`h-4 w-4 transition-transform ${sidebarOpen ? 'rotate-180' : ''}`} />
              </Button>
              <span className="text-white text-sm">
                {currentNote ? `Note: ${currentNote.title}` : 'No note selected'}
              </span>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setAiPanelOpen(!aiPanelOpen)}
              className={`border-noteflow-500/30 text-noteflow-300 hover:bg-noteflow-500/20 hover:text-white transition-colors ${
                aiPanelOpen ? 'bg-noteflow-500/20 text-white' : ''
              }`}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              AI Assistant
            </Button>
          </div>

          {/* Editor */}
          <div className="flex-1">
            <NoteEditor
              noteId={selectedNoteId}
              content={currentContent}
              onContentChange={handleContentChange}
            />
          </div>
        </ResizablePanel>

        {/* AI Panel */}
        {aiPanelOpen && (
          <>
            <ResizableHandle withHandle={true} />
            <ResizablePanel 
              id="ai-chat-panel"
              defaultSize={30} 
              minSize={15} 
              maxSize={70}
              collapsible={true}
              className="min-w-0"
            >
              <div className="h-full bg-black/20 border-l border-white/10">
                <AIChatPanel
                  onClose={() => setAiPanelOpen(false)}
                  onApplyToEditor={handleApplyAIContent}
                />
              </div>
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>
    </div>
  );
};

export default NotesEditor;
