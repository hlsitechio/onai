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
  // Filter out system notes and handle decryption errors
  const userNotes = Object.entries(notes).filter(([noteId, content]) => {
    // Filter out system keys
    if (noteId.includes('encryption-key')) {
      return false;
    }
    
    // Keep notes even if they have decryption errors (they'll show error message)
    return true;
  });

  return (
    <div className="space-y-1 overflow-y-auto">
      {userNotes.length === 0 ? (
        <p className="text-xs text-slate-500">No saved notes yet</p>
      ) : (
        userNotes.map(([noteId, content]) => {
          // Check if this is a decryption error
          const isDecryptionError = content.startsWith('[Error: Could not decrypt note');
          
          return (
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
              // Add visual indicator for decryption errors
              className={isDecryptionError ? 'opacity-60 border-red-500/30' : ''}
            />
          );
        })
      )}
    </div>
  );
};

export default NotesList;
