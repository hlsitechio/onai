
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
      <ResizableHandle 
        withHandle={true} 
        className="bg-slate-700/30 hover:bg-slate-600/50 transition-colors duration-200"
      />
      <ResizablePanel 
        id="ai-chat-panel"
        defaultSize={30} 
        minSize={15} 
        maxSize={70}
        collapsible={true}
        className="min-w-0"
      >
        <div className="h-full bg-slate-900/90 backdrop-blur-xl border-l border-slate-700/50">
          {/* AI Panel Header */}
          <div className="h-16 border-b border-slate-700/50 flex items-center px-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-slate-200">AI Assistant</span>
            </div>
          </div>
          
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
