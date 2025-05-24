
import { useState, useEffect } from 'react';

export const useCustomNamesManager = () => {
  const [customNoteNames, setCustomNoteNames] = useState<Record<string, string>>({});

  // Load custom names from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('onlinenote-custom-names');
    if (saved) {
      try {
        setCustomNoteNames(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading custom names:', error);
      }
    }
  }, []);

  // Save to localStorage whenever custom names change
  useEffect(() => {
    localStorage.setItem('onlinenote-custom-names', JSON.stringify(customNoteNames));
  }, [customNoteNames]);

  const updateCustomName = (noteId: string, name: string) => {
    setCustomNoteNames(prev => ({
      ...prev,
      [noteId]: name
    }));
  };

  const removeCustomName = (noteId: string) => {
    setCustomNoteNames(prev => {
      const updated = { ...prev };
      delete updated[noteId];
      return updated;
    });
  };

  const getCustomName = (noteId: string) => {
    return customNoteNames[noteId] || '';
  };

  return {
    customNoteNames,
    updateCustomName,
    removeCustomName,
    getCustomName
  };
};
