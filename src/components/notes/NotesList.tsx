
import React from 'react';
import NoteItem from './NoteItem';

interface NotesListProps {
  notes: Record<string, string>;
  activeNoteId: string;
  onLoadNote: (noteId: string) => void;
  onDeleteNote: (noteId: string, e: React.MouseEvent) => void;
  onOpenShare: (noteId: string) => void;
  formatNoteId: (id: string) => string;
}

const NotesList: React.FC<NotesListProps> = ({
  notes,
  activeNoteId,
  onLoadNote,
  onDeleteNote,
  onOpenShare,
  formatNoteId
}) => {
  return (
    <div className="space-y-1 overflow-y-auto">
      {Object.entries(notes).length === 0 ? (
        <p className="text-xs text-slate-500">No saved notes yet</p>
      ) : (
        Object.entries(notes).map(([noteId, content]) => (
          <NoteItem 
            key={noteId}
            noteId={noteId}
            content={content}
            isActive={activeNoteId === noteId}
            onLoadNote={onLoadNote}
            onDeleteNote={onDeleteNote}
            onOpenShare={onOpenShare}
            formatNoteId={formatNoteId}
          />
        ))
      )}
    </div>
  );
};

export default NotesList;
