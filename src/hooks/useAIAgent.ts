
import { useState, useCallback } from 'react';
import { useSmartAIPositioning } from './useSmartAIPositioning';

interface TextSelection {
  text: string;
  start: number;
  end: number;
}

interface AIAgentHook {
  isAIAgentVisible: boolean;
  selectedText: string;
  cursorPosition: number;
  aiPosition: { x: number; y: number };
  showAIAgent: () => void;
  hideAIAgent: () => void;
  toggleAIAgent: () => void;
  handleTextSelection: (selection: TextSelection) => void;
  updateCursorPosition: (position: number) => void;
}

export const useAIAgent = (editor?: any): AIAgentHook => {
  const [selectedText, setSelectedText] = useState('');
  const [cursorPosition, setCursorPosition] = useState(0);

  const {
    position: aiPosition,
    isVisible: isAIAgentVisible,
    showAI: showAIAgent,
    hideAI: hideAIAgent,
    toggleAI: toggleAIAgent
  } = useSmartAIPositioning({
    selectedText,
    cursorPosition,
    editor
  });

  const handleTextSelection = useCallback((selection: TextSelection) => {
    setSelectedText(selection.text);
    setCursorPosition(selection.start);
  }, []);

  const updateCursorPosition = useCallback((position: number) => {
    setCursorPosition(position);
  }, []);

  return {
    isAIAgentVisible,
    selectedText,
    cursorPosition,
    aiPosition,
    showAIAgent,
    hideAIAgent,
    toggleAIAgent,
    handleTextSelection,
    updateCursorPosition
  };
};
