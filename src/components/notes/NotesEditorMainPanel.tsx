
import React from 'react';
import { ResizablePanel } from "@/components/ui/resizable";
import { Note } from "@/hooks/useNotesManager";
import NotesEditorTopBar from "./NotesEditorTopBar";
import NoteEditor from "./NoteEditor";

interface NotesEditorMainPanelProps {
  currentNote: Note | null;
  sidebarOpen: boolean;
  aiPanelOpen: boolean;
  onToggleSidebar: () => void;
  onToggleAIPanel: () => void;
  onContentChange: (content: string) => void;
}

const NotesEditorMainPanel: React.FC<NotesEditorMainPanelProps> = ({
  currentNote,
  sidebarOpen,
  aiPanelOpen,
  onToggleSidebar,
  onToggleAIPanel,
  onContentChange,
}) => {
  const currentContent = currentNote?.content || '';

  return (
    <ResizablePanel 
      minSize={20}
      className="flex flex-col bg-slate-900/50 backdrop-blur-xl"
    >
      {/* Top Bar */}
      <NotesEditorTopBar
        currentNote={currentNote}
        sidebarOpen={sidebarOpen}
        aiPanelOpen={aiPanelOpen}
        onToggleSidebar={onToggleSidebar}
        onToggleAIPanel={onToggleAIPanel}
      />

      {/* Editor */}
      <div className="flex-1 relative">
        {/* Enhanced editor background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/80 to-slate-900/80" />
        <div className="relative z-10 h-full">
          <NoteEditor
            noteId={currentNote?.id || null}
            content={currentContent}
            onContentChange={onContentChange}
          />
        </div>
      </div>
    </ResizablePanel>
  );
};

export default NotesEditorMainPanel;
