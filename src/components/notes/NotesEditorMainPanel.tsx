
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
      id="main-editor"
      minSize={20}
      className="flex flex-col"
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
      <div className="flex-1">
        <NoteEditor
          noteId={currentNote?.id || null}
          content={currentContent}
          onContentChange={onContentChange}
        />
      </div>
    </ResizablePanel>
  );
};

export default NotesEditorMainPanel;
