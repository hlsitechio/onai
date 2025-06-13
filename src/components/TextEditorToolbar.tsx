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
  return;
};
export default TextEditorToolbar;