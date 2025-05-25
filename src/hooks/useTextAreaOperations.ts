
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
    if (!textarea || typeof newText !== 'string') {
      console.error('Invalid parameters for handleTextReplace');
      return;
    }

    try {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const beforeSelection = rawContent.substring(0, start);
      const afterSelection = rawContent.substring(end);
      
      const newContent = beforeSelection + newText + afterSelection;
      setRawContent(newContent);
      setContent(newContent);

      // Update cursor position after replacement with better error handling
      setTimeout(() => {
        if (textareaRef.current) {
          const newPosition = start + newText.length;
          try {
            textareaRef.current.focus();
            textareaRef.current.setSelectionRange(newPosition, newPosition);
          } catch (error) {
            console.warn('Could not set cursor position:', error);
          }
        }
      }, 0);
    } catch (error) {
      console.error('Error in handleTextReplace:', error);
    }
  };

  const handleTextInsert = (text: string) => {
    const textarea = textareaRef.current;
    if (!textarea || !text || typeof text !== 'string') {
      console.error('Invalid parameters for handleTextInsert');
      return;
    }

    try {
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

      // Update cursor position after insertion with better error handling
      setTimeout(() => {
        if (textareaRef.current) {
          const newPosition = cursorPos + insertText.length;
          try {
            textareaRef.current.focus();
            textareaRef.current.setSelectionRange(newPosition, newPosition);
          } catch (error) {
            console.warn('Could not set cursor position:', error);
          }
        }
      }, 0);
    } catch (error) {
      console.error('Error in handleTextInsert:', error);
    }
  };

  const handleContentChange = (newContent: string) => {
    if (typeof newContent !== 'string') {
      console.error('Invalid content type provided to handleContentChange');
      return;
    }
    
    try {
      setRawContent(newContent);
      setContent(newContent);
    } catch (error) {
      console.error('Error in handleContentChange:', error);
    }
  };

  const handleSpeechTranscript = (transcript: string) => {
    if (!transcript.trim() || !onSpeechTranscript) return;
    
    try {
      onSpeechTranscript(transcript);
    } catch (error) {
      console.error('Error handling speech transcript:', error);
    }
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
