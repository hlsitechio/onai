
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Save, FileText, Folder } from 'lucide-react';

interface CreateMenuDropdownProps {
  onSaveNote?: () => void;
  onCreateNote?: () => void;
  onCreateFolder?: () => void;
  saving?: boolean;
}

const CreateMenuDropdown: React.FC<CreateMenuDropdownProps> = ({
  onSaveNote,
  onCreateNote,
  onCreateFolder,
  saving = false
}) => {
  const [isCreateMenuOpen, setIsCreateMenuOpen] = useState(false);

  const handleSaveNote = () => {
    console.log('Saving current note...');
    setIsCreateMenuOpen(false);
    if (onSaveNote) {
      onSaveNote();
    }
  };

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
          title="Save or create..."
          disabled={saving}
        >
          {saving ? (
            <div className="animate-spin h-3 w-3 border-2 border-green-300/30 border-t-green-300 rounded-full" />
          ) : (
            <Save className="h-3 w-3" />
          )}
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
            onClick={handleSaveNote}
            variant="ghost"
            size="sm"
            className="justify-start text-white hover:bg-white/10 h-8"
            disabled={saving}
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving to Supabase...' : 'Save to Supabase'}
          </Button>
          <Button
            onClick={handleCreateNote}
            variant="ghost"
            size="sm"
            className="justify-start text-white hover:bg-white/10 h-8"
          >
            <FileText className="h-4 w-4 mr-2" />
            Create New Note
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
