
import { useEffect, useCallback } from 'react';

interface UseKeyboardShortcutsProps {
  handleSave: () => void;
  toggleFocusMode: () => void;
  toggleLeftSidebar: () => void;
  toggleAISidebar: () => void;
  isFocusMode: boolean;
  setFocusMode: (value: boolean) => void;
}

export const useKeyboardShortcuts = ({
  handleSave,
  toggleFocusMode,
  toggleLeftSidebar,
  toggleAISidebar,
  isFocusMode,
  setFocusMode
}: UseKeyboardShortcutsProps) => {
  const handleKeyboardShortcut = useCallback((e: KeyboardEvent) => {
    // Ctrl+S for save
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      handleSave();
    }
    
    // F11 for focus mode
    if (e.key === 'F11') {
      e.preventDefault();
      toggleFocusMode();
    }
    
    // Ctrl+B for sidebar toggle
    if (e.ctrlKey && e.key === 'b') {
      e.preventDefault();
      toggleLeftSidebar();
    }
    
    // Ctrl+G for AI sidebar
    if (e.ctrlKey && e.key === 'g') {
      e.preventDefault();
      toggleAISidebar();
    }
    
    // Escape to exit focus mode
    if (e.key === 'Escape' && isFocusMode) {
      e.preventDefault();
      setFocusMode(false);
    }
    
    // Note: Removed CTRL+SHIFT+A functionality as it's now in the AI Agent dropdown
  }, [handleSave, isFocusMode, toggleFocusMode, toggleLeftSidebar, toggleAISidebar, setFocusMode]);
  
  // Register the keyboard shortcut effect
  useEffect(() => {
    window.addEventListener('keydown', handleKeyboardShortcut);
    return () => window.removeEventListener('keydown', handleKeyboardShortcut);
  }, [handleKeyboardShortcut]);
};
