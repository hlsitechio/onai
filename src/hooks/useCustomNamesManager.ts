
import { useState, useEffect } from 'react';

interface CustomNamesManager {
  customNoteNames: Record<string, string>;
  updateCustomName: (noteId: string, displayName: string) => void;
  removeCustomName: (noteId: string) => void;
}

export const useCustomNamesManager = (): CustomNamesManager => {
  const [customNoteNames, setCustomNoteNames] = useState<Record<string, string>>({});

  useEffect(() => {
    // Load custom note names from local storage
    const savedNames = localStorage.getItem('noteflow-custom-names');
    if (savedNames) {
      try {
        setCustomNoteNames(JSON.parse(savedNames));
      } catch (e) {
        console.error('Error loading custom note names:', e);
      }
    }
  }, []);

  const updateCustomName = (noteId: string, displayName: string) => {
    const updatedNames = { ...customNoteNames, [noteId]: displayName };
    setCustomNoteNames(updatedNames);
    localStorage.setItem('noteflow-custom-names', JSON.stringify(updatedNames));
  };

  const removeCustomName = (noteId: string) => {
    const updatedNames = { ...customNoteNames };
    delete updatedNames[noteId];
    setCustomNoteNames(updatedNames);
    localStorage.setItem('noteflow-custom-names', JSON.stringify(updatedNames));
  };

  return {
    customNoteNames,
    updateCustomName,
    removeCustomName
  };
};
