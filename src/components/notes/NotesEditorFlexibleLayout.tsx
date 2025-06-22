
import React, { useState } from 'react';
import { Rnd } from 'react-rnd';
import { Note } from "@/hooks/useNotesManager";
import { SidebarNote } from "./NotesEditorContainer";
import NotesSidebar from "./NotesSidebar";
import NotesEditorTopBar from "./NotesEditorTopBar";
import NoteEditor from "./NoteEditor";
import EnhancedAISidebar from "./EnhancedAISidebar";

interface NotesEditorFlexibleLayoutProps {
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

const NotesEditorFlexibleLayout: React.FC<NotesEditorFlexibleLayoutProps> = ({
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
  const [sidebarWidth, setSidebarWidth] = useState(320);
  const [aiPanelWidth, setAiPanelWidth] = useState(320);

  const currentContent = currentNote?.content || '';

  return (
    <div className="h-screen flex bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden relative">
      {/* Enhanced background with subtle patterns */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] [background-size:20px_20px] opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5" />
      </div>

      {/* Notes Sidebar - Resizable */}
      {sidebarOpen && (
        <Rnd
          size={{ width: sidebarWidth, height: '100%' }}
          position={{ x: 0, y: 0 }}
          onResizeStop={(e, direction, ref, delta, position) => {
            setSidebarWidth(ref.offsetWidth);
          }}
          minWidth={200}
          maxWidth={600}
          disableDragging={true}
          enableResizing={{
            top: false,
            right: true,
            bottom: false,
            left: false,
            topRight: false,
            bottomRight: false,
            bottomLeft: false,
            topLeft: false,
          }}
          resizeHandleStyles={{
            right: {
              width: '4px',
              right: '-2px',
              background: 'transparent',
              cursor: 'col-resize',
            }
          }}
          className="z-20"
        >
          <div className="h-full bg-slate-900/90 backdrop-blur-xl border-r border-slate-700/50">
            <NotesSidebar
              notes={notesRecord}
              selectedNoteId={currentNote?.id || null}
              onLoadNote={onLoadNote}
              onCreateNote={onCreateNote}
              onDeleteNote={onDeleteNote}
              onRenameNote={onRenameNote}
              saving={saving}
            />
          </div>
        </Rnd>
      )}

      {/* Main Editor Area */}
      <div 
        className="flex flex-col bg-slate-900/50 backdrop-blur-xl z-10 flex-1"
        style={{
          marginLeft: sidebarOpen ? `${sidebarWidth}px` : '0px',
          marginRight: aiPanelOpen ? `${aiPanelWidth}px` : '0px',
        }}
      >
        {/* Top Bar */}
        <NotesEditorTopBar
          currentNote={currentNote}
          sidebarOpen={sidebarOpen}
          aiPanelOpen={aiPanelOpen}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onToggleAIPanel={() => setAiPanelOpen(!aiPanelOpen)}
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
      </div>

      {/* AI Panel - Resizable */}
      {aiPanelOpen && (
        <div
          className="fixed right-0 top-0 h-full z-20 bg-slate-900/90 backdrop-blur-xl border-l border-slate-700/50"
          style={{ width: `${aiPanelWidth}px` }}
        >
          {/* Resize Handle */}
          <div
            className="absolute left-0 top-0 w-1 h-full cursor-col-resize bg-transparent hover:bg-purple-500/20 transition-colors"
            onMouseDown={(e) => {
              const startX = e.clientX;
              const startWidth = aiPanelWidth;
              
              const handleMouseMove = (e: MouseEvent) => {
                const newWidth = startWidth - (e.clientX - startX);
                const clampedWidth = Math.max(250, Math.min(800, newWidth));
                setAiPanelWidth(clampedWidth);
              };
              
              const handleMouseUp = () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
              };
              
              document.addEventListener('mousemove', handleMouseMove);
              document.addEventListener('mouseup', handleMouseUp);
            }}
          />
          
          <EnhancedAISidebar
            onClose={() => setAiPanelOpen(false)}
            content={currentContent}
            onApplyChanges={onApplyAIContent}
          />
        </div>
      )}
    </div>
  );
};

export default NotesEditorFlexibleLayout;
