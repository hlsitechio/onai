
import React, { useState } from 'react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Note } from "@/hooks/useNotesManager";
import { SidebarNote } from "./NotesEditorContainer";
import NotesEditorSidebarPanel from "./NotesEditorSidebarPanel";
import NotesEditorMainPanel from "./NotesEditorMainPanel";
import NotesEditorAIPanel from "./NotesEditorAIPanel";

interface NotesEditorLayoutProps {
  notesRecord: Record<string, SidebarNote>;
  currentNote: Note | null;
  saving: boolean;
  onLoadNote: (noteId: string) => void;
  onCreateNote: () => void;
  onDeleteNote: (noteId: string) => void;
  onRenameNote: (noteId: string, newTitle: string) => void;
  onContentChange: (content: string) => void;
  onApplyAIContent: (aiContent: string) => void;
}

const NotesEditorLayout: React.FC<NotesEditorLayoutProps> = ({
  notesRecord,
  currentNote,
  saving,
  onLoadNote,
  onCreateNote,
  onDeleteNote,
  onRenameNote,
  onContentChange,
  onApplyAIContent,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [aiPanelOpen, setAiPanelOpen] = useState(false);

  return (
    <div className="h-screen flex bg-gradient-to-br from-[#050510] to-[#0a0518] overflow-hidden">
      <ResizablePanelGroup 
        direction="horizontal" 
        className="h-full w-full"
        autoSaveId="notes-editor-layout"
      >
        {/* Notes Sidebar */}
        {sidebarOpen && (
          <NotesEditorSidebarPanel
            notesRecord={notesRecord}
            selectedNoteId={currentNote?.id || null}
            saving={saving}
            onLoadNote={onLoadNote}
            onCreateNote={onCreateNote}
            onDeleteNote={onDeleteNote}
            onRenameNote={onRenameNote}
          />
        )}

        {/* Main Editor Area */}
        <NotesEditorMainPanel
          currentNote={currentNote}
          sidebarOpen={sidebarOpen}
          aiPanelOpen={aiPanelOpen}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onToggleAIPanel={() => setAiPanelOpen(!aiPanelOpen)}
          onContentChange={onContentChange}
        />

        {/* AI Panel */}
        {aiPanelOpen && (
          <NotesEditorAIPanel
            onClose={() => setAiPanelOpen(false)}
            onApplyContent={onApplyAIContent}
          />
        )}
      </ResizablePanelGroup>
    </div>
  );
};

export default NotesEditorLayout;
