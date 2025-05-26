
import React, { useEffect, useState } from 'react';
import { generateAutoTags } from "@/utils/autoTagging";
import { useNoteItemState } from "./hooks/useNoteItemState";
import NoteRenameInput from "./components/NoteRenameInput";
import NoteActions from "./components/NoteActions";
import NoteAutoTags from "./components/NoteAutoTags";
import NoteContent from "./components/NoteContent";

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
  className?: string;
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
  displayName,
  className = ''
}) => {
  const {
    isRenaming,
    setIsRenaming,
    newName,
    setNewName,
    isHovered,
    setIsHovered,
    getCleanTitle
  } = useNoteItemState(noteId, displayName, content);

  const [autoTags, setAutoTags] = useState<{ name: string; color: string }[]>([]);
  
  // Generate auto tags based on content using the improved utility
  useEffect(() => {
    if (content) {
      const tags = generateAutoTags(content);
      setAutoTags(tags);
    }
  }, [content]);
  
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

  return (
    <div 
      className={`p-3 rounded-md flex flex-col cursor-pointer transition-all duration-200 ${
        isActive ? 'bg-noteflow-500/20 border border-noteflow-500/30' : 'hover:bg-white/5 border border-transparent'
      } ${className}`}
      onClick={() => !isRenaming && onLoadNote(noteId)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex justify-between items-start">
        {isRenaming ? (
          <NoteRenameInput
            newName={newName}
            setNewName={setNewName}
            onSubmit={handleRenameSubmit}
            onCancel={handleRenameCancel}
            onKeyDown={handleKeyDown}
          />
        ) : (
          <>
            <NoteContent
              title={getCleanTitle()}
              content={content}
              isActive={isActive}
              onTitleClick={handleTitleClick}
            />
            
            <NoteActions
              noteId={noteId}
              isHovered={isHovered}
              isActive={isActive}
              onOpenShare={onOpenShare}
              onDeleteNote={onDeleteNote}
            />
          </>
        )}
      </div>
      
      {/* Auto Tags */}
      {!isRenaming && (
        <NoteAutoTags autoTags={autoTags} />
      )}
    </div>
  );
};

export default NoteItem;
