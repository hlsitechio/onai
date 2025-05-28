
import { useState, useEffect, useCallback } from 'react';

export const useNoteItemState = (noteId: string, displayName?: string, content?: string) => {
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  
  // Generate a clean title from content or use custom name
  const getCleanTitle = useCallback(() => {
    // Use custom display name if available
    if (displayName && displayName.trim()) {
      return displayName;
    }
    
    // Encryption detection disabled
    // Previously checked if content was encrypted, now we always show content
    
    // Extract first meaningful line from content
    const firstLine = content?.split('\n')[0].trim() || '';
    if (firstLine && firstLine.length > 0) {
      return firstLine.substring(0, 50) + (firstLine.length > 50 ? '...' : '');
    }
    
    // Fallback to a simple "Note" with creation info
    return `Note ${new Date().toLocaleDateString()}`;
  }, [displayName, content]);
  
  // Initialize with clean title
  useEffect(() => {
    setNewName(getCleanTitle());
  }, [noteId, displayName, content, getCleanTitle]);

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
