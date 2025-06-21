
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Plus, FileText, Folder } from 'lucide-react';

interface CreateMenuDropdownProps {
  onCreateNote?: () => void;
  onCreateFolder?: () => void;
}

const CreateMenuDropdown: React.FC<CreateMenuDropdownProps> = ({
  onCreateNote,
  onCreateFolder
}) => {
  const [isCreateMenuOpen, setIsCreateMenuOpen] = useState(false);

  const handleCreateNote = () => {
    console.log('Creating new note...');
    setIsCreateMenuOpen(false);
    if (onCreateNote) {
      onCreateNote();
    }
  };

  const handleCreateFolder = () => {
    console.log('Creating new folder...');
    setIsCreateMenuOpen(false);
    if (onCreateFolder) {
      onCreateFolder();
    }
  };

  return (
    <Popover open={isCreateMenuOpen} onOpenChange={setIsCreateMenuOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0 text-green-300 hover:text-green-200 hover:bg-green-500/20"
          title="Create new..."
        >
          <Plus className="h-3 w-3" />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-48 p-2 bg-black/95 backdrop-blur-xl border border-white/20 shadow-2xl z-[10000]"
        side="top"
        align="center"
        sideOffset={8}
      >
        <div className="flex flex-col gap-1">
          <Button
            onClick={handleCreateNote}
            variant="ghost"
            size="sm"
            className="justify-start text-white hover:bg-white/10 h-8"
          >
            <FileText className="h-4 w-4 mr-2" />
            Create Note
          </Button>
          <Button
            onClick={handleCreateFolder}
            variant="ghost"
            size="sm"
            className="justify-start text-white hover:bg-white/10 h-8"
          >
            <Folder className="h-4 w-4 mr-2" />
            Create Folder
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default CreateMenuDropdown;
