
import React from 'react';
import { ArrowRight, Trash2 } from "lucide-react";

interface NoteItemProps {
  noteId: string;
  content: string;
  isActive: boolean;
  onLoadNote: (noteId: string) => void;
  onDeleteNote: (noteId: string, e: React.MouseEvent) => void;
  onOpenShare: (noteId: string) => void;
  formatNoteId: (id: string) => string;
}

const NoteItem: React.FC<NoteItemProps> = ({
  noteId, 
  isActive, 
  onLoadNote, 
  onDeleteNote,
  onOpenShare,
  formatNoteId
}) => {
  return (
    <div 
      className={`p-2 rounded-md flex justify-between items-center cursor-pointer ${
        isActive ? 'bg-white/10' : 'hover:bg-white/5'
      }`}
      onClick={() => onLoadNote(noteId)}
    >
      <span className="text-sm text-white truncate">{formatNoteId(noteId)}</span>
      <div className="flex gap-1">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onOpenShare(noteId);
          }}
          className="p-1 hover:bg-white/10 rounded"
        >
          <ArrowRight className="h-4 w-4 text-slate-400" />
        </button>
        <button 
          onClick={(e) => onDeleteNote(noteId, e)}
          className="p-1 hover:bg-white/10 rounded"
        >
          <Trash2 className="h-4 w-4 text-slate-400" />
        </button>
      </div>
    </div>
  );
};

export default NoteItem;
