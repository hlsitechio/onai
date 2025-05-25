
import React from "react";
import ToolbarNavigation from "./toolbar/ToolbarNavigation";
import ToolbarActions from "./toolbar/ToolbarActions";
import ToolbarStatus from "./toolbar/ToolbarStatus";

interface TextEditorToolbarProps {
  execCommand: (command: string) => void;
  handleSave: () => void;
  toggleLeftSidebar: () => void;
  toggleAISidebar: () => void;
  isLeftSidebarOpen: boolean;
  isAISidebarOpen: boolean;
  lastSaved: Date | null;
  isFocusMode: boolean;
  toggleFocusMode: () => void;
  content: string;
  onApplyAIChanges: (newContent: string) => void;
  onToggleAIAgent?: () => void;
  isAIAgentVisible?: boolean;
}

const TextEditorToolbar: React.FC<TextEditorToolbarProps> = ({
  execCommand,
  handleSave,
  toggleLeftSidebar,
  toggleAISidebar,
  isLeftSidebarOpen,
  isAISidebarOpen,
  lastSaved,
  isFocusMode,
  toggleFocusMode,
  content,
  onApplyAIChanges,
  onToggleAIAgent,
  isAIAgentVisible = false
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between p-2 lg:p-3 border-b border-white/5 bg-[#03010a] gap-2">
      {/* Navigation section */}
      <ToolbarNavigation
        toggleLeftSidebar={toggleLeftSidebar}
        toggleAISidebar={toggleAISidebar}
        isLeftSidebarOpen={isLeftSidebarOpen}
        isAISidebarOpen={isAISidebarOpen}
      />

      {/* Actions section */}
      <ToolbarActions execCommand={execCommand} />

      {/* Status section */}
      <ToolbarStatus
        handleSave={handleSave}
        lastSaved={lastSaved}
        isFocusMode={isFocusMode}
        toggleFocusMode={toggleFocusMode}
        content={content}
        onApplyAIChanges={onApplyAIChanges}
        onToggleAIAgent={onToggleAIAgent}
        isAIAgentVisible={isAIAgentVisible}
      />
    </div>
  );
};

export default TextEditorToolbar;
