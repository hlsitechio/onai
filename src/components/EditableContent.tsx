
import React from "react";
import InlineAIActions from "./ai-agent/InlineAIActions";
import AIAgent from "./ai-agent/AIAgent";
import TextAreaEditor from "./editor/TextAreaEditor";
import { useTextAreaOperations } from "@/hooks/useTextAreaOperations";
import { useEditableContentAI } from "@/hooks/useEditableContentAI";

interface EditableContentProps {
  content: string;
  setContent: (content: string) => void;
  isFocusMode?: boolean;
  onSpeechTranscript?: (transcript: string) => void;
  onToggleAIAgent?: () => void;
  isAIAgentVisible?: boolean;
}

const EditableContent: React.FC<EditableContentProps> = ({ 
  content, 
  setContent, 
  isFocusMode = false,
  onSpeechTranscript,
  onToggleAIAgent,
  isAIAgentVisible = false
}) => {
  const {
    rawContent,
    textareaRef,
    handleTextReplace,
    handleTextInsert,
    handleContentChange,
    handleSpeechTranscript
  } = useTextAreaOperations({
    content,
    setContent,
    onSpeechTranscript
  });

  const {
    selectedText,
    cursorPosition,
    inlineActionsPosition,
    isInlineActionsVisible,
    handleTextAreaSelection,
    handleCursorChange,
    hideInlineActions
  } = useEditableContentAI({
    textareaRef,
    rawContent,
    onToggleAIAgent
  });

  return (
    <div className="relative h-full w-full mx-auto">
      <TextAreaEditor
        textareaRef={textareaRef}
        rawContent={rawContent}
        isFocusMode={isFocusMode}
        onContentChange={handleContentChange}
        onTextAreaSelection={handleTextAreaSelection}
        onCursorChange={handleCursorChange}
      />

      {/* AI Agent */}
      {isAIAgentVisible && (
        <AIAgent
          content={rawContent}
          onContentChange={handleContentChange}
          cursorPosition={cursorPosition}
          isVisible={isAIAgentVisible}
        />
      )}

      {/* Inline AI Actions */}
      <InlineAIActions
        selectedText={selectedText}
        onTextReplace={handleTextReplace}
        onTextInsert={handleTextInsert}
        position={inlineActionsPosition}
        isVisible={isInlineActionsVisible}
        onClose={hideInlineActions}
      />
    </div>
  );
};

export default EditableContent;
