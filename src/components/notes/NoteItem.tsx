
import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, Trash2, Check, X, FileEdit, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { generateAutoTags } from "@/utils/autoTagging";

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
  content,
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
  const [autoTags, setAutoTags] = useState<{ name: string; color: string }[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Extract clean text from HTML content
  const extractTextFromHTML = (htmlContent: string): string => {
    if (!htmlContent) return '';
    
    // Create a temporary DOM element to parse HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    
    // Get the text content and clean it up
    const textContent = tempDiv.textContent || tempDiv.innerText || '';
    return textContent.trim();
  };
  
  // Generate a clean title from content or use custom name
  const getCleanTitle = () => {
    if (displayName && displayName.trim()) {
      return displayName;
    }
    
    // Extract text from HTML content
    const textContent = extractTextFromHTML(content);
    
    if (textContent && textContent.length > 0) {
      // Get first meaningful line
      const firstLine = textContent.split('\n')[0].trim();
      if (firstLine) {
        return firstLine.substring(0, 50) + (firstLine.length > 50 ? '...' : '');
      }
    }
    
    // Fallback to a simple "Note" with creation info
    return `Note ${new Date().toLocaleDateString()}`;
  };
  
  // Initialize with clean title and update when content changes
  useEffect(() => {
    setNewName(getCleanTitle());
  }, [content, displayName]); // Add content as dependency
  
  // Generate auto tags based on content using the improved utility
  useEffect(() => {
    if (content) {
      const textContent = extractTextFromHTML(content);
      if (textContent) {
        const tags = generateAutoTags(textContent);
        setAutoTags(tags);
      }
    }
  }, [content]);
  
  // Focus the input when renaming starts
  useEffect(() => {
    if (isRenaming && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isRenaming]);
  
  const handleTitleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsRenaming(true);
  };
  
  const handleRenameCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsRenaming(false);
    setNewName(getCleanTitle());
  };
  
  const handleRenameSubmit = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (newName.trim() === '') {
      setNewName(getCleanTitle());
      setIsRenaming(false);
      return;
    }
    
    // Use timestamp format for the new ID
    const newNoteId = Date.now().toString();
    const success = await onRenameNote(noteId, newNoteId);
    
    if (!success) {
      setNewName(getCleanTitle());
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

  // Get preview text for the note
  const getPreviewText = () => {
    const textContent = extractTextFromHTML(content);
    return textContent.substring(0, 80) + (textContent.length > 80 ? '...' : '');
  };

  return (
    <div 
      className={`p-3 rounded-md flex flex-col cursor-pointer transition-all duration-200 ${
        isActive ? 'bg-noteflow-500/20 border border-noteflow-500/30' : 'hover:bg-white/5 border border-transparent'
      }`}
      onClick={() => !isRenaming && onLoadNote(noteId)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex justify-between items-start">
        {isRenaming ? (
          <div className="flex-1 flex items-center" onClick={(e) => e.stopPropagation()}>
            <input
              ref={inputRef}
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full bg-black/30 border border-noteflow-500/50 rounded text-sm text-white px-2 py-1 focus:outline-none focus:ring-1 focus:ring-noteflow-500"
              placeholder="Enter note title"
            />
            <div className="flex gap-1 ml-2">
              <Button
                size="icon"
                variant="ghost"
                onClick={handleRenameSubmit}
                className="h-6 w-6 p-0.5 hover:bg-noteflow-500/20 rounded-full hover:text-noteflow-400 transition-all"
              >
                <Check className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={handleRenameCancel}
                className="h-6 w-6 p-0.5 hover:bg-red-500/20 rounded-full hover:text-red-400 transition-all"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-start space-x-2 flex-1 min-w-0">
              <FileEdit className={`h-3.5 w-3.5 text-noteflow-400 mt-0.5 shrink-0 ${isActive ? 'opacity-100' : 'opacity-50'}`} />
              <div className="flex-1 min-w-0">
                <button
                  onClick={handleTitleClick}
                  className="text-sm text-white truncate max-w-full text-left hover:text-noteflow-300 transition-colors font-medium"
                >
                  {getCleanTitle()}
                </button>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                  {getPreviewText()}
                </p>
              </div>
            </div>
            
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
          </>
        )}
      </div>
      
      {/* Auto Tags */}
      {autoTags.length > 0 && !isRenaming && (
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
      )}
    </div>
  );
};

export default NoteItem;
