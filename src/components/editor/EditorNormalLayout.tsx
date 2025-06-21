
import React from 'react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import SidebarPanel from '@/components/editor/SidebarPanel';
import NotesSidebar from '@/components/NotesSidebar';
import AISidebar from '@/components/notes/AISidebar';
import PlateEditor from '@/components/editor/PlateEditor';
import EditorToolbar from '@/components/editor/EditorToolbar';
import { cn } from '@/lib/utils';

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
  handleNoteLoad: (noteContent: string) => void;
  handleDeleteNote: (noteId: string) => Promise<boolean>;
  allNotes: Record<string, string>;
  createNewNote: () => void;
  handleImportNotes: (importedNotes: Record<string, string>) => Promise<boolean>;
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
  return (
    <ResizablePanelGroup 
      direction="horizontal" 
      className="h-full w-full"
      autoSaveId="noteflow-main-layout"
    >
      {/* Left sidebar - Notes */}
      {isLeftSidebarOpen && (
        <>
          <ResizablePanel 
            id="notes-panel"
            defaultSize={25} 
            minSize={5} 
            maxSize={80}
            collapsible={true}
            className="min-w-0"
          >
            <SidebarPanel>
              <NotesSidebar 
                currentContent={content} 
                onLoadNote={handleNoteLoad}
                onSave={handleSave}
                onDeleteNote={handleDeleteNote}
                editorHeight={0}
                allNotes={allNotes}
                onCreateNew={createNewNote}
                onImportNotes={handleImportNotes}
              />
            </SidebarPanel>
          </ResizablePanel>
          <ResizableHandle 
            withHandle={true}
            className="w-1 hover:w-2 transition-all duration-150 z-30"
          />
        </>
      )}
      
      {/* Main editor panel */}
      <ResizablePanel 
        id="editor-panel"
        minSize={10}
        className="flex flex-col min-w-0"
      >
        <div className={cn(
          "flex flex-col h-full transition-all duration-300 ease-in-out",
          "bg-gradient-to-br from-[#03010a] to-[#0a0518]",
          "rounded-lg border border-white/5 overflow-hidden",
          "shadow-[0_8px_30px_rgb(0,0,0,0.4)]"
        )}>
          {/* Editor Toolbar */}
          <EditorToolbar
            execCommand={execCommand}
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
            <PlateEditor
              content={content}
              setContent={setContent}
              isFocusMode={isFocusMode}
            />
          </div>
        </div>
      </ResizablePanel>
      
      {/* Right sidebar - AI Assistant */}
      {isAISidebarOpen && (
        <>
          <ResizableHandle 
            withHandle={true}
            className="w-1 hover:w-2 transition-all duration-150 z-30"
          />
          <ResizablePanel 
            id="ai-panel"
            defaultSize={25} 
            minSize={5} 
            maxSize={80}
            collapsible={true}
            className="min-w-0"
          >
            <SidebarPanel>
              <AISidebar
                content={content}
                onApplyChanges={setContent}
                editorHeight={0}
              />
            </SidebarPanel>
          </ResizablePanel>
        </>
      )}
    </ResizablePanelGroup>
  );
};

export default EditorNormalLayout;
