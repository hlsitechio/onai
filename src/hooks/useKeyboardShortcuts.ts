
import { useEffect, useCallback } from 'react';

interface KeyboardShortcuts {
  [key: string]: () => void;
}

interface UseKeyboardShortcutsProps {
  [shortcut: string]: () => void;
}

export const useKeyboardShortcuts = (shortcuts: UseKeyboardShortcutsProps) => {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Build the shortcut string based on pressed keys
    const parts: string[] = [];
    
    if (event.ctrlKey || event.metaKey) parts.push('ctrl');
    if (event.shiftKey) parts.push('shift');
    if (event.altKey) parts.push('alt');
    
    // Add the main key
    if (event.key && event.key !== 'Control' && event.key !== 'Shift' && event.key !== 'Alt' && event.key !== 'Meta') {
      parts.push(event.key.toLowerCase());
    }
    
    const shortcutString = parts.join('+');
    
    // Check if this shortcut exists in our shortcuts object
    if (shortcuts[shortcutString]) {
      event.preventDefault();
      shortcuts[shortcutString]();
    }
  }, [shortcuts]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
};
