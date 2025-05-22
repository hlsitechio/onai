
import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, Trash2, Edit2, Check, X, FileEdit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface NoteItemProps {
  noteId: string;
  content: string;
  isActive: boolean;
  onLoadNote: (noteId: string) => void;
  onDeleteNote: (noteId: string, e: React.MouseEvent) => void;
  onOpenShare: (noteId: string) => void;
  onRenameNote: (oldNoteId: string, newNoteId: string) => Promise<boolean>;
  formatNoteId: (id: string) => string;
  displayName?: string;
}

const NoteItem: React.FC<NoteItemProps> = ({
  noteId, 
  isActive, 
  onLoadNote, 
  onDeleteNote,
  onOpenShare,
  onRenameNote,
  formatNoteId,
  displayName
}) => {
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Initialize with the formatted note ID
  useEffect(() => {
    setNewName(displayName || formatNoteId(noteId));
  }, [noteId, formatNoteId, displayName]);
  
  // Focus the input when renaming starts
  useEffect(() => {
    if (isRenaming && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isRenaming]);
  
  const handleRenameStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsRenaming(true);
  };
  
  const handleRenameCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsRenaming(false);
    setNewName(displayName || formatNoteId(noteId));
  };
  
  const handleRenameSubmit = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (newName.trim() === '') {
      setNewName(displayName || formatNoteId(noteId));
      setIsRenaming(false);
      return;
    }
    
    // Use timestamp format for the new ID
    const newNoteId = Date.now().toString();
    const success = await onRenameNote(noteId, newNoteId);
    
    if (!success) {
      setNewName(displayName || formatNoteId(noteId));
    }
    
    setIsRenaming(false);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    e.stopPropagation();
    if (e.key === 'Enter') {
      handleRenameSubmit(e as unknown as React.MouseEvent);
    } else if (e.key === 'Escape') {
      handleRenameCancel(e as unknown as React.MouseEvent);
    }
  };  
  return (
    <div 
      className={`p-2 rounded-md flex justify-between items-center cursor-pointer transition-all duration-200 ${
        isActive ? 'bg-noteflow-500/20' : 'hover:bg-white/5'
      }`}
      onClick={() => !isRenaming && onLoadNote(noteId)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isRenaming ? (
        <div className="flex-1 flex items-center" onClick={(e) => e.stopPropagation()}>
          <input
            ref={inputRef}
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full bg-black/30 border border-noteflow-500/50 rounded text-sm text-white px-2 py-1 focus:outline-none focus:ring-1 focus:ring-noteflow-500"
            placeholder="Enter note name"
          />
          <div className="flex gap-1 ml-2">
            <Button
              size="icon"
              variant="ghost"
              onClick={handleRenameSubmit}
              className="h-6 w-6 p-0.5 hover:bg-noteflow-500/20 rounded-full hover:text-noteflow-400 transition-all animate-fadeIn"
            >
              <Check className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={handleRenameCancel}
              className="h-6 w-6 p-0.5 hover:bg-red-500/20 rounded-full hover:text-red-400 transition-all animate-fadeIn"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center space-x-2">
            <FileEdit className={`h-3.5 w-3.5 text-noteflow-400 ${isActive ? 'opacity-100' : 'opacity-50'}`} />
            <span className="text-sm text-white truncate max-w-[120px]">
              {displayName || formatNoteId(noteId)}
            </span>
          </div>
          <div className={`flex gap-1 transition-opacity duration-200 ${isHovered || isActive ? 'opacity-100' : 'opacity-0'}`}>
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={handleRenameStart}
                    className="h-6 w-6 p-1 hover:bg-noteflow-500/20 rounded hover:text-noteflow-400 transition-all group"
                  >
                    <Edit2 className="h-3.5 w-3.5 group-hover:scale-110 transition-transform" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top" className="bg-black/80 border-white/10 text-xs">
                  Rename note
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
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
        </>
      )}
    </div>
  );
};

export default NoteItem;
