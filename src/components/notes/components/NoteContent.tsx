
import React from 'react';
import { FileEdit } from "lucide-react";

interface NoteContentProps {
  title: string;
  content: string;
  isActive: boolean;
  onTitleClick: (e: React.MouseEvent) => void;
}

const NoteContent: React.FC<NoteContentProps> = ({
  title,
  content,
  isActive,
  onTitleClick
}) => {
  return (
    <div className="flex items-start space-x-2 flex-1 min-w-0">
      <FileEdit className={`h-3.5 w-3.5 text-noteflow-400 mt-0.5 shrink-0 ${isActive ? 'opacity-100' : 'opacity-50'}`} />
      <div className="flex-1 min-w-0">
        <button
          onClick={onTitleClick}
          className="text-sm text-white truncate max-w-full text-left hover:text-noteflow-300 transition-colors font-medium"
        >
          {title}
        </button>
        <p className="text-xs text-slate-400 mt-1 line-clamp-2">
          {content.substring(0, 80)}...
        </p>
      </div>
    </div>
  );
};

export default NoteContent;
