
import React from 'react';

interface NotesStatsProps {
  notesCount: number;
  sortOrder: string;
}

const NotesStats: React.FC<NotesStatsProps> = ({ notesCount, sortOrder }) => {
  return (
    <div className="flex items-center space-x-1">
      <span className="text-xs text-gray-500 px-1.5 py-0.5 bg-white/5 rounded-md">
        {notesCount}
      </span>
      <span className="text-xs text-gray-500 px-1.5 py-0.5 bg-white/5 rounded-md">
        {sortOrder}
      </span>
    </div>
  );
};

export default NotesStats;
