
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
    <div className="h-screen flex bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
      {/* Enhanced background with subtle patterns */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] [background-size:20px_20px] opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5" />
      </div>

      <ResizablePanelGroup 
        direction="horizontal" 
        className="h-full w-full relative z-10"
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
