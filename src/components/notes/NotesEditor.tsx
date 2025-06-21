
import React, { useState, useCallback, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Sparkles, PanelRight, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNotesStorage } from "@/hooks/useNotesStorage";
import { useDeviceDetection } from "@/hooks/useDeviceDetection";
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
      {/* Notes Sidebar */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'w-80' : 'w-0'} overflow-hidden`}>
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
      </div>

      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col">
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

        <div className="flex-1 flex">
          {/* Editor */}
          <div className={`transition-all duration-300 ${aiPanelOpen ? 'flex-1' : 'w-full'}`}>
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

          {/* AI Panel */}
          {aiPanelOpen && (
            <div className="w-80 bg-black/20 border-l border-white/10">
              <AIChatPanel
                onClose={() => setAiPanelOpen(false)}
                onApplyToEditor={handleApplyAIContent}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotesEditor;
