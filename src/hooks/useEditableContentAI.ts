
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

    try {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = textarea.value.substring(start, end);
      
      handleTextSelection({
        text: selectedText,
        start,
        end
      });
      
      updateCursorPosition(start);
    } catch (error) {
      console.error('Error handling text area selection:', error);
    }
  };

  // Handle cursor position changes
  const handleCursorChange = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    try {
      updateCursorPosition(textarea.selectionStart);
    } catch (error) {
      console.error('Error handling cursor change:', error);
    }
  };

  // Keyboard shortcuts for AI agent
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      try {
        // Ctrl/Cmd + Shift + A to toggle AI agent
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'A') {
          e.preventDefault();
          onToggleAIAgent?.();
        }
      } catch (error) {
        console.error('Error handling keyboard shortcut:', error);
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
