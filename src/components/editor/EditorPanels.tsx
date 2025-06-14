
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
    <div className="h-full w-full relative">
      <ResizablePanelGroup 
        direction="horizontal" 
        className="h-full w-full"
        autoSaveId="noteflow-main-layout"
      >
        {/* Left sidebar - Notes */}
        {isLeftSidebarOpen && !isFocusMode && (
          <>
            <ResizablePanel 
              id="notes-panel"
              defaultSize={25} 
              minSize={15} 
              maxSize={45}
              collapsible={false}
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
              className="w-2 hover:w-3 transition-all duration-200 z-30"
            />
          </>
        )}
        
        {/* The editor container - center panel with vertical resizing */}
        <ResizablePanel 
          id="editor-panel"
          minSize={30}
          className="flex flex-col min-w-0"
        >
          <ResizablePanelGroup 
            direction="vertical" 
            className="h-full w-full"
            autoSaveId="noteflow-editor-vertical-layout"
          >
            {/* Main Editor Area - Top Panel */}
            <ResizablePanel 
              id="editor-content-panel"
              defaultSize={70}
              minSize={40}
              maxSize={90}
              className="min-h-0"
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
            
            {/* Vertical Resize Handle */}
            <ResizableHandle 
              withHandle={true}
              className="h-2 hover:h-3 transition-all duration-200 z-30"
            />
            
            {/* Bottom Panel - Additional space for future features */}
            <ResizablePanel 
              id="editor-bottom-panel"
              defaultSize={30}
              minSize={10}
              maxSize={60}
              className="min-h-0"
            >
              <div className="h-full w-full bg-gradient-to-br from-[#03010a] to-[#0a0518] rounded-lg border border-white/5 p-4">
                <div className="text-center text-slate-400 flex items-center justify-center h-full">
                  <div>
                    <div className="mb-2 opacity-60">
                      <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-gradient-to-br from-noteflow-400 to-noteflow-600 flex items-center justify-center">
                        <span className="text-lg">📝</span>
                      </div>
                    </div>
                    <p className="text-sm">Additional workspace area</p>
                    <p className="text-xs text-slate-500 mt-1">Future features will appear here</p>
                  </div>
                </div>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
        
        {/* Right sidebar - AI Assistant */}
        {isAISidebarOpen && !isFocusMode && (
          <>
            <ResizableHandle 
              withHandle={true}
              className="w-2 hover:w-3 transition-all duration-200 z-30"
            />
            <ResizablePanel 
              id="ai-panel"
              defaultSize={25} 
              minSize={15} 
              maxSize={45}
              collapsible={false}
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
    </div>
  );
};

export default EditorPanels;
