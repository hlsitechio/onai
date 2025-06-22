
import { Note } from '../../types/note';

interface NoteOperationsProps {
  deleteNote: (id: string) => Promise<boolean>;
  updateNote: (id: string, updates: Partial<Omit<Note, 'id' | 'createdAt'>>) => Promise<Note | null>;
  setCurrentNote: (note: Note | null) => void;
  navigate: (path: string) => void;
}

export const useNoteOperations = ({
  deleteNote,
  updateNote,
  setCurrentNote,
  navigate,
}: NoteOperationsProps) => {
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
    if (type === 'note') {
      await updateNote(id, { color });
    }
  };

  return {
    handleEditNote,
    handleDeleteNote,
    handleChangeColor,
  };
};
