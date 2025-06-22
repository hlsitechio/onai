
import React from 'react';
import { ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import NotesSidebar from "./NotesSidebar";
import { SidebarNote } from "./NotesEditorContainer";

interface NotesEditorSidebarPanelProps {
  notesRecord: Record<string, SidebarNote>;
  selectedNoteId: string | null;
  saving: boolean;
  onLoadNote: (noteId: string) => void;
  onCreateNote: () => void;
  onDeleteNote: (noteId: string) => void;
  onRenameNote: (noteId: string, newTitle: string) => void;
}

const NotesEditorSidebarPanel: React.FC<NotesEditorSidebarPanelProps> = ({
  notesRecord,
  selectedNoteId,
  saving,
  onLoadNote,
  onCreateNote,
  onDeleteNote,
  onRenameNote,
}) => {
  return (
    <>
      <ResizablePanel 
        defaultSize={25} 
        minSize={15} 
        maxSize={50}
        className="min-w-0"
      >
        <div className="h-full bg-slate-900/90 backdrop-blur-xl border-r border-slate-700/50">
          <NotesSidebar
            notes={notesRecord}
            selectedNoteId={selectedNoteId}
            onLoadNote={onLoadNote}
            onCreateNote={onCreateNote}
            onDeleteNote={onDeleteNote}
            onRenameNote={onRenameNote}
            saving={saving}
          />
        </div>
      </ResizablePanel>
      <ResizableHandle 
        withHandle={true} 
        className="bg-slate-700/30 hover:bg-slate-600/50 transition-colors duration-200"
      />
    </>
  );
};

export default NotesEditorSidebarPanel;
