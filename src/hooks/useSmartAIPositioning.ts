
import { useState, useCallback, useEffect } from 'react';

interface Position {
  x: number;
  y: number;
}

interface UseSmartAIPositioningProps {
  selectedText: string;
  cursorPosition: number;
  editor?: any;
}

export const useSmartAIPositioning = ({
  selectedText,
  cursorPosition,
  editor
}: UseSmartAIPositioningProps) => {
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [triggerType, setTriggerType] = useState<'selection' | 'cursor' | 'manual'>('manual');

  const calculateOptimalPosition = useCallback((rect?: DOMRect) => {
    if (rect) {
      // Position near selection
      const x = Math.min(rect.right + 10, window.innerWidth - 400);
      const y = Math.max(rect.top - 10, 10);
      return { x, y };
    } else if (editor) {
      // Position near cursor
      try {
        const coords = editor.view.coordsAtPos(cursorPosition);
        const x = Math.min(coords.left + 20, window.innerWidth - 400);
        const y = Math.max(coords.top - 50, 10);
        return { x, y };
      } catch {
        // Fallback to center-right
        return {
          x: window.innerWidth - 420,
          y: Math.max(window.innerHeight * 0.2, 100)
        };
      }
    } else {
      // Default position
      return {
        x: window.innerWidth - 420,
        y: Math.max(window.innerHeight * 0.2, 100)
      };
    }
  }, [editor, cursorPosition]);

  const showAI = useCallback((type: 'selection' | 'cursor' | 'manual' = 'manual', rect?: DOMRect) => {
    const newPosition = calculateOptimalPosition(rect);
    setPosition(newPosition);
    setTriggerType(type);
    setIsVisible(true);
  }, [calculateOptimalPosition]);

  const hideAI = useCallback(() => {
    setIsVisible(false);
  }, []);

  const toggleAI = useCallback(() => {
    if (isVisible) {
      hideAI();
    } else {
      showAI('manual');
    }
  }, [isVisible, hideAI, showAI]);

  // Auto-show for text selection
  useEffect(() => {
    if (selectedText.trim() && selectedText.length > 10) {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const rect = selection.getRangeAt(0).getBoundingClientRect();
        showAI('selection', rect);
      }
    } else if (triggerType === 'selection') {
      // Hide if it was shown for selection and no text is selected
      hideAI();
    }
  }, [selectedText, showAI, hideAI, triggerType]);

  return {
    position,
    isVisible,
    triggerType,
    showAI,
    hideAI,
    toggleAI
  };
};
