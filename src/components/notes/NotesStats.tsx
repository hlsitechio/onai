
import React from 'react';
import { getNotesStats } from '@/utils/notesFiltering';

interface NotesStatsProps {
  notesCount: number;
  sortOrder: 'newest' | 'oldest' | 'alphabetical';
  notes?: Record<string, string>;
  customNoteNames?: Record<string, string>;
}

const NotesStats: React.FC<NotesStatsProps> = ({ 
  notesCount, 
  sortOrder, 
  notes = {}, 
  customNoteNames = {} 
}) => {
  const stats = getNotesStats(notes, customNoteNames);
  
  const getSortLabel = () => {
    switch (sortOrder) {
      case 'newest': return 'Newest';
      case 'oldest': return 'Oldest';
      case 'alphabetical': return 'A-Z';
      default: return 'Newest';
    }
  };

  return (
    <div className="flex items-center justify-between text-xs text-gray-400">
      <div className="flex items-center space-x-2">
        <span className="bg-noteflow-600/20 text-noteflow-300 px-2 py-1 rounded-md">
          {notesCount} notes
        </span>
        <span className="text-gray-500">•</span>
        <span className="text-gray-400">
          {getSortLabel()}
        </span>
      </div>
      
      {stats.totalWordCount > 0 && (
        <div className="flex items-center space-x-1">
          <span className="text-gray-500">{stats.totalWordCount.toLocaleString()} words</span>
        </div>
      )}
    </div>
  );
};

export default NotesStats;
