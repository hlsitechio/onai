
import React from 'react';
import { ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import AIChatPanel from "../ai-chat/AIChatPanel";

interface NotesEditorAIPanelProps {
  onClose: () => void;
  onApplyContent: (aiContent: string) => void;
}

const NotesEditorAIPanel: React.FC<NotesEditorAIPanelProps> = ({
  onClose,
  onApplyContent,
}) => {
  return (
    <>
      <ResizableHandle withHandle={true} />
      <ResizablePanel 
        id="ai-chat-panel"
        defaultSize={30} 
        minSize={15} 
        maxSize={70}
        collapsible={true}
        className="min-w-0"
      >
        <div className="h-full bg-black/20 border-l border-white/10">
          <AIChatPanel
            onClose={onClose}
            onApplyToEditor={onApplyContent}
          />
        </div>
      </ResizablePanel>
    </>
  );
};

export default NotesEditorAIPanel;
