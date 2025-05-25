
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

  // Handle text selection in textarea with null checks
  const handleTextAreaSelection = () => {
    const textarea = textareaRef.current;
    if (!textarea) {
      console.warn('Textarea ref is null in handleTextAreaSelection');
      return;
    }

    try {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      
      // Ensure we have valid selection indices
      if (typeof start !== 'number' || typeof end !== 'number') {
        console.warn('Invalid selection range');
        return;
      }
      
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

  // Handle cursor position changes with null checks
  const handleCursorChange = () => {
    const textarea = textareaRef.current;
    if (!textarea) {
      console.warn('Textarea ref is null in handleCursorChange');
      return;
    }
    
    try {
      const selectionStart = textarea.selectionStart;
      if (typeof selectionStart === 'number') {
        updateCursorPosition(selectionStart);
      }
    } catch (error) {
      console.error('Error handling cursor change:', error);
    }
  };

  // Keyboard shortcuts for AI agent with better error handling
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      try {
        // Ctrl/Cmd + Shift + A to toggle AI agent
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'A') {
          e.preventDefault();
          if (onToggleAIAgent) {
            onToggleAIAgent();
          }
        }
      } catch (error) {
        console.error('Error handling keyboard shortcut:', error);
      }
    };

    document.addEventListener('keydown', handleKeydown);
    return () => {
      try {
        document.removeEventListener('keydown', handleKeydown);
      } catch (error) {
        console.error('Error removing keyboard event listener:', error);
      }
    };
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
