import React, { useState, ReactNode } from 'react';
import { FocusModeContext } from './focusModeUtils';

// Provider component that wraps app and provides the focus mode state
// This file only exports a component for better Fast Refresh support
export const FocusModeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isFocusMode, setFocusMode] = useState(false);

  return (
    <FocusModeContext.Provider value={{ isFocusMode, setFocusMode }}>
      {children}
    </FocusModeContext.Provider>
  );
};
