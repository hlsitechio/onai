
import React from 'react';
import NoteItem from './NoteItem';
import { AlertTriangle } from 'lucide-react';

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
  // Filter out system notes and categorize content
  const processedNotes = Object.entries(notes).filter(([noteId, content]) => {
    // Filter out system keys
    if (noteId.includes('encryption-key') || noteId.includes('settings')) {
      return false;
    }
    return true;
  }).map(([noteId, content]) => ({
    noteId,
    content,
    hasError: content.startsWith('[Error:') || content.includes('decrypt'),
    isEmpty: !content || content.trim().length === 0
  }));

  // Separate notes by status
  const validNotes = processedNotes.filter(note => !note.hasError && !note.isEmpty);
  const errorNotes = processedNotes.filter(note => note.hasError);
  const emptyNotes = processedNotes.filter(note => note.isEmpty);

  if (processedNotes.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500">
        <p className="text-xs">No saved notes yet</p>
        <p className="text-xs mt-1 opacity-70">Create your first note to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-1 overflow-y-auto">
      {/* Valid Notes */}
      {validNotes.map(({ noteId, content }) => (
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
      ))}

      {/* Error Notes Section */}
      {errorNotes.length > 0 && (
        <div className="mt-4 pt-3 border-t border-red-500/20">
          <div className="flex items-center gap-2 mb-2 text-xs text-red-400">
            <AlertTriangle className="h-3 w-3" />
            <span>Notes with issues ({errorNotes.length})</span>
          </div>
          {errorNotes.map(({ noteId, content }) => (
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
              className="opacity-60 border-red-500/20 bg-red-500/5"
            />
          ))}
        </div>
      )}

      {/* Empty Notes Section */}
      {emptyNotes.length > 0 && (
        <div className="mt-4 pt-3 border-t border-yellow-500/20">
          <div className="flex items-center gap-2 mb-2 text-xs text-yellow-400">
            <AlertTriangle className="h-3 w-3" />
            <span>Empty notes ({emptyNotes.length})</span>
          </div>
          {emptyNotes.map(({ noteId, content }) => (
            <NoteItem 
              key={noteId}
              noteId={noteId}
              content="[Empty note]"
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
              className="opacity-40 border-yellow-500/20"
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default NotesList;
