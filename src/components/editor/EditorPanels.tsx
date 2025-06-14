
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
    <div className="h-full w-full flex">
      <ResizablePanelGroup 
        direction="horizontal" 
        className="h-full w-full"
        autoSaveId="noteflow-editor-panels"
      >
        {/* Left sidebar - Notes */}
        {isLeftSidebarOpen && !isFocusMode && (
          <>
            <ResizablePanel 
              id="notes-sidebar"
              defaultSize={25} 
              minSize={20} 
              maxSize={50}
              collapsible={true}
              className="flex"
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
              className="w-2 bg-white/5 hover:bg-purple-500/20 transition-colors"
            />
          </>
        )}
        
        {/* The editor container - center panel */}
        <ResizablePanel 
          id="editor-main"
          minSize={30}
          className="flex flex-col"
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
              className="w-2 bg-white/5 hover:bg-purple-500/20 transition-colors"
            />
            <ResizablePanel 
              id="ai-sidebar"
              defaultSize={25} 
              minSize={20} 
              maxSize={50}
              collapsible={true}
              className="flex"
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
