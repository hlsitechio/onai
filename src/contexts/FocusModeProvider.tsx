import React, { useState, ReactNode } from 'react';
import FocusModeContext from './FocusModeContext';

interface FocusModeProviderProps {
  children: ReactNode;
  initialFocusMode?: boolean;
}

/**
 * Provider component for the Focus Mode functionality
 * Wraps the application and provides focus mode state management
 */
export const FocusModeProvider: React.FC<FocusModeProviderProps> = ({ 
  children, 
  initialFocusMode = false 
}) => {
  // State to track whether focus mode is enabled
  const [isFocusMode, setFocusMode] = useState<boolean>(initialFocusMode);

  // Value object to be provided to consumers
  const contextValue = {
    isFocusMode,
    setFocusMode
  };

  return (
    <FocusModeContext.Provider value={contextValue}>
      {children}
    </FocusModeContext.Provider>
  );
};

export default FocusModeProvider;
