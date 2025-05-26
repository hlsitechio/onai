
import React from 'react';
import { ArrowRight, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface NoteActionsProps {
  noteId: string;
  isHovered: boolean;
  isActive: boolean;
  onOpenShare: (noteId: string) => void;
  onDeleteNote: (noteId: string, e: React.MouseEvent) => void;
}

const NoteActions: React.FC<NoteActionsProps> = ({
  noteId,
  isHovered,
  isActive,
  onOpenShare,
  onDeleteNote
}) => {
  return (
    <div className={`flex gap-1 transition-opacity duration-200 ${isHovered || isActive ? 'opacity-100' : 'opacity-0'}`}>
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              size="icon"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                onOpenShare(noteId);
              }}
              className="h-6 w-6 p-1 hover:bg-noteflow-500/20 rounded hover:text-noteflow-400 transition-all group"
            >
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top" className="bg-black/80 border-white/10 text-xs">
            Share note
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              onClick={(e) => onDeleteNote(noteId, e)}
              className="h-6 w-6 p-1 hover:bg-red-500/20 rounded hover:text-red-400 transition-all group"
            >
              <Trash2 className="h-3.5 w-3.5 group-hover:scale-110 transition-transform" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top" className="bg-black/80 border-white/10 text-xs">
            Delete note
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default NoteActions;
