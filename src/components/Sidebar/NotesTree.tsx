import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useNotes } from '../../contexts/NotesContext';
import { useFolders } from '../../contexts/FoldersContext';
import { useNavigate } from 'react-router-dom';
import { Note } from '../../types/note';
import { Folder as FolderType } from '../../types/folder';
import TreeNode from './TreeNode';
import UnorganizedNotes from './UnorganizedNotes';
import FolderDialog from './FolderDialog';

const colors = [
  '#ef4444', '#f97316', '#f59e0b', '#eab308', 
  '#84cc16', '#22c55e', '#10b981', '#14b8a6',
  '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1',
  '#8b5cf6', '#a855f7', '#d946ef', '#ec4899',
  '#f43f5e', '#64748b'
];

const NotesTree: React.FC = () => {
  const { notes, updateNote, deleteNote, setCurrentNote } = useNotes();
  const { folders, createFolder, updateFolder, deleteFolder } = useFolders();
  const navigate = useNavigate();
  
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [editingFolder, setEditingFolder] = useState<FolderType | null>(null);
  const [newFolderName, setNewFolderName] = useState('');
  const [showNewFolderDialog, setShowNewFolderDialog] = useState(false);

  const rootFolders = folders.filter(f => !f.parentId);
  const unorganizedNotes = notes.filter(n => !n.folderId);

  const handleToggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const handleEditFolder = (folder: FolderType) => {
    setEditingFolder(folder);
    setNewFolderName(folder.name);
  };

  const handleSaveFolder = async () => {
    if (editingFolder && newFolderName.trim()) {
      await updateFolder(editingFolder.id, { name: newFolderName.trim() });
      setEditingFolder(null);
      setNewFolderName('');
    }
  };

  const handleCreateFolder = async () => {
    if (newFolderName.trim()) {
      await createFolder({
        name: newFolderName.trim(),
        color: colors[Math.floor(Math.random() * colors.length)],
      });
      setNewFolderName('');
      setShowNewFolderDialog(false);
    }
  };

  const handleDeleteFolder = async (folderId: string) => {
    if (window.confirm('Are you sure you want to delete this folder? Notes inside will be moved to unorganized.')) {
      // Move notes from folder to unorganized
      const folderNotes = notes.filter(n => n.folderId === folderId);
      for (const note of folderNotes) {
        await updateNote(note.id, { folderId: undefined });
      }
      await deleteFolder(folderId);
    }
  };

  const handleEditNote = (note: Note) => {
    setCurrentNote(note);
    navigate('/editor');
  };

  const handleDeleteNote = async (noteId: string) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      await deleteNote(noteId);
    }
  };

  const handleChangeColor = async (id: string, color: string, type: 'folder' | 'note') => {
    if (type === 'folder') {
      await updateFolder(id, { color });
    } else {
      await updateNote(id, { color });
    }
  };

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    // If dropped in the same place, do nothing
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Extract folder ID from droppableId
    const targetFolderId = destination.droppableId.replace('folder-', '');
    
    // Update note's folder
    if (targetFolderId === 'unorganized') {
      await updateNote(draggableId, { folderId: undefined });
    } else {
      await updateNote(draggableId, { folderId: targetFolderId });
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="p-2 space-y-1">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-muted-foreground">Notes</span>
          <Dialog open={showNewFolderDialog} onOpenChange={setShowNewFolderDialog}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="p-0 h-4 w-4">
                <Plus className="h-3 w-3" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Folder</DialogTitle>
              </DialogHeader>
              <div className="flex items-center space-x-2">
                <Input
                  placeholder="Folder name"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleCreateFolder();
                    }
                  }}
                />
                <Button onClick={handleCreateFolder}>Create</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-1 relative">
          {/* Root Folders */}
          {rootFolders.map((folder) => (
            <TreeNode
              key={folder.id}
              folder={folder}
              notes={notes}
              folders={folders}
              level={0}
              expandedFolders={expandedFolders}
              onToggleFolder={handleToggleFolder}
              onEditFolder={handleEditFolder}
              onDeleteFolder={handleDeleteFolder}
              onEditNote={handleEditNote}
              onDeleteNote={handleDeleteNote}
              onChangeColor={handleChangeColor}
            />
          ))}

          {/* Unorganized Notes */}
          <UnorganizedNotes
            notes={unorganizedNotes}
            onEditNote={handleEditNote}
            onDeleteNote={handleDeleteNote}
            onChangeColor={handleChangeColor}
          />
        </div>

        {/* Edit Folder Dialog */}
        <FolderDialog
          isOpen={!!editingFolder}
          onClose={() => setEditingFolder(null)}
          title="Rename Folder"
          folderName={newFolderName}
          onFolderNameChange={setNewFolderName}
          onSave={handleSaveFolder}
        />
      </div>
    </DragDropContext>
  );
};

export default NotesTree;
