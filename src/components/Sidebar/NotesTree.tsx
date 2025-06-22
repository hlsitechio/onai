
import React, { useState } from 'react';
import { 
  ChevronRight, 
  ChevronDown, 
  Folder, 
  FolderOpen, 
  FileText, 
  Plus, 
  MoreHorizontal,
  Edit3,
  Trash2,
  Palette
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useNotes } from '../../contexts/NotesContext';
import { useFolders } from '../../contexts/FoldersContext';
import { useNavigate } from 'react-router-dom';
import { Note } from '../../types/note';
import { Folder as FolderType } from '../../types/folder';

const colors = [
  '#ef4444', '#f97316', '#f59e0b', '#eab308', 
  '#84cc16', '#22c55e', '#10b981', '#14b8a6',
  '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1',
  '#8b5cf6', '#a855f7', '#d946ef', '#ec4899',
  '#f43f5e', '#64748b'
];

interface TreeNodeProps {
  folder: FolderType;
  notes: Note[];
  folders: FolderType[];
  level: number;
  expandedFolders: Set<string>;
  onToggleFolder: (folderId: string) => void;
  onEditFolder: (folder: FolderType) => void;
  onDeleteFolder: (folderId: string) => void;
  onEditNote: (note: Note) => void;
  onDeleteNote: (noteId: string) => void;
  onChangeColor: (id: string, color: string, type: 'folder' | 'note') => void;
}

const TreeNode: React.FC<TreeNodeProps> = ({
  folder,
  notes,
  folders,
  level,
  expandedFolders,
  onToggleFolder,
  onEditFolder,
  onDeleteFolder,
  onEditNote,
  onDeleteNote,
  onChangeColor,
}) => {
  const isExpanded = expandedFolders.has(folder.id);
  const childFolders = folders.filter(f => f.parentId === folder.id);
  const folderNotes = notes.filter(n => n.folderId === folder.id);
  
  const paddingLeft = level * 20;

  return (
    <div>
      {/* Folder Node */}
      <div
        className="flex items-center gap-1 py-1 hover:bg-accent/50 rounded-sm group"
        style={{ paddingLeft: `${paddingLeft}px` }}
      >
        {/* Tree Lines */}
        {level > 0 && (
          <div className="absolute left-2 h-full border-l border-border/30" 
               style={{ left: `${(level - 1) * 20 + 8}px` }} />
        )}
        
        <Button
          variant="ghost"
          size="sm"
          className="p-0 h-4 w-4"
          onClick={() => onToggleFolder(folder.id)}
        >
          {childFolders.length > 0 || folderNotes.length > 0 ? (
            isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />
          ) : (
            <div className="h-3 w-3" />
          )}
        </Button>
        
        <div 
          className="w-2 h-2 rounded-full mr-1" 
          style={{ backgroundColor: folder.color }}
        />
        
        {isExpanded ? (
          <FolderOpen className="h-4 w-4 text-muted-foreground" />
        ) : (
          <Folder className="h-4 w-4 text-muted-foreground" />
        )}
        
        <span className="text-sm truncate flex-1">{folder.name}</span>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="p-0 h-4 w-4 opacity-0 group-hover:opacity-100"
            >
              <MoreHorizontal className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEditFolder(folder)}>
              <Edit3 className="h-4 w-4 mr-2" />
              Rename
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <div className="p-2">
              <div className="grid grid-cols-6 gap-1">
                {colors.map((color) => (
                  <button
                    key={color}
                    className="w-4 h-4 rounded-full border border-border hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                    onClick={() => onChangeColor(folder.id, color, 'folder')}
                  />
                ))}
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => onDeleteFolder(folder.id)}
              className="text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Child Items */}
      {isExpanded && (
        <div>
          {/* Child Folders */}
          {childFolders.map((childFolder) => (
            <TreeNode
              key={childFolder.id}
              folder={childFolder}
              notes={notes}
              folders={folders}
              level={level + 1}
              expandedFolders={expandedFolders}
              onToggleFolder={onToggleFolder}
              onEditFolder={onEditFolder}
              onDeleteFolder={onDeleteFolder}
              onEditNote={onEditNote}
              onDeleteNote={onDeleteNote}
              onChangeColor={onChangeColor}
            />
          ))}
          
          {/* Notes in this folder */}
          {folderNotes.map((note) => (
            <div
              key={note.id}
              className="flex items-center gap-1 py-1 hover:bg-accent/50 rounded-sm group cursor-pointer"
              style={{ paddingLeft: `${(level + 1) * 20}px` }}
              onClick={() => onEditNote(note)}
            >
              {/* Tree Line */}
              <div className="absolute left-2 h-full border-l border-border/30" 
                   style={{ left: `${level * 20 + 8}px` }} />
              
              <div className="h-4 w-4" />
              
              <div 
                className="w-2 h-2 rounded-full mr-1" 
                style={{ backgroundColor: note.color }}
              />
              
              <FileText className="h-4 w-4 text-muted-foreground" />
              
              <span className="text-sm truncate flex-1">{note.title}</span>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-0 h-4 w-4 opacity-0 group-hover:opacity-100"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreHorizontal className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEditNote(note)}>
                    <Edit3 className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <div className="p-2">
                    <div className="grid grid-cols-6 gap-1">
                      {colors.map((color) => (
                        <button
                          key={color}
                          className="w-4 h-4 rounded-full border border-border hover:scale-110 transition-transform"
                          style={{ backgroundColor: color }}
                          onClick={() => onChangeColor(note.id, color, 'note')}
                        />
                      ))}
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteNote(note.id);
                    }}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

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

  return (
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
        {unorganizedNotes.length > 0 && (
          <div className="mt-4">
            <div className="text-xs text-muted-foreground mb-2 px-2">Unorganized</div>
            {unorganizedNotes.map((note) => (
              <div
                key={note.id}
                className="flex items-center gap-1 py-1 hover:bg-accent/50 rounded-sm group cursor-pointer px-2"
                onClick={() => handleEditNote(note)}
              >
                <div 
                  className="w-2 h-2 rounded-full mr-1" 
                  style={{ backgroundColor: note.color }}
                />
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm truncate flex-1">{note.title}</span>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-0 h-4 w-4 opacity-0 group-hover:opacity-100"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreHorizontal className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEditNote(note)}>
                      <Edit3 className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <div className="p-2">
                      <div className="grid grid-cols-6 gap-1">
                        {colors.map((color) => (
                          <button
                            key={color}
                            className="w-4 h-4 rounded-full border border-border hover:scale-110 transition-transform"
                            style={{ backgroundColor: color }}
                            onClick={() => handleChangeColor(note.id, color, 'note')}
                          />
                        ))}
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteNote(note.id);
                      }}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Folder Dialog */}
      {editingFolder && (
        <Dialog open={!!editingFolder} onOpenChange={() => setEditingFolder(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Rename Folder</DialogTitle>
            </DialogHeader>
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Folder name"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSaveFolder();
                  }
                }}
              />
              <Button onClick={handleSaveFolder}>Save</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default NotesTree;
