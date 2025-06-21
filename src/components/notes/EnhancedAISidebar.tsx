
import React from "react";
import AIChatSidebar from "../ai-chat/AIChatSidebar";

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
  return (
    <div className="w-full h-full">
      <AIChatSidebar 
        content={content}
        onApplyChanges={onApplyChanges}
      />
    </div>
  );
};

export default EnhancedAISidebar;
