
import React from "react";
import { cn } from "@/lib/utils";
import TiptapEditor from "./TiptapEditor";

interface EditorContainerProps {
  content: string;
  setContent: (content: string) => void;
  execCommand: (command: string, value?: string | null) => void;
  handleSave: () => void;
  toggleLeftSidebar: () => void;
  toggleAISidebar: () => void;
  isLeftSidebarOpen: boolean;
  isAISidebarOpen: boolean;
  lastSaved: Date | null;
  isFocusMode: boolean;
  toggleFocusMode: () => void;
  isAIDialogOpen: boolean;
  setIsAIDialogOpen: (open: boolean) => void;
}

const EditorContainer: React.FC<EditorContainerProps> = ({
  content,
  setContent,
  handleSave,
  isFocusMode
}) => {
  return (
    <div className={cn(
      "bg-black/30 backdrop-blur-sm rounded-lg border border-white/10 overflow-hidden transition-all duration-300",
      "h-[calc(100vh-2rem)] flex flex-col"
    )}>
      {/* TiptapEditor with its own integrated toolbar */}
      <div className="flex-1 overflow-hidden">
        <TiptapEditor
          content={content}
          setContent={setContent}
          isFocusMode={isFocusMode}
          onSave={handleSave}
        />
      </div>
    </div>
  );
};

export default EditorContainer;
