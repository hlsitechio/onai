
import React from 'react';
import NoteItem from './NoteItem';

interface NotesListProps {
  notes: Record<string, string>;
  activeNoteId: string;
  onLoadNote: (noteId: string) => void;
  onDeleteNote: (noteId: string, e: React.MouseEvent) => void;
  onOpenShare: (noteId: string) => void;
  onRenameNote?: (oldNoteId: string, newNoteId: string) => Promise<boolean>;
  formatNoteId: (id: string) => string;
  customNoteNames?: Record<string, string>;
}

const NotesList: React.FC<NotesListProps> = ({
  notes,
  activeNoteId,
  onLoadNote,
  onDeleteNote,
  onOpenShare,
  onRenameNote,
  formatNoteId,
  customNoteNames = {}
}) => {
  // Filter out any system notes (like encryption-key) that may have slipped through
  const userNotes = Object.entries(notes).filter(([noteId]) => 
    !noteId.includes('encryption-key')
  );

  return (
    <div className="space-y-1 overflow-y-auto">
      {userNotes.length === 0 ? (
        <p className="text-xs text-slate-500">No saved notes yet</p>
      ) : (
        userNotes.map(([noteId, content]) => (
          <NoteItem 
            key={noteId}
            noteId={noteId}
            content={content}
            isActive={activeNoteId === noteId}
            onLoadNote={onLoadNote}
            onDeleteNote={onDeleteNote}
            onOpenShare={onOpenShare}
            onRenameNote={async (oldId, newId) => {
              if (onRenameNote) {
                return await onRenameNote(oldId, newId);
              }
              return false;
            }}
            formatNoteId={formatNoteId}
            displayName={customNoteNames[noteId]}
          />
        ))
      )}
    </div>
  );
};

export default NotesList;
