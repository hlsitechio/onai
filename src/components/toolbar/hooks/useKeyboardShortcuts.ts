
import { useEffect } from 'react';
import { getActiveEditor } from '../utils/editorUtils';
import { handleBold, handleItalic, handleUnderline, handleInsertLink, handleHeading } from '../utils/formattingUtils';

export const useKeyboardShortcuts = () => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only trigger if we have an active editor
      if (!getActiveEditor()) return;
      
      // Check for Ctrl/Cmd key combinations
      const isCtrlOrCmd = e.ctrlKey || e.metaKey;
      
      if (isCtrlOrCmd) {
        switch (e.key.toLowerCase()) {
          case 'b':
            e.preventDefault();
            handleBold();
            break;
          case 'i':
            e.preventDefault();
            handleItalic();
            break;
          case 'u':
            e.preventDefault();
            handleUnderline();
            break;
          case 'k':
            e.preventDefault();
            handleInsertLink();
            break;
        }
        
        // Check for Shift combinations
        if (e.shiftKey) {
          switch (e.key) {
            case '!': // Ctrl+Shift+1
              e.preventDefault();
              handleHeading(1);
              break;
            case '@': // Ctrl+Shift+2
              e.preventDefault();
              handleHeading(2);
              break;
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);
};
