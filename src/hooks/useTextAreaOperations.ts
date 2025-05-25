
import { useRef, useEffect, useState } from "react";

interface UseTextAreaOperationsProps {
  content: string;
  setContent: (content: string) => void;
  onSpeechTranscript?: (transcript: string) => void;
}

export const useTextAreaOperations = ({
  content,
  setContent,
  onSpeechTranscript
}: UseTextAreaOperationsProps) => {
  const [rawContent, setRawContent] = useState(content);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Update rawContent when content prop changes
  useEffect(() => {
    setRawContent(content);
  }, [content]);

  const handleTextReplace = (newText: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const beforeSelection = rawContent.substring(0, start);
    const afterSelection = rawContent.substring(end);
    
    const newContent = beforeSelection + newText + afterSelection;
    setRawContent(newContent);
    setContent(newContent);

    // Update cursor position after replacement
    setTimeout(() => {
      const newPosition = start + newText.length;
      textarea.focus();
      textarea.setSelectionRange(newPosition, newPosition);
    }, 0);
  };

  const handleTextInsert = (text: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const cursorPos = textarea.selectionStart;
    const beforeCursor = rawContent.substring(0, cursorPos);
    const afterCursor = rawContent.substring(cursorPos);
    
    // Add appropriate spacing
    const needsSpaceBefore = beforeCursor.length > 0 && !beforeCursor.endsWith(' ') && !beforeCursor.endsWith('\n');
    const needsSpaceAfter = afterCursor.length > 0 && !afterCursor.startsWith(' ') && !afterCursor.startsWith('\n');
    
    const insertText = (needsSpaceBefore ? ' ' : '') + text + (needsSpaceAfter ? ' ' : '');
    const newContent = beforeCursor + insertText + afterCursor;
    
    setRawContent(newContent);
    setContent(newContent);

    // Update cursor position after insertion
    setTimeout(() => {
      const newPosition = cursorPos + insertText.length;
      textarea.focus();
      textarea.setSelectionRange(newPosition, newPosition);
    }, 0);
  };

  const handleContentChange = (newContent: string) => {
    setRawContent(newContent);
    setContent(newContent);
  };

  const handleSpeechTranscript = (transcript: string) => {
    if (!transcript.trim() || !onSpeechTranscript) return;
    onSpeechTranscript(transcript);
  };

  return {
    rawContent,
    textareaRef,
    handleTextReplace,
    handleTextInsert,
    handleContentChange,
    handleSpeechTranscript
  };
};
