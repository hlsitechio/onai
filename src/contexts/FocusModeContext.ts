import { createContext } from 'react';

interface FocusModeContextType {
  focusMode: boolean;
  setFocusMode: (focusMode: boolean) => void;
}

// Default context values
const defaultContext: FocusModeContextType = {
  focusMode: false,
  setFocusMode: () => {},
};

// Create the context
const FocusModeContext = createContext<FocusModeContextType>(defaultContext);

// Export both named and default exports to support different import styles
export { FocusModeContext };
export default FocusModeContext;
