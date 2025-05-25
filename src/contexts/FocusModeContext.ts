import { createContext } from 'react';
import { FocusModeContextType } from './FocusModeTypes';

// Default context values
const defaultContext: FocusModeContextType = {
  isFocusMode: false,
  setFocusMode: () => {},
};

// Create the context
const FocusModeContext = createContext<FocusModeContextType>(defaultContext);

// Export both named and default exports to support different import styles
export { FocusModeContext };
export default FocusModeContext;
