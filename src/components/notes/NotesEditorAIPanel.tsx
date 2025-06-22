
import React from 'react';
import { ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import EnhancedAISidebar from "./EnhancedAISidebar";

interface NotesEditorAIPanelProps {
  onClose: () => void;
  onApplyContent: (content: string) => void;
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
        defaultSize={25} 
        minSize={20} 
        maxSize={50}
        className="min-w-0"
      >
        <div className="h-full bg-slate-900/90 backdrop-blur-xl border-l border-slate-700/50">
          <EnhancedAISidebar
            onClose={onClose}
            content=""
            onApplyChanges={onApplyContent}
          />
        </div>
      </ResizablePanel>
    </>
  );
};

export default NotesEditorAIPanel;
