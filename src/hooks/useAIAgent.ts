
import { useState, useCallback } from 'react';
import { Editor } from '@tiptap/react';

export interface AIPosition {
  x: number;
  y: number;
}

export interface TextSelection {
  text: string;
  start: number;
  end: number;
}

export const useAIAgent = (editor: Editor | null) => {
  const [isAIAgentVisible, setIsAIAgentVisible] = useState(false);
  const [aiPosition, setAiPosition] = useState<AIPosition>({ x: 0, y: 0 });

  const showAIAgent = useCallback((position?: AIPosition) => {
    if (position) {
      setAiPosition(position);
    } else {
      // Default to center of screen
      setAiPosition({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
      });
    }
    setIsAIAgentVisible(true);
  }, []);

  const hideAIAgent = useCallback(() => {
    setIsAIAgentVisible(false);
  }, []);

  const toggleAIAgent = useCallback(() => {
    if (isAIAgentVisible) {
      hideAIAgent();
    } else {
      showAIAgent();
    }
  }, [isAIAgentVisible, hideAIAgent, showAIAgent]);

  const handleTextSelection = useCallback((selection: TextSelection) => {
    if (selection.text.trim() && editor) {
      // Get the selection coordinates for positioning
      const { from } = editor.state.selection;
      const coords = editor.view.coordsAtPos(from);
      
      showAIAgent({
        x: coords.left,
        y: coords.top - 50, // Position above the selection
      });
    }
  }, [editor, showAIAgent]);

  const updateCursorPosition = useCallback((position: number) => {
    if (editor) {
      const coords = editor.view.coordsAtPos(position);
      setAiPosition({
        x: coords.left,
        y: coords.top - 50,
      });
    }
  }, [editor]);

  return {
    isAIAgentVisible,
    aiPosition,
    showAIAgent,
    hideAIAgent,
    toggleAIAgent,
    handleTextSelection,
    updateCursorPosition,
  };
};
