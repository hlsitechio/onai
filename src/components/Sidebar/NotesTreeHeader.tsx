
import React from 'react';
import CreateFolderButton from './CreateFolderButton';

interface NotesTreeHeaderProps {
  onCreateFolder: (name: string) => Promise<void>;
}

const NotesTreeHeader: React.FC<NotesTreeHeaderProps> = ({ onCreateFolder }) => {
  return (
    <div className="flex items-center justify-between mb-2">
      <span className="text-sm font-medium text-muted-foreground">Notes</span>
      <CreateFolderButton onCreateFolder={onCreateFolder} />
    </div>
  );
};

export default NotesTreeHeader;
