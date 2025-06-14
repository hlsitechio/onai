
import React from 'react';
import { getSortedAndFilteredNotes } from "@/utils/notesFiltering";
import NotesList from './NotesList';
import NotesListHeader from './NotesListHeader';

interface NotesContentProps {
  notes: Record<string, string>;
  searchQuery: string;
  sortOrder: 'newest' | 'oldest' | 'alphabetical';
  filterType: 'all' | 'recent' | 'favorites';
  customNoteNames: Record<string, string>;
  formatNoteId: (id: string) => string;
  activeNoteId: string;
  onLoadNote: (noteId: string) => void;
  onDeleteNote: (noteId: string, e: React.MouseEvent) => void;
  onOpenShare: (noteId: string) => void;
  onRenameNote: (oldNoteId: string, newNoteId: string) => Promise<boolean>;
}

const NotesContent: React.FC<NotesContentProps> = ({
  notes,
  searchQuery,
  sortOrder,
  filterType,
  customNoteNames,
  formatNoteId,
  activeNoteId,
  onLoadNote,
  onDeleteNote,
  onOpenShare,
  onRenameNote
}) => {
  const getSortedAndFilteredNotesData = () => {
    return getSortedAndFilteredNotes(notes, searchQuery, sortOrder, filterType, customNoteNames, formatNoteId);
  };

  return (
    <>
      <NotesListHeader
        notesCount={Object.keys(notes).length}
        sortOrder={sortOrder}
        notes={notes}
        customNoteNames={customNoteNames}
      />
      
      <NotesList 
        notes={getSortedAndFilteredNotesData()} 
        activeNoteId={activeNoteId} 
        onLoadNote={onLoadNote} 
        onDeleteNote={onDeleteNote} 
        onOpenShare={onOpenShare} 
        onRenameNote={onRenameNote} 
        formatNoteId={formatNoteId} 
        customNoteNames={customNoteNames} 
      />
    </>
  );
};

export default NotesContent;
