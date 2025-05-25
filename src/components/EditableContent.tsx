
import React from "react";
import InlineAIActions from "./ai-agent/InlineAIActions";
import TextAreaEditor from "./editor/TextAreaEditor";
import { useTextAreaOperations } from "@/hooks/useTextAreaOperations";
import { useEditableContentAI } from "@/hooks/useEditableContentAI";

interface EditableContentProps {
  content: string;
  setContent: (content: string) => void;
  isFocusMode?: boolean;
  onSpeechTranscript?: (transcript: string) => void;
}

const EditableContent: React.FC<EditableContentProps> = ({
  content,
  setContent,
  isFocusMode = false,
  onSpeechTranscript
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
    rawContent
  });

  return (
    <div className="relative h-full w-full mx-auto bg-[#03010a]">
      <TextAreaEditor
        textareaRef={textareaRef}
        rawContent={rawContent}
        isFocusMode={isFocusMode}
        onContentChange={handleContentChange}
        onTextAreaSelection={handleTextAreaSelection}
        onCursorChange={handleCursorChange}
      />

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
