
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
}

const TextEditorToolbar: React.FC<TextEditorToolbarProps> = ({
  execCommand,
  handleSave,
  toggleLeftSidebar,
  lastSaved,
  isFocusMode,
  toggleFocusMode,
  content,
  onApplyAIChanges
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between p-2 lg:p-3 border-b border-white/5 bg-[#03010a] gap-2">
      {/* Navigation section */}
      <ToolbarNavigation
        toggleSidebar={toggleLeftSidebar}
        onSpeechTranscript={(transcript) => {
          // Handle speech transcript if needed
          const newContent = content + (content.endsWith('\n') || content === '' ? '' : '\n') + transcript + ' ';
          onApplyAIChanges(newContent);
        }}
        onOCRClick={() => {
          // Handle OCR click if needed
        }}
      />

      {/* Actions section */}
      <ToolbarActions 
        execCommand={execCommand} 
        isFocusMode={isFocusMode}
      />

      {/* Status section */}
      <ToolbarStatus
        handleSave={handleSave}
        lastSaved={lastSaved}
        isFocusMode={isFocusMode}
        toggleFocusMode={toggleFocusMode}
      />
    </div>
  );
};

export default TextEditorToolbar;
