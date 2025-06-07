
import { useEffect } from 'react';
import { useFocusMode } from '@/contexts';

export const useFocusModeManager = () => {
  const { isFocusMode, setFocusMode } = useFocusMode();

  // Update document data attribute when focus mode changes
  useEffect(() => {
    // Set focus mode on both body and document element for maximum coverage
    document.body.setAttribute('data-focus-mode', isFocusMode.toString());
    document.documentElement.setAttribute('data-focus-mode', isFocusMode.toString());
    
    // Prevent scrolling in focus mode
    if (isFocusMode) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.height = '100%';
      document.body.style.backgroundColor = 'black';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
      document.body.style.backgroundColor = '';
    }
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
      document.body.style.backgroundColor = '';
    };
  }, [isFocusMode]);

  const toggleFocusMode = () => {
    setFocusMode(!isFocusMode);
  };

  return {
    isFocusMode,
    setFocusMode,
    toggleFocusMode
  };
};
