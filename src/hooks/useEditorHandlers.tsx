
import { useCallback } from 'react';
import { Note } from '@/hooks/useNotesManager';

interface UseEditorHandlersProps {
  content: string;
  currentNote: Note | null;
  notes: Note[];
  setCurrentNote: (note: Note | null) => void;
  setContent: (content: string) => void;
  setLastSaved: (date: Date) => void;
  saveNote: (noteId: string, updates: Partial<Note>) => Promise<boolean>;
  createNote: (title?: string, content?: string) => Promise<Note | null>;
  deleteNote: (noteId: string) => Promise<boolean>;
}

export const useEditorHandlers = ({
  content,
  currentNote,
  notes,
  setCurrentNote,
  setContent,
  setLastSaved,
  saveNote,
  createNote,
  deleteNote,
}: UseEditorHandlersProps) => {
  
  const handleSave = useCallback(async () => {
    console.log('Save triggered - Current note:', currentNote?.id);
    console.log('Save triggered - Content length:', content.length);
    
    if (!currentNote) {
      console.log('No current note, creating new note...');
      // Create a new note if none exists
      const newNote = await createNote('New Note', content);
      if (newNote) {
        setCurrentNote(newNote);
        setLastSaved(new Date());
        console.log('New note created and saved:', newNote.id);
      } else {
        console.error('Failed to create new note');
      }
      return;
    }

    // Update existing note
    console.log('Saving existing note:', currentNote.id);
    const success = await saveNote(currentNote.id, {
      content,
      title: content.split('\n')[0]?.slice(0, 50) || 'Untitled',
      updated_at: new Date().toISOString()
    });

    if (success) {
      setLastSaved(new Date());
      console.log('Note saved successfully to Supabase');
    } else {
      console.error('Failed to save note to Supabase');
    }
  }, [content, currentNote, saveNote, createNote, setCurrentNote, setLastSaved]);

  const handleNoteLoad = useCallback((noteId: string) => {
    console.log('Loading note:', noteId);
    const note = notes.find(n => n.id === noteId);
    if (note) {
      setCurrentNote(note);
      setContent(note.content);
      console.log('Note loaded:', note.id);
    } else {
      console.error('Note not found:', noteId);
    }
  }, [notes, setCurrentNote, setContent]);

  const handleDeleteNote = useCallback(async (noteId: string) => {
    console.log('Deleting note:', noteId);
    const success = await deleteNote(noteId);
    if (success) {
      // If we deleted the current note, clear it
      if (currentNote?.id === noteId) {
        setCurrentNote(null);
        setContent('');
      }
      console.log('Note deleted successfully');
    } else {
      console.error('Failed to delete note');
    }
  }, [deleteNote, currentNote, setCurrentNote, setContent]);

  const createNewNote = useCallback(async () => {
    console.log('Creating new note...');
    const newNote = await createNote();
    if (newNote) {
      setCurrentNote(newNote);
      setContent('');
      console.log('New note created:', newNote.id);
    } else {
      console.error('Failed to create new note');
    }
  }, [createNote, setCurrentNote, setContent]);

  const handleImportNotes = useCallback(async (importedNotes: Record<string, string>) => {
    console.log('Importing notes:', Object.keys(importedNotes).length);
    // Import each note
    for (const [noteId, noteContent] of Object.entries(importedNotes)) {
      await createNote(`Imported Note`, noteContent);
    }
    console.log('Notes import completed');
  }, [createNote]);

  return {
    handleSave,
    handleNoteLoad,
    handleDeleteNote,
    createNewNote,
    handleImportNotes,
  };
};
