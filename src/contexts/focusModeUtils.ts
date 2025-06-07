import { createContext, useContext } from 'react';
import { FocusModeContextType } from './FocusModeTypes';

// Create the context with a default value
export const FocusModeContext = createContext<FocusModeContextType>({
  isFocusMode: false,
  setFocusMode: () => {},
});

// Custom hook to use the focus mode context
export const useFocusMode = () => useContext(FocusModeContext);
