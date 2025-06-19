
import { useEffect } from 'react';
import { useAIAgent } from './useAIAgent';
import type { Editor } from '@tiptap/react';

export const useTiptapAIAgent = (editor: Editor | null, selectedText: string) => {
  const {
    isAIAgentVisible,
    aiPosition,
    showAIAgent,
    hideAIAgent,
    toggleAIAgent,
    handleTextSelection,
    updateCursorPosition
  } = useAIAgent(editor);

  // Handle keyboard shortcuts only
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key === 'A') {
        event.preventDefault();
        toggleAIAgent();
      }
      
      if (event.key === 'Escape') {
        hideAIAgent();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [toggleAIAgent, hideAIAgent]);

  // Remove automatic text selection handling - users will trigger AI manually

  return {
    isAIAgentVisible,
    aiPosition,
    showAIAgent,
    hideAIAgent,
    toggleAIAgent
  };
};
