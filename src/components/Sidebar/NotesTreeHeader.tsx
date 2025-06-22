
import React from 'react';
import CreateButton from './CreateButton';

interface NotesTreeHeaderProps {
  onCreateFolder: (name: string) => Promise<void>;
  onCreateNote: (title: string) => Promise<void>;
}

const NotesTreeHeader: React.FC<NotesTreeHeaderProps> = ({ onCreateFolder, onCreateNote }) => {
  return (
    <div className="flex items-center justify-between mb-2">
      <span className="text-sm font-medium text-muted-foreground">Notes</span>
      <CreateButton onCreateFolder={onCreateFolder} onCreateNote={onCreateNote} />
    </div>
  );
};

export default NotesTreeHeader;
