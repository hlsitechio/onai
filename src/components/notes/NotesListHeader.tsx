
import React from 'react';
import { Clock } from "lucide-react";
import NotesStats from './NotesStats';

interface NotesListHeaderProps {
  notesCount: number;
  sortOrder: 'newest' | 'oldest' | 'alphabetical';
  notes: Record<string, string>;
  customNoteNames: Record<string, string>;
}

const NotesListHeader: React.FC<NotesListHeaderProps> = ({
  notesCount,
  sortOrder,
  notes,
  customNoteNames
}) => {
  return (
    <div className="flex items-center justify-between mb-3">
      <h4 className="text-xs uppercase text-noteflow-200 font-medium tracking-wider flex items-center">
        <Clock className="h-3 w-3 mr-1.5 text-noteflow-400/70" />
        Saved Notes
      </h4>
      <NotesStats 
        notesCount={notesCount} 
        sortOrder={sortOrder} 
        notes={notes} 
        customNoteNames={customNoteNames} 
      />
    </div>
  );
};

export default NotesListHeader;
