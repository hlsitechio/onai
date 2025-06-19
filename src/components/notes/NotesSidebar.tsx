
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import FolderTree from './FolderTree';

const NotesSidebar: React.FC = () => {
  const handleNoteSelect = (noteId: string) => {
    console.log('Selected note:', noteId);
    // This would be handled by the parent component to load the note
  };

  const handleCreateNote = () => {
    console.log('Create new note');
    // This would be handled by the parent component
  };

  return (
    <div className="w-80 bg-black/20 backdrop-blur-sm border-r border-white/10 flex flex-col">
      <div className="p-4 border-b border-white/10">
        <h2 className="text-lg font-semibold text-white">Notes & Folders</h2>
      </div>

      <ScrollArea className="flex-1">
        <FolderTree
          onNoteSelect={handleNoteSelect}
          onCreateNote={handleCreateNote}
        />
      </ScrollArea>
    </div>
  );
};

export default NotesSidebar;
