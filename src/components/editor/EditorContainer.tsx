
import React from "react";
import { cn } from "@/lib/utils";
import TextEditorToolbar from "../TextEditorToolbar";
import EditorContainerContent from "./EditorContainerContent";
import { useEditorContainer } from "@/hooks/useEditorContainer";
import { useEditorContainerState } from "@/hooks/useEditorContainerState";

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
  isAIDialogOpen?: boolean;
  setIsAIDialogOpen?: (open: boolean) => void;
}

const EditorContainer: React.FC<EditorContainerProps> = ({
  content,
  setContent,
  execCommand,
  handleSave,
  toggleLeftSidebar,
  toggleAISidebar,
  isLeftSidebarOpen,
  isAISidebarOpen,
  lastSaved,
  isFocusMode,
  toggleFocusMode,
  isAIDialogOpen = false,
  setIsAIDialogOpen = () => {}
}) => {
  const { isAIAgentVisible, toggleAIAgent } = useEditorContainerState();
  
  const {
    editorRef,
    handleSpeechTranscript,
    handleApplyAIChanges
  } = useEditorContainer({ content, setContent });

  const handleInsertText = (text: string) => {
    if (!text || typeof text !== 'string') {
      console.error('Invalid text provided to handleInsertText');
      return;
    }
    // Insert text at current cursor position or append to content
    const newContent = content + (content.endsWith('\n') || content === '' ? '' : '\n') + text;
    setContent(newContent);
  };

  return (
    <div className={cn(
      "glass-panel-dark rounded-xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.4)] border border-white/5 transition-all duration-300 h-[calc(100vh-200px)]",
      isFocusMode && "ring-2 ring-purple-500/30 shadow-note-glow"
    )}>
      <TextEditorToolbar
        execCommand={execCommand}
        handleSave={handleSave}
        toggleSidebar={toggleLeftSidebar}
        toggleAI={toggleAISidebar}
        isSidebarOpen={isLeftSidebarOpen}
        isAISidebarOpen={isAISidebarOpen}
        lastSaved={lastSaved}
        isFocusMode={isFocusMode}
        toggleFocusMode={toggleFocusMode}
        onSpeechTranscript={handleSpeechTranscript}
        onToggleAIAgent={toggleAIAgent}
        isAIAgentVisible={isAIAgentVisible}
        content={content}
        onApplyAIChanges={handleApplyAIChanges}
        onInsertText={handleInsertText}
      />
      
      <EditorContainerContent
        content={content}
        setContent={setContent}
        isFocusMode={isFocusMode}
        handleSpeechTranscript={handleSpeechTranscript}
        toggleAIAgent={toggleAIAgent}
        isAIAgentVisible={isAIAgentVisible}
      />
    </div>
  );
};

export default EditorContainer;
