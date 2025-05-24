
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Filter } from "lucide-react";

interface NotesControlsProps {
  onSortNotes: () => void;
  onFilterNotes: () => void;
}

const NotesControls: React.FC<NotesControlsProps> = ({
  onSortNotes,
  onFilterNotes
}) => {
  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={onSortNotes}
        className="h-6 px-2 text-xs text-gray-400 hover:text-white hover:bg-white/10"
      >
        <ArrowUpDown className="h-3 w-3 mr-1" />
        Sort
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={onFilterNotes}
        className="h-6 px-2 text-xs text-gray-400 hover:text-white hover:bg-white/10"
      >
        <Filter className="h-3 w-3 mr-1" />
        Filter
      </Button>
    </div>
  );
};

export default NotesControls;
