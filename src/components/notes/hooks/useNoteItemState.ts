
import { useState, useEffect } from 'react';

export const useNoteItemState = (noteId: string, displayName?: string, content?: string) => {
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  
  // Generate a clean title from content or use custom name
  const getCleanTitle = () => {
    if (displayName && displayName.trim()) {
      return displayName;
    }
    
    // Extract first meaningful line from content
    const firstLine = content?.split('\n')[0].trim() || '';
    if (firstLine && firstLine.length > 0) {
      return firstLine.substring(0, 50) + (firstLine.length > 50 ? '...' : '');
    }
    
    // Fallback to a simple "Note" with creation info
    return `Note ${new Date().toLocaleDateString()}`;
  };
  
  // Initialize with clean title
  useEffect(() => {
    setNewName(getCleanTitle());
  }, [noteId, displayName, content]);

  return {
    isRenaming,
    setIsRenaming,
    newName,
    setNewName,
    isHovered,
    setIsHovered,
    getCleanTitle
  };
};
