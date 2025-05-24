
import React from 'react';
import { Button } from "@/components/ui/button";
import { SortAsc, Filter } from "lucide-react";

interface NotesControlsProps {
  onSortNotes: () => void;
  onFilterNotes: () => void;
}

const NotesControls: React.FC<NotesControlsProps> = ({ onSortNotes, onFilterNotes }) => {
  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={onSortNotes}
        className="h-6 px-2 text-xs hover:bg-white/10 hover:text-white"
        title="Sort by date"
      >
        <SortAsc className="h-3 w-3 mr-1" />
        Sort
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={onFilterNotes}
        className="h-6 px-2 text-xs hover:bg-white/10 hover:text-white"
        title="Filter notes"
      >
        <Filter className="h-3 w-3 mr-1" />
        Filter
      </Button>
    </div>
  );
};

export default NotesControls;
