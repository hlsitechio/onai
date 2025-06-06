
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useCustomNamesManager } from "@/hooks/useCustomNamesManager";
import { renameNote } from "@/utils/notesStorage";

interface UseNotesManagerProps {
  allNotes: Record<string, string>;
  onLoadNote: (content: string) => void;
  onDeleteNote: (noteId: string) => Promise<boolean>;
  onCreateNew: () => void;
}

export const useNotesManager = ({
  allNotes,
  onLoadNote,
  onDeleteNote,
  onCreateNew
}: UseNotesManagerProps) => {
  const { toast } = useToast();
  const { customNoteNames, updateCustomName, removeCustomName } = useCustomNamesManager();
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [activeNoteId, setActiveNoteId] = useState<string>('current');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'alphabetical'>('newest');
  const [filterType, setFilterType] = useState<'all' | 'recent' | 'favorites'>('all');

  useEffect(() => {
    setNotes(allNotes);
  }, [allNotes]);

  const formatNoteId = (id: string): string => {
    if (id === 'current') return 'Current Note';
    
    // Always try to get a clean title from content first
    const content = notes[id] || '';
    if (content) {
      const firstLine = content.split('\n')[0].trim();
      if (firstLine && firstLine.length > 0) {
        return firstLine.substring(0, 50) + (firstLine.length > 50 ? '...' : '');
      }
    }
    
    // Fallback for timestamp-based IDs
    try {
      const timestamp = Number(id);
      if (!isNaN(timestamp)) {
        const date = new Date(timestamp);
        if (date.toString() !== 'Invalid Date') {
          return `Note ${date.toLocaleDateString()}`;
        }
      }
    } catch (e) {
      // Continue to final fallback
    }
    
    // Final fallback - avoid showing UUIDs
    return 'Untitled Note';
  };

  const handleLoadNote = (noteId: string) => {
    setActiveNoteId(noteId);
    onLoadNote(notes[noteId]);
    
    const displayName = customNoteNames[noteId] || formatNoteId(noteId);
    toast({
      title: "Note loaded",
      description: `Loaded "${displayName}"`
    });
  };

  const handleDeleteNote = async (noteId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const success = await onDeleteNote(noteId);
    
    if (success) {
      removeCustomName(noteId);
      const displayName = customNoteNames[noteId] || formatNoteId(noteId);
      toast({
        title: "Note deleted",
        description: `Deleted "${displayName}"`
      });
    }
  };

  const handleRenameNote = async (oldNoteId: string, newNoteId: string): Promise<boolean> => {
    try {
      // Get the custom name that was set during editing
      const inputElement = document.querySelector(`input[value]`) as HTMLInputElement | null;
      const displayName = inputElement?.value || formatNoteId(oldNoteId);
      
      const result = await renameNote(oldNoteId, newNoteId);
      
      if (result.success) {
        // Remove old custom name and set new one
        removeCustomName(oldNoteId);
        updateCustomName(newNoteId, displayName);
        
        if (activeNoteId === oldNoteId) {
          setActiveNoteId(newNoteId);
        }
        
        toast({
          title: "Note renamed",
          description: `Renamed to "${displayName}"`
        });
        
        return true;
      } else {
        toast({
          title: "Error renaming note",
          description: result.error || "An unknown error occurred",
          variant: "destructive"
        });
        return false;
      }
    } catch (e) {
      console.error('Error renaming note:', e);
      toast({
        title: "Error renaming note",
        description: e instanceof Error ? e.message : "An unknown error occurred",
        variant: "destructive"
      });
      return false;
    }
  };

  const handleNewNote = () => {
    setActiveNoteId('current');
    onCreateNew();
    toast({
      title: "New note created",
      description: "Started a fresh note"
    });
  };

  const handleSortNotes = () => {
    const nextSort = sortOrder === 'newest' ? 'oldest' : sortOrder === 'oldest' ? 'alphabetical' : 'newest';
    setSortOrder(nextSort);
    toast({
      title: "Sort order changed",
      description: `Notes sorted by ${nextSort === 'newest' ? 'newest first' : nextSort === 'oldest' ? 'oldest first' : 'alphabetical order'}`
    });
  };

  const handleFilterNotes = () => {
    const nextFilter = filterType === 'all' ? 'recent' : filterType === 'recent' ? 'favorites' : 'all';
    setFilterType(nextFilter);
    toast({
      title: "Filter changed",
      description: `Showing ${nextFilter} notes`
    });
  };

  return {
    notes,
    activeNoteId,
    sortOrder,
    filterType,
    customNoteNames,
    formatNoteId,
    handleLoadNote,
    handleDeleteNote,
    handleRenameNote,
    handleNewNote,
    handleSortNotes,
    handleFilterNotes
  };
};
