
import React from "react";
import { cn } from "@/lib/utils";
import EditorContainerContent from "./EditorContainerContent";

interface EditorContainerProps {
  content: string;
  setContent: (content: string) => void;
  execCommand: (command: string) => void;
  handleSave: () => void;
  toggleLeftSidebar: () => void;
  toggleAISidebar: () => void;
  toggleGeminiPanel: () => void;
  isLeftSidebarOpen: boolean;
  isAISidebarOpen: boolean;
  isGeminiPanelOpen: boolean;
  lastSaved: Date | null;
  isFocusMode: boolean;
  toggleFocusMode: () => void;
  isAIDialogOpen: boolean;
  setIsAIDialogOpen: (open: boolean) => void;
}

const EditorContainer: React.FC<EditorContainerProps> = ({
  content,
  setContent,
  execCommand,
  handleSave,
  toggleLeftSidebar,
  toggleAISidebar,
  toggleGeminiPanel,
  isLeftSidebarOpen,
  isAISidebarOpen,
  isGeminiPanelOpen,
  lastSaved,
  isFocusMode,
  toggleFocusMode,
  isAIDialogOpen,
  setIsAIDialogOpen
}) => {
  return (
    <div className={cn(
      "flex flex-col h-full bg-[#03010a] rounded-xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.4)] border border-white/5",
      isFocusMode ? "min-h-[600px]" : "min-h-[550px] md:min-h-[600px]"
    )}>
      <EditorContainerContent
        content={content}
        setContent={setContent}
        execCommand={execCommand}
        handleSave={handleSave}
        toggleLeftSidebar={toggleLeftSidebar}
        toggleAISidebar={toggleAISidebar}
        toggleGeminiPanel={toggleGeminiPanel}
        isLeftSidebarOpen={isLeftSidebarOpen}
        isAISidebarOpen={isAISidebarOpen}
        isGeminiPanelOpen={isGeminiPanelOpen}
        lastSaved={lastSaved}
        isFocusMode={isFocusMode}
        toggleFocusMode={toggleFocusMode}
        isAIDialogOpen={isAIDialogOpen}
        setIsAIDialogOpen={setIsAIDialogOpen}
      />
    </div>
  );
};

export default EditorContainer;
