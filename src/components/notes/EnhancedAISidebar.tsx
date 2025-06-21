
import React from "react";
import AIChatPanel from "../ai-chat/AIChatPanel";

interface EnhancedAISidebarProps {
  content: string;
  onApplyChanges: (newContent: string) => void;
  editorHeight?: number;
}

const EnhancedAISidebar: React.FC<EnhancedAISidebarProps> = ({
  content,
  onApplyChanges,
  editorHeight
}) => {
  const handleApplyFromChat = (chatContent: string) => {
    // Insert the chat content into the editor
    const newContent = content + '\n\n' + chatContent;
    onApplyChanges(newContent);
  };

  return (
    <div className="w-full h-full">
      <AIChatPanel onApplyToEditor={handleApplyFromChat} />
    </div>
  );
};

export default EnhancedAISidebar;
