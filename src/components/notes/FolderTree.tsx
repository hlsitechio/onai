
import React, { useState } from 'react';
import { Plus, FolderPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FolderItem from './FolderItem';
import DraggableNoteItem from './DraggableNoteItem';
import { useFolderManager } from '@/hooks/useFolderManager';
import { useNotesManager } from '@/hooks/useNotesManager';

interface FolderTreeProps {
  onNoteSelect: (noteId: string) => void;
  currentNoteId?: string;
  onCreateNote: () => void;
}

const FolderTree: React.FC<FolderTreeProps> = ({
  onNoteSelect,
  currentNoteId,
  onCreateNote
}) => {
  const { 
    folders, 
    loading: foldersLoading,
    createFolder, 
    renameFolder, 
    deleteFolder, 
    moveNoteToFolder 
  } = useFolderManager();
  
  const { 
    notes, 
    loading: notesLoading,
    deleteNote 
  } = useNotesManager();

  const [openFolders, setOpenFolders] = useState<Set<string>>(new Set());
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);

  const toggleFolder = (folderId: string) => {
    const newOpenFolders = new Set(openFolders);
    if (newOpenFolders.has(folderId)) {
      newOpenFolders.delete(folderId);
    } else {
      newOpenFolders.add(folderId);
    }
    setOpenFolders(newOpenFolders);
  };

  const handleCreateFolder = async () => {
    const name = prompt('Enter folder name:');
    if (name && name.trim()) {
      await createFolder(name.trim(), selectedFolder);
    }
  };

  const handleCreateSubfolder = async (parentId: string) => {
    const name = prompt('Enter subfolder name:');
    if (name && name.trim()) {
      await createFolder(name.trim(), parentId);
    }
  };

  const handleNoteMove = async (noteId: string, folderId: string | null) => {
    await moveNoteToFolder(noteId, folderId);
  };

  const handleDeleteNote = async (noteId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await deleteNote(noteId);
  };

  const handleOpenShare = (noteId: string) => {
    // This would be handled by parent component
    console.log('Open share for note:', noteId);
  };

  const formatNoteId = (noteId: string) => {
    const note = notes.find(n => n.id === noteId);
    return note?.title || 'Untitled Note';
  };

  // Get notes by folder - now using parent_id property correctly
  const getNotesByFolder = (folderId: string | null) => {
    return notes.filter(note => note.parent_id === folderId);
  };

  // Get root folders
  const rootFolders = folders.filter(folder => !folder.parent_id);

  // Get subfolders
  const getSubfolders = (parentId: string) => {
    return folders.filter(folder => folder.parent_id === parentId);
  };

  const renderFolder = (folder: any) => {
    const subfolders = getSubfolders(folder.id);
    const folderNotes = getNotesByFolder(folder.id);
    
    return (
      <FolderItem
        key={folder.id}
        id={folder.id}
        name={folder.name}
        isOpen={openFolders.has(folder.id)}
        isActive={selectedFolder === folder.id}
        onToggle={() => toggleFolder(folder.id)}
        onSelect={() => setSelectedFolder(folder.id)}
        onRename={(newName) => renameFolder(folder.id, newName)}
        onDelete={() => deleteFolder(folder.id)}
        onCreateSubfolder={() => handleCreateSubfolder(folder.id)}
        onDrop={(noteId) => handleNoteMove(noteId, folder.id)}
      >
        {/* Render subfolders */}
        {subfolders.map(renderFolder)}
        
        {/* Render notes in this folder */}
        {folderNotes.map((note) => (
          <DraggableNoteItem
            key={note.id}
            noteId={note.id}
            content={note.content}
            isActive={currentNoteId === note.id}
            onLoadNote={onNoteSelect}
            onDeleteNote={handleDeleteNote}
            onOpenShare={handleOpenShare}
            onRenameNote={async () => true}
            formatNoteId={formatNoteId}
            displayName={note.title}
          />
        ))}
      </FolderItem>
    );
  };

  if (foldersLoading || notesLoading) {
    return (
      <div className="p-4 text-center">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-noteflow-400 mx-auto"></div>
        <p className="text-gray-400 text-sm mt-2">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header with create buttons */}
      <div className="p-3 border-b border-white/10">
        <div className="flex gap-2">
          <Button
            onClick={onCreateNote}
            size="sm"
            className="flex-1 bg-noteflow-500 hover:bg-noteflow-600"
          >
            <Plus className="h-4 w-4 mr-1" />
            New Note
          </Button>
          <Button
            onClick={handleCreateFolder}
            size="sm"
            variant="outline"
            className="border-white/10 hover:bg-white/5"
          >
            <FolderPlus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Folder tree */}
      <div className="flex-1 overflow-auto p-2">
        {/* Root folders */}
        {rootFolders.map(renderFolder)}
        
        {/* Root notes (notes without a folder) */}
        <div className="mt-2">
          {getNotesByFolder(null).map((note) => (
            <DraggableNoteItem
              key={note.id}
              noteId={note.id}
              content={note.content}
              isActive={currentNoteId === note.id}
              onLoadNote={onNoteSelect}
              onDeleteNote={handleDeleteNote}
              onOpenShare={handleOpenShare}
              onRenameNote={async () => true}
              formatNoteId={formatNoteId}
              displayName={note.title}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FolderTree;
