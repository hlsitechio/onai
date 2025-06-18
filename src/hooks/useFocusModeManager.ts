
import { useState, useCallback } from 'react';

export const useFocusModeManager = () => {
  const [isFocusMode, setIsFocusMode] = useState(false);

  const toggleFocusMode = useCallback(() => {
    setIsFocusMode(prev => !prev);
  }, []);

  const enterFocusMode = useCallback(() => {
    setIsFocusMode(true);
  }, []);

  const exitFocusMode = useCallback(() => {
    setIsFocusMode(false);
  }, []);

  return {
    isFocusMode,
    toggleFocusMode,
    enterFocusMode,
    exitFocusMode,
  };
};
