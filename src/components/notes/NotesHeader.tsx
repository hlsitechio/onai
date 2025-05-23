
import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Search, FolderOpen, Keyboard } from "lucide-react";

interface NotesHeaderProps {
  onCreateNew: () => void;
  isSearching: boolean;
  onSearchToggle: () => void;
  onShowShortcuts: () => void;
}

const NotesHeader: React.FC<NotesHeaderProps> = ({
  onCreateNew,
  isSearching,
  onSearchToggle,
  onShowShortcuts
}) => {
  return (
    <div className="flex items-center justify-between mb-2 animate-slideDown" style={{animationDelay: '0.1s'}}>
      <h3 className="text-sm sm:text-base font-semibold text-white flex items-center">
        <FolderOpen className="h-4 w-4 mr-2 text-noteflow-400" />
        My Notes
      </h3>
      <div className="flex space-x-1">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onCreateNew}
          className="h-7 w-7 rounded-full hover:bg-noteflow-500/20 hover:text-noteflow-400 transition-all group"
          title="Create new note"
        >
          <Plus className="h-4 w-4 group-hover:scale-110 group-hover:rotate-90 transition-all duration-300" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onSearchToggle}
          className={`h-7 w-7 rounded-full transition-all group ${isSearching ? 'bg-noteflow-500/20 text-noteflow-400' : 'hover:bg-noteflow-500/20 hover:text-noteflow-400'}`}
          title="Search notes"
        >
          <Search className="h-4 w-4 group-hover:scale-110 transition-all duration-300" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onShowShortcuts}
          className="h-7 w-7 rounded-full hover:bg-noteflow-500/20 hover:text-noteflow-400 transition-all group"
          title="Keyboard shortcuts"
        >
          <Keyboard className="h-4 w-4 group-hover:scale-110 transition-all duration-300" />
        </Button>
      </div>
    </div>
  );
};

export default NotesHeader;
