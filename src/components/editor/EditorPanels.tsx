
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
    <div className="h-full w-full">
      <ResizablePanelGroup 
        direction="horizontal" 
        className="h-full w-full"
        autoSaveId="editor-layout-v2"
      >
        {/* Left sidebar - Notes */}
        {isLeftSidebarOpen && !isFocusMode && (
          <>
            <ResizablePanel 
              id="notes-sidebar"
              order={1}
              defaultSize={20} 
              minSize={15} 
              maxSize={40} 
              className="min-w-[250px]"
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
              className="z-50 hover:bg-purple-500/30"
            />
          </>
        )}
        
        {/* The editor container - center panel */}
        <ResizablePanel 
          id="editor-main"
          order={2}
          defaultSize={isLeftSidebarOpen && isAISidebarOpen && !isFocusMode ? 60 : 
                     (isLeftSidebarOpen || isAISidebarOpen) && !isFocusMode ? 80 : 100}
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
              className="z-50 hover:bg-purple-500/30"
            />
            <ResizablePanel 
              id="ai-sidebar"
              order={3}
              defaultSize={20} 
              minSize={15} 
              maxSize={40} 
              className="min-w-[250px]"
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
