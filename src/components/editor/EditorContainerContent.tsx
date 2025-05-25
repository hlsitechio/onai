
import React from "react";
import TextEditorToolbar from "../TextEditorToolbar";
import EditableContent from "../EditableContent";
import AIDialog from "../notes/AIDialog";
import { useEditorContainerState } from "@/hooks/useEditorContainerState";

interface EditorContainerContentProps {
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

const EditorContainerContent: React.FC<EditorContainerContentProps> = ({
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
  const { toggleAIAgent: localToggleAIAgent } = useEditorContainerState();

  // Use the passed onToggleAIAgent if available, otherwise use local state
  const handleToggleAIAgent = onToggleAIAgent || localToggleAIAgent;

  return (
    <>
      {/* Toolbar */}
      <div className="shrink-0">
        <TextEditorToolbar
          execCommand={execCommand}
          handleSave={handleSave}
          toggleLeftSidebar={toggleLeftSidebar}
          toggleAISidebar={toggleAISidebar}
          isLeftSidebarOpen={isLeftSidebarOpen}
          isAISidebarOpen={isAISidebarOpen}
          lastSaved={lastSaved}
          isFocusMode={isFocusMode}
          toggleFocusMode={toggleFocusMode}
          content={content}
          onApplyAIChanges={setContent}
          onToggleAIAgent={handleToggleAIAgent}
          isAIAgentVisible={isAIAgentVisible}
        />
      </div>

      {/* Editor content */}
      <div className="flex-1 relative">
        <EditableContent
          content={content}
          setContent={setContent}
          isFocusMode={isFocusMode}
          onToggleAIAgent={handleToggleAIAgent}
          isAIAgentVisible={isAIAgentVisible}
        />
      </div>

      {/* AI Dialog */}
      <AIDialog
        isOpen={isAIDialogOpen}
        onClose={() => setIsAIDialogOpen(false)}
        content={content}
        onApplyChanges={setContent}
      />
    </>
  );
};

export default EditorContainerContent;
