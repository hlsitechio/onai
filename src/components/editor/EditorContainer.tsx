
import React from "react";
import { useEditorContainer } from "@/hooks/useEditorContainer";
import { cn } from "@/lib/utils";
import TextEditorToolbar from "../TextEditorToolbar";
import MobileToolbar from "../mobile/MobileToolbar";
import { useIsMobileDevice } from "@/hooks/useIsMobileDevice";
import EditorContent from "./EditorContent";

interface EditorContainerProps {
  content: string;
  setContent: (content: string) => void;
  execCommand: (command: string, value?: string | null) => void;
  handleSave: () => void;
  toggleLeftSidebar: () => void;
  toggleAISidebar: () => void;
  isLeftSidebarOpen: boolean;
  isAISidebarOpen: boolean;
  lastSaved: Date | null;
  isFocusMode: boolean;
  toggleFocusMode: () => void;
  isAIDialogOpen?: boolean;
  setIsAIDialogOpen?: (open: boolean) => void;
}

const EditorContainer: React.FC<EditorContainerProps> = ({
  content,
  setContent,
  execCommand,
  handleSave,
  toggleLeftSidebar,
  toggleAISidebar,
  isLeftSidebarOpen,
  isAISidebarOpen,
  lastSaved,
  isFocusMode,
  toggleFocusMode,
  isAIDialogOpen,
  setIsAIDialogOpen
}) => {
  const isMobileDevice = useIsMobileDevice();
  const { editorRef, handleSpeechTranscript, handleApplyAIChanges } = useEditorContainer({
    content,
    setContent
  });

  return (
    <div className={cn(
      "glass-panel-dark rounded-xl overflow-hidden flex flex-col transition-all duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.4)] border border-white/5",
      "h-full w-full", // Use full height from parent
      isFocusMode ? "shadow-[0_20px_60px_rgb(147,51,234,0.3)] border-purple-500/20" : ""
    )}>
      
      {/* Toolbar */}
      {isMobileDevice ? (
        <MobileToolbar
          execCommand={execCommand}
          handleSave={handleSave}
          toggleSidebar={toggleLeftSidebar}
          toggleAI={toggleAISidebar}
          isSidebarOpen={isLeftSidebarOpen}
          isAISidebarOpen={isAISidebarOpen}
          isFocusMode={isFocusMode}
          toggleFocusMode={toggleFocusMode}
        />
      ) : (
        <TextEditorToolbar
          execCommand={execCommand}
          handleSave={handleSave}
          toggleSidebar={toggleLeftSidebar}
          toggleAI={toggleAISidebar}
          isSidebarOpen={isLeftSidebarOpen}
          isAISidebarOpen={isAISidebarOpen}
          lastSaved={lastSaved}
          isFocusMode={isFocusMode}
          toggleFocusMode={toggleFocusMode}
          onSpeechTranscript={handleSpeechTranscript}
          onToggleAIAgent={() => setIsAIDialogOpen?.(!isAIDialogOpen)}
          isAIAgentVisible={isAIDialogOpen}
          content={content}
          onApplyAIChanges={handleApplyAIChanges}
        />
      )}

      {/* Editor Content */}
      <EditorContent
        content={content}
        setContent={setContent}
        isFocusMode={isFocusMode}
        onSave={handleSave}
        editorRef={editorRef}
      />
    </div>
  );
};

export default EditorContainer;
