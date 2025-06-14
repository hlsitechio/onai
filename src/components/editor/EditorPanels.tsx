
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
    <ResizablePanelGroup 
      direction="horizontal" 
      className="h-full rounded-lg border border-white/10"
      autoSaveId="editor-layout"
    >
      {/* Left sidebar - Notes */}
      {isLeftSidebarOpen && !isFocusMode && (
        <>
          <ResizablePanel 
            id="notes-sidebar"
            order={1}
            defaultSize={25} 
            minSize={15} 
            maxSize={45} 
            className="min-w-[200px]"
            collapsible={true}
            collapsedSize={0}
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
            className="mx-0.5 z-50"
          />
        </>
      )}
      
      {/* The editor container - center panel */}
      <ResizablePanel 
        id="editor-main"
        order={2}
        defaultSize={isLeftSidebarOpen && isAISidebarOpen && !isFocusMode ? 50 : 
                   (isLeftSidebarOpen || isAISidebarOpen) && !isFocusMode ? 75 : 100}
        minSize={30}
        className="relative"
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
            className="mx-0.5 z-50"
          />
          <ResizablePanel 
            id="ai-sidebar"
            order={3}
            defaultSize={25} 
            minSize={15} 
            maxSize={45} 
            className="min-w-[200px]"
            collapsible={true}
            collapsedSize={0}
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

export default EditorPanels;
