
import React, { useState, useEffect } from 'react';
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

// Memoized components for better performance
const MemoizedNotesSidebar = React.memo(NotesSidebar);
const MemoizedNoteEditor = React.memo(NoteEditor);
const MemoizedEnhancedAISidebar = React.memo(EnhancedAISidebar);

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
  
  // Cleanup window width since it's not being used
  const currentContent = currentNote?.content || '';

  // Keyboard shortcuts for power users
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const ctrlKey = isMac ? event.metaKey : event.ctrlKey;

      if (ctrlKey && event.key === 'b' && !event.shiftKey) {
        event.preventDefault();
        setSidebarOpen(prev => !prev);
      }
      
      if (ctrlKey && event.shiftKey && event.key === 'A') {
        event.preventDefault();
        setAiPanelOpen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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
          onResizeStop={(e, direction, ref) => {
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
              width: '6px',
              right: '-3px',
              background: 'transparent',
              cursor: 'col-resize',
              zIndex: 50,
            }
          }}
          className="z-20"
        >
          <div className="h-full transition-all duration-300 ease-in-out">
            <div className="h-full bg-slate-900/90 backdrop-blur-xl border-r border-slate-700/50">
              <MemoizedNotesSidebar
                notes={notesRecord}
                selectedNoteId={currentNote?.id || null}
                onLoadNote={onLoadNote}
                onCreateNote={onCreateNote}
                onDeleteNote={onDeleteNote}
                onRenameNote={onRenameNote}
                saving={saving}
              />
            </div>
            {/* Custom resize handle with better UX */}
            <div className="absolute top-0 right-[-3px] w-6 h-full z-50 cursor-col-resize group">
              <div className="absolute top-1/2 right-0 w-1 h-16 bg-slate-600/30 rounded-full transform -translate-y-1/2 group-hover:bg-blue-500/50 transition-all duration-200 group-hover:w-1.5 group-hover:h-20"></div>
            </div>
          </div>
        </Rnd>
      )}

      {/* Main Editor Area with smooth margin transitions */}
      <div 
        className="flex flex-col bg-slate-900/50 backdrop-blur-xl z-10 flex-1 transition-[margin] duration-300 ease-in-out"
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
            <MemoizedNoteEditor
              noteId={currentNote?.id || null}
              content={currentContent}
              onContentChange={onContentChange}
            />
          </div>
        </div>
      </div>

      {/* AI Panel - Resizable with better positioning */}
      {aiPanelOpen && (
        <Rnd
          size={{ width: aiPanelWidth, height: '100%' }}
          position={{ x: 0, y: 0 }}
          onResizeStop={(e, direction, ref) => {
            setAiPanelWidth(ref.offsetWidth);
          }}
          minWidth={250}
          maxWidth={800}
          disableDragging={true}
          enableResizing={{
            top: false,
            right: false,
            bottom: false,
            left: true,
            topRight: false,
            bottomRight: false,
            bottomLeft: false,
            topLeft: false,
          }}
          resizeHandleStyles={{
            left: {
              width: '6px',
              left: '-3px',
              background: 'transparent',
              cursor: 'col-resize',
              zIndex: 50,
            }
          }}
          className="z-30"
          style={{
            position: 'fixed',
            top: 0,
            right: 0,
          }}
        >
          <div className="h-full transition-all duration-300 ease-in-out">
            <div className="h-full bg-slate-900/90 backdrop-blur-xl border-l border-slate-700/50">
              <MemoizedEnhancedAISidebar
                onClose={() => setAiPanelOpen(false)}
                content={currentContent}
                onApplyChanges={onApplyAIContent}
              />
            </div>
            {/* Custom resize handle with better UX */}
            <div className="absolute top-0 left-[-3px] w-6 h-full z-50 cursor-col-resize group">
              <div className="absolute top-1/2 left-0 w-1 h-16 bg-slate-600/30 rounded-full transform -translate-y-1/2 group-hover:bg-blue-500/50 transition-all duration-200 group-hover:w-1.5 group-hover:h-20"></div>
            </div>
          </div>
        </Rnd>
      )}
    </div>
  );
};

export default NotesEditorFlexibleLayout;
