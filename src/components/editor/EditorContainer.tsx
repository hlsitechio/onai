
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
  isLeftSidebarOpen: boolean;
  isAISidebarOpen: boolean;
  lastSaved: Date | null;
  isFocusMode: boolean;
  toggleFocusMode: () => void;
  isAIDialogOpen: boolean;
  setIsAIDialogOpen: (open: boolean) => void;
  onToggleAIAgent?: () => void;
  isAIAgentVisible?: boolean;
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
  setIsAIDialogOpen,
  onToggleAIAgent,
  isAIAgentVisible = false
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
        isLeftSidebarOpen={isLeftSidebarOpen}
        isAISidebarOpen={isAISidebarOpen}
        lastSaved={lastSaved}
        isFocusMode={isFocusMode}
        toggleFocusMode={toggleFocusMode}
        isAIDialogOpen={isAIDialogOpen}
        setIsAIDialogOpen={setIsAIDialogOpen}
        onToggleAIAgent={onToggleAIAgent}
        isAIAgentVisible={isAIAgentVisible}
      />
    </div>
  );
};

export default EditorContainer;
