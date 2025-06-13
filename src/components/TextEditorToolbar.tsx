
import React from "react";

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

const TextEditorToolbar: React.FC<TextEditorToolbarProps> = () => {
  // This component is no longer needed as the toolbar is integrated directly into TiptapEditor
  // Returning null to avoid breaking existing imports while maintaining compatibility
  return null;
};

export default TextEditorToolbar;
