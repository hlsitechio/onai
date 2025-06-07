import { useContext } from 'react';
import FocusModeContext from './FocusModeContext';

// Custom hook to use the focus mode context
export const useFocusMode = () => useContext(FocusModeContext);
