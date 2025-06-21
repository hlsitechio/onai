
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
  handleImportNotes: (event: React.ChangeEvent<HTMLInputElement>) => void;
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
                  // Handle note renaming if needed
                  console.log('Rename note:', noteId, newTitle);
                }}
              />
            </NotesSidebarContainer>
          </ResizablePanel>
          <ResizableHandle withHandle />
        </>
      )}

      {/* Main Editor Panel */}
      <ResizablePanel defaultSize={isAISidebarOpen ? 50 : 80} minSize={30}>
        <div className="flex flex-col h-full">
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
          />

          {/* Main Editor Area */}
          <div className="flex-1 relative overflow-hidden">
            <UnifiedEditor
              content={content}
              setContent={setContent}
              isFocusMode={isFocusMode}
            />
          </div>
        </div>
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
  );
};

export default EditorNormalLayout;
