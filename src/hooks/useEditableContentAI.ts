
import { useEffect } from "react";
import { useAIAgent } from "@/hooks/useAIAgent";

interface UseEditableContentAIProps {
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  rawContent: string;
  onToggleAIAgent?: () => void;
}

export const useEditableContentAI = ({
  textareaRef,
  rawContent,
  onToggleAIAgent
}: UseEditableContentAIProps) => {
  const {
    selectedText,
    cursorPosition,
    inlineActionsPosition,
    isInlineActionsVisible,
    handleTextSelection,
    hideInlineActions,
    updateCursorPosition
  } = useAIAgent();

  // Handle text selection in textarea
  const handleTextAreaSelection = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    
    handleTextSelection({
      text: selectedText,
      start,
      end
    });
    
    updateCursorPosition(start);
  };

  // Handle cursor position changes
  const handleCursorChange = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    updateCursorPosition(textarea.selectionStart);
  };

  // Keyboard shortcuts for AI agent
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + Shift + A to toggle AI agent
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        onToggleAIAgent?.();
      }
    };

    document.addEventListener('keydown', handleKeydown);
    return () => document.removeEventListener('keydown', handleKeydown);
  }, [onToggleAIAgent]);

  return {
    selectedText,
    cursorPosition,
    inlineActionsPosition,
    isInlineActionsVisible,
    handleTextAreaSelection,
    handleCursorChange,
    hideInlineActions
  };
};
