
import React, { useState, useRef, useEffect } from 'react';
import { 
  Folder, 
  FolderOpen, 
  Plus, 
  MoreHorizontal, 
  Edit3, 
  Trash2, 
  Check, 
  X 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface FolderItemProps {
  id: string;
  name: string;
  isOpen: boolean;
  isActive: boolean;
  onToggle: () => void;
  onSelect: () => void;
  onRename: (newName: string) => Promise<boolean>;
  onDelete: () => void;
  onCreateSubfolder: () => void;
  onDrop: (noteId: string) => void;
  children?: React.ReactNode;
}

const FolderItem: React.FC<FolderItemProps> = ({
  id,
  name,
  isOpen,
  isActive,
  onToggle,
  onSelect,
  onRename,
  onDelete,
  onCreateSubfolder,
  onDrop,
  children
}) => {
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(name);
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isRenaming && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isRenaming]);

  const handleRename = async () => {
    if (newName.trim() && newName.trim() !== name) {
      const success = await onRename(newName.trim());
      if (success) {
        setIsRenaming(false);
      }
    } else {
      setNewName(name);
      setIsRenaming(false);
    }
  };

  const handleCancelRename = () => {
    setNewName(name);
    setIsRenaming(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleRename();
    } else if (e.key === 'Escape') {
      handleCancelRename();
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    
    const noteId = e.dataTransfer.getData('text/note-id');
    if (noteId) {
      onDrop(noteId);
    }
  };

  return (
    <div className="w-full">
      <div 
        className={cn(
          "group flex items-center gap-2 p-2 rounded-md transition-all duration-200 cursor-pointer",
          isActive ? "bg-noteflow-500/20 border border-noteflow-500/30" : "hover:bg-white/5",
          isDragOver ? "bg-noteflow-500/30 border-2 border-noteflow-500 border-dashed" : "border border-transparent"
        )}
        onClick={onSelect}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 hover:bg-white/10"
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
        >
          {isOpen ? (
            <FolderOpen className="h-4 w-4 text-noteflow-400" />
          ) : (
            <Folder className="h-4 w-4 text-noteflow-400" />
          )}
        </Button>

        {isRenaming ? (
          <div className="flex-1 flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
            <input
              ref={inputRef}
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-black/30 border border-noteflow-500/50 rounded text-sm text-white px-2 py-1 focus:outline-none focus:ring-1 focus:ring-noteflow-500"
              placeholder="Folder name"
            />
            <Button
              size="sm"
              variant="ghost"
              onClick={handleRename}
              className="h-6 w-6 p-0 hover:bg-noteflow-500/20 text-noteflow-400"
            >
              <Check className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleCancelRename}
              className="h-6 w-6 p-0 hover:bg-red-500/20 text-red-400"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ) : (
          <>
            <span className="flex-1 text-sm text-white truncate">
              {name}
            </span>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/10"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                className="bg-black/90 backdrop-blur-xl border-white/10"
              >
                <DropdownMenuItem 
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsRenaming(true);
                  }}
                  className="text-white hover:bg-white/10"
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  Rename
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={(e) => {
                    e.stopPropagation();
                    onCreateSubfolder();
                  }}
                  className="text-white hover:bg-white/10"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Subfolder
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                  }}
                  className="text-red-400 hover:bg-red-500/20"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )}
      </div>
      
      {isOpen && children && (
        <div className="ml-4 mt-1">
          {children}
        </div>
      )}
    </div>
  );
};

export default FolderItem;
