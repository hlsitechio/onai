
import React from "react";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "../ui/resizable";
import SidebarPanel from "./SidebarPanel";
import NotesSidebar from "../NotesSidebar";
import AISidebar from "../notes/AISidebar";
import EditorContainer from "./EditorContainer";

interface EditorPanelsProps {
  // Sidebar visibility
  isLeftSidebarOpen: boolean;
  isAISidebarOpen: boolean;
  isFocusMode: boolean;
  
  // Notes sidebar props
  content: string;
  setContent: (content: string) => void;
  handleNoteLoad: (content: string) => void;
  handleSave: () => void;
  handleDeleteNote: (noteId: string) => Promise<boolean>;
  allNotes: Record<string, string>;
  createNewNote: () => void;
  handleImportNotes: (importedNotes: Record<string, string>) => Promise<boolean>;
  
  // Editor container props
  execCommand: (command: string, value?: string | null) => void;
  toggleLeftSidebar: () => void;
  toggleAISidebar: () => void;
  lastSavedString?: string;
  handleToggleFocusMode: () => void;
  isAIDialogOpen: boolean;
  setIsAIDialogOpen: (open: boolean) => void;
}

const EditorPanels: React.FC<EditorPanelsProps> = ({
  isLeftSidebarOpen,
  isAISidebarOpen,
  isFocusMode,
  content,
  setContent,
  handleNoteLoad,
  handleSave,
  handleDeleteNote,
  allNotes,
  createNewNote,
  handleImportNotes,
  execCommand,
  toggleLeftSidebar,
  toggleAISidebar,
  lastSavedString,
  handleToggleFocusMode,
  isAIDialogOpen,
  setIsAIDialogOpen
}) => {
  return (
    <div className="w-full h-full relative" style={{ pointerEvents: 'auto' }}>
      <ResizablePanelGroup 
        direction="horizontal" 
        className="h-full w-full"
        autoSaveId="noteflow-editor-layout"
        style={{ pointerEvents: 'auto' }}
      >
        {/* Left sidebar - Notes */}
        {isLeftSidebarOpen && !isFocusMode && (
          <>
            <ResizablePanel 
              id="notes-sidebar-panel"
              order={1}
              defaultSize={22} 
              minSize={18} 
              maxSize={40} 
              className="min-w-[250px] h-full"
              style={{ pointerEvents: 'auto' }}
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
              className="z-[200] resizable-handle-override"
              style={{ pointerEvents: 'auto' }}
            />
          </>
        )}
        
        {/* The editor container - center panel */}
        <ResizablePanel 
          id="editor-main-panel"
          order={2}
          defaultSize={isLeftSidebarOpen && isAISidebarOpen && !isFocusMode ? 56 : 
                     (isLeftSidebarOpen || isAISidebarOpen) && !isFocusMode ? 78 : 100}
          minSize={35}
          className="relative h-full"
          style={{ pointerEvents: 'auto' }}
        >
          <EditorContainer
            content={content}
            setContent={setContent}
            execCommand={execCommand}
            handleSave={handleSave}
            toggleLeftSidebar={toggleLeftSidebar}
            toggleAISidebar={toggleAISidebar}
            isLeftSidebarOpen={isLeftSidebarOpen}
            isAISidebarOpen={isAISidebarOpen}
            lastSaved={lastSavedString}
            isFocusMode={isFocusMode}
            toggleFocusMode={handleToggleFocusMode}
            isAIDialogOpen={isAIDialogOpen}
            setIsAIDialogOpen={setIsAIDialogOpen}
          />
        </ResizablePanel>
        
        {/* Right sidebar - AI Assistant */}
        {isAISidebarOpen && !isFocusMode && (
          <>
            <ResizableHandle 
              withHandle={true}
              className="z-[200] resizable-handle-override"
              style={{ pointerEvents: 'auto' }}
            />
            <ResizablePanel 
              id="ai-sidebar-panel"
              order={3}
              defaultSize={22} 
              minSize={18} 
              maxSize={40} 
              className="min-w-[250px] h-full"
              style={{ pointerEvents: 'auto' }}
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
    </div>
  );
};

export default EditorPanels;
