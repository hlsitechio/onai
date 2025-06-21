
import React from 'react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import UnifiedEditor from './UnifiedEditor';
import UnifiedToolbar from './toolbar/UnifiedToolbar';
import NotesSidebarContainer from '../notes/NotesSidebarContainer';
import NotesSidebar from '../notes/NotesSidebar';
import EnhancedAISidebar from '../notes/EnhancedAISidebar';

interface EditorNormalLayoutProps {
  content: string;
  setContent: (content: string) => void;
  isLeftSidebarOpen: boolean;
  isAISidebarOpen: boolean;
  execCommand: (command: string, value?: string | null) => void;
  handleSave: () => void;
  toggleLeftSidebar: () => void;
  toggleAISidebar: () => void;
  lastSaved: string | undefined;
  isFocusMode: boolean;
  toggleFocusMode: () => void;
  handleNoteLoad: (noteId: string) => void;
  handleDeleteNote: (noteId: string) => void;
  allNotes: Record<string, string>;
  createNewNote: () => void;
  handleImportNotes: () => void;
  saving?: boolean;
}

const EditorNormalLayout: React.FC<EditorNormalLayoutProps> = ({
  content,
  setContent,
  isLeftSidebarOpen,
  isAISidebarOpen,
  execCommand,
  handleSave,
  toggleLeftSidebar,
  toggleAISidebar,
  lastSaved,
  isFocusMode,
  toggleFocusMode,
  handleNoteLoad,
  handleDeleteNote,
  allNotes,
  createNewNote,
  handleImportNotes,
  saving = false,
}) => {
  // Convert Record<string, string> to Note format for NotesSidebar
  const notesForSidebar = Object.entries(allNotes).reduce((acc, [id, content]) => {
    acc[id] = {
      id,
      content,
      title: content.slice(0, 50) || 'Untitled',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    return acc;
  }, {} as Record<string, any>);

  return (
    <div className="h-full w-full flex flex-col">
      {/* Unified Toolbar */}
      <UnifiedToolbar
        handleSave={handleSave}
        toggleLeftSidebar={toggleLeftSidebar}
        toggleAISidebar={toggleAISidebar}
        isLeftSidebarOpen={isLeftSidebarOpen}
        isAISidebarOpen={isAISidebarOpen}
        lastSaved={lastSaved}
        isFocusMode={isFocusMode}
        toggleFocusMode={toggleFocusMode}
        saving={saving}
      />

      {/* Main content area with resizable panels */}
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {/* Left Sidebar */}
          {isLeftSidebarOpen && (
            <>
              <ResizablePanel defaultSize={20} minSize={15} maxSize={40}>
                <NotesSidebarContainer>
                  <NotesSidebar
                    notes={notesForSidebar}
                    selectedNoteId={null}
                    onLoadNote={handleNoteLoad}
                    onCreateNote={createNewNote}
                    onDeleteNote={handleDeleteNote}
                    onRenameNote={(noteId: string, newTitle: string) => {
                      console.log('Rename note:', noteId, newTitle);
                    }}
                    onSaveNote={handleSave}
                    saving={saving}
                  />
                </NotesSidebarContainer>
              </ResizablePanel>
              <ResizableHandle withHandle />
            </>
          )}

          {/* Main Editor Panel */}
          <ResizablePanel defaultSize={isAISidebarOpen ? 50 : 80} minSize={30}>
            <UnifiedEditor
              content={content}
              setContent={setContent}
              isFocusMode={isFocusMode}
            />
          </ResizablePanel>

          {/* Right AI Sidebar */}
          {isAISidebarOpen && (
            <>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={30} minSize={20} maxSize={50}>
                <EnhancedAISidebar
                  onClose={() => toggleAISidebar()}
                  content={content}
                  onApplyChanges={(aiContent: string) => {
                    setContent(content + '\n\n' + aiContent);
                  }}
                />
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default EditorNormalLayout;
