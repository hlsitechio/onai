
import React from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { useNotes } from '../../contexts/NotesContext';
import { useFolders } from '../../contexts/FoldersContext';
import { useNavigate } from 'react-router-dom';
import TreeNode from './TreeNode';
import UnorganizedNotes from './UnorganizedNotes';
import FolderDialog from './FolderDialog';
import NotesTreeHeader from './NotesTreeHeader';
import { useFolderOperations } from './FolderOperations';
import { useDragDropHandler } from './DragDropHandler';
import { useNoteOperations } from './NoteOperations';
import { useFolderState } from './FolderState';

const NotesTree: React.FC = () => {
  const { notes, updateNote, deleteNote, setCurrentNote } = useNotes();
  const { folders, createFolder, updateFolder, deleteFolder } = useFolders();
  const navigate = useNavigate();
  
  const { expandedFolders, handleToggleFolder } = useFolderState();
  
  const {
    editingFolder,
    newFolderName,
    setNewFolderName,
    setEditingFolder,
    handleEditFolder,
    handleSaveFolder,
    handleCreateFolder,
    handleDeleteFolder,
    handleChangeColor: handleFolderChangeColor,
  } = useFolderOperations({
    folders,
    notes,
    updateFolder,
    createFolder,
    deleteFolder,
    updateNote,
  });

  const { handleDragEnd } = useDragDropHandler({ updateNote });
  
  const {
    handleEditNote,
    handleDeleteNote,
    handleChangeColor: handleNoteChangeColor,
  } = useNoteOperations({
    deleteNote,
    updateNote,
    setCurrentNote,
    navigate,
  });

  const rootFolders = folders.filter(f => !f.parentId);
  const unorganizedNotes = notes.filter(n => !n.folderId);

  const handleChangeColor = async (id: string, color: string, type: 'folder' | 'note') => {
    if (type === 'folder') {
      await handleFolderChangeColor(id, color, type);
    } else {
      await handleNoteChangeColor(id, color, type);
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="p-2 space-y-1">
        <NotesTreeHeader onCreateFolder={handleCreateFolder} />

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
