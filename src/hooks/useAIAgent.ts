
import { useState, useCallback, useRef } from 'react';

interface TextSelection {
  text: string;
  start: number;
  end: number;
}

interface AIAgentHook {
  isAIAgentVisible: boolean;
  selectedText: string;
  cursorPosition: number;
  inlineActionsPosition: { x: number; y: number };
  isInlineActionsVisible: boolean;
  showAIAgent: () => void;
  hideAIAgent: () => void;
  toggleAIAgent: () => void;
  handleTextSelection: (selection: TextSelection) => void;
  showInlineActions: (x: number, y: number) => void;
  hideInlineActions: () => void;
  updateCursorPosition: (position: number) => void;
}

export const useAIAgent = (): AIAgentHook => {
  const [isAIAgentVisible, setIsAIAgentVisible] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [cursorPosition, setCursorPosition] = useState(0);
  const [inlineActionsPosition, setInlineActionsPosition] = useState({ x: 0, y: 0 });
  const [isInlineActionsVisible, setIsInlineActionsVisible] = useState(false);

  const showAIAgent = useCallback(() => {
    setIsAIAgentVisible(true);
  }, []);

  const hideAIAgent = useCallback(() => {
    setIsAIAgentVisible(false);
  }, []);

  const toggleAIAgent = useCallback(() => {
    setIsAIAgentVisible(prev => !prev);
  }, []);

  const handleTextSelection = useCallback((selection: TextSelection) => {
    setSelectedText(selection.text);
    setCursorPosition(selection.start);
    
    if (selection.text.trim()) {
      // Show inline actions for selected text
      const rect = window.getSelection()?.getRangeAt(0)?.getBoundingClientRect();
      if (rect) {
        showInlineActions(rect.right + 10, rect.top);
      }
    } else {
      hideInlineActions();
    }
  }, []);

  const showInlineActions = useCallback((x: number, y: number) => {
    setInlineActionsPosition({ x, y });
    setIsInlineActionsVisible(true);
  }, []);

  const hideInlineActions = useCallback(() => {
    setIsInlineActionsVisible(false);
  }, []);

  const updateCursorPosition = useCallback((position: number) => {
    setCursorPosition(position);
  }, []);

  return {
    isAIAgentVisible,
    selectedText,
    cursorPosition,
    inlineActionsPosition,
    isInlineActionsVisible,
    showAIAgent,
    hideAIAgent,
    toggleAIAgent,
    handleTextSelection,
    showInlineActions,
    hideInlineActions,
    updateCursorPosition
  };
};
