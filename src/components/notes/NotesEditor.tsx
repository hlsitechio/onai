
import React, { useState, useCallback, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Sparkles, PanelRight, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNotesStorage } from "@/hooks/useNotesStorage";
import { useDeviceDetection } from "@/hooks/useDeviceDetection";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import NotesSidebar from "./NotesSidebar";
import NoteEditor from "./NoteEditor";
import AIChatPanel from "../ai-chat/AIChatPanel";
import MobileLayout from "../mobile/MobileLayout";

const NotesEditor: React.FC = () => {
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [aiPanelOpen, setAiPanelOpen] = useState(false);
  const { isMobile } = useDeviceDetection();
  const { toast } = useToast();
  const {
    notes,
    currentContent,
    saveNote,
    loadNote,
    createNote,
    deleteNote,
    renameNote
  } = useNotesStorage();

  // Show mobile layout for mobile devices
  if (isMobile) {
    return <MobileLayout />;
  }

  const currentNote = selectedNoteId ? notes[selectedNoteId] : null;

  const handleApplyAIContent = (aiContent: string) => {
    if (selectedNoteId && currentContent !== undefined) {
      const newContent = currentContent + '\n\n' + aiContent;
      saveNote(selectedNoteId, newContent);
      toast({
        title: "AI content applied",
        description: "The AI response has been added to your note.",
      });
    } else {
      // Create a new note with AI content
      const newNoteId = createNote();
      saveNote(newNoteId, aiContent);
      setSelectedNoteId(newNoteId);
      toast({
        title: "New note created",
        description: "A new note has been created with the AI response.",
      });
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
              defaultSize={25} 
              minSize={15} 
              maxSize={45}
              collapsible={false}
              className="min-w-0"
            >
              <NotesSidebar
                notes={notes}
                selectedNoteId={selectedNoteId}
                onLoadNote={(noteId) => {
                  setSelectedNoteId(noteId);
                  loadNote(noteId);
                }}
                onCreateNote={() => {
                  const newNoteId = createNote();
                  setSelectedNoteId(newNoteId);
                }}
                onDeleteNote={(noteId) => {
                  deleteNote(noteId);
                  if (selectedNoteId === noteId) {
                    setSelectedNoteId(null);
                  }
                }}
                onRenameNote={renameNote}
              />
            </ResizablePanel>
            <ResizableHandle withHandle={true} />
          </>
        )}

        {/* Main Editor Area */}
        <ResizablePanel 
          id="main-editor"
          minSize={30}
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
                {currentNote ? `Note: ${currentNote.id}` : 'No note selected'}
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
              content={currentContent || ''}
              onContentChange={(content) => {
                if (selectedNoteId) {
                  saveNote(selectedNoteId, content);
                }
              }}
            />
          </div>
        </ResizablePanel>

        {/* AI Panel */}
        {aiPanelOpen && (
          <>
            <ResizableHandle withHandle={true} />
            <ResizablePanel 
              id="ai-chat-panel"
              defaultSize={25} 
              minSize={15} 
              maxSize={50}
              collapsible={false}
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
