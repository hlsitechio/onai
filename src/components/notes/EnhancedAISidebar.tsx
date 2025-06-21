
import React from "react";
import AIChatPanel from "@/components/ai-chat/AIChatPanel";

interface EnhancedAISidebarProps {
  content: string;
  onApplyChanges: (newContent: string) => void;
  editorHeight?: number;
  onClose?: () => void;
}

const EnhancedAISidebar: React.FC<EnhancedAISidebarProps> = ({
  content,
  onApplyChanges,
  editorHeight,
  onClose
}) => {
  const handleApplyToEditor = (aiContent: string) => {
    const newContent = content + '\n\n' + aiContent;
    onApplyChanges(newContent);
  };

  return (
    <div className="h-full bg-gradient-to-br from-[#03010a] to-[#0a0518]">
      <AIChatPanel 
        onClose={onClose}
        onApplyToEditor={handleApplyToEditor}
      />
    </div>
  );
};

export default EnhancedAISidebar;
