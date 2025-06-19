
import React from 'react';
import NoteItem from './NoteItem';

interface DraggableNoteItemProps {
  noteId: string;
  content: string;
  isActive: boolean;
  onLoadNote: (noteId: string) => void;
  onDeleteNote: (noteId: string, e: React.MouseEvent) => void;
  onOpenShare: (noteId: string) => void;
  onRenameNote: (oldNoteId: string, newNoteId: string) => Promise<boolean>;
  formatNoteId: (id: string) => string;
  displayName?: string;
}

const DraggableNoteItem: React.FC<DraggableNoteItemProps> = (props) => {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/note-id', props.noteId);
    e.dataTransfer.effectAllowed = 'move';
    
    // Add visual feedback
    const dragElement = e.currentTarget as HTMLElement;
    dragElement.style.opacity = '0.5';
  };

  const handleDragEnd = (e: React.DragEvent) => {
    const dragElement = e.currentTarget as HTMLElement;
    dragElement.style.opacity = '1';
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className="cursor-move"
    >
      <NoteItem {...props} />
    </div>
  );
};

export default DraggableNoteItem;
