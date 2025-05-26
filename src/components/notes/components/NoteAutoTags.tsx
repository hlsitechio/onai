
import React from 'react';
import { Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface NoteAutoTagsProps {
  autoTags: { name: string; color: string }[];
}

const NoteAutoTags: React.FC<NoteAutoTagsProps> = ({ autoTags }) => {
  if (autoTags.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-1 mt-2 pt-2 border-t border-white/5">
      <Tag className="h-3 w-3 text-noteflow-400 opacity-60" />
      <div className="flex gap-1 flex-wrap">
        {autoTags.map((tag) => (
          <Badge 
            key={tag.name} 
            variant="secondary" 
            className={`text-xs px-1.5 py-0.5 ${tag.color} hover:opacity-80 transition-opacity cursor-pointer`}
          >
            {tag.name}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default NoteAutoTags;
