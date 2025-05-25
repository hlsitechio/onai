
import React from "react";
import EditableContent from "../EditableContent";

interface EditorContainerContentProps {
  content: string;
  setContent: (content: string) => void;
  isFocusMode: boolean;
  handleSpeechTranscript: (transcript: string) => void;
  toggleAIAgent: () => void;
  isAIAgentVisible: boolean;
}

const EditorContainerContent: React.FC<EditorContainerContentProps> = ({
  content,
  setContent,
  isFocusMode,
  handleSpeechTranscript,
  toggleAIAgent,
  isAIAgentVisible
}) => {
  return (
    <div className="h-[calc(100%-60px)] relative">
      <EditableContent
        content={content}
        setContent={setContent}
        isFocusMode={isFocusMode}
        onSpeechTranscript={handleSpeechTranscript}
        onToggleAIAgent={toggleAIAgent}
        isAIAgentVisible={isAIAgentVisible}
      />
    </div>
  );
};

export default EditorContainerContent;
