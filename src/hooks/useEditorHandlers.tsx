
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
    console.log('useEditorHandlers: Save triggered');
    console.log('useEditorHandlers: Current note:', currentNote?.id);
    console.log('useEditorHandlers: Content length:', content.length);
    console.log('useEditorHandlers: Content preview:', content.substring(0, 100));
    
    // Basic validation - don't save completely empty content
    if (!content.trim()) {
      console.log('useEditorHandlers: Content is empty, not saving');
      return;
    }
    
    if (!currentNote) {
      console.log('useEditorHandlers: No current note, creating new note');
      const newNote = await createNote('New Note', content);
      if (newNote) {
        setCurrentNote(newNote);
        setLastSaved(new Date());
        console.log('useEditorHandlers: New note created and saved:', newNote.id);
      } else {
        console.error('useEditorHandlers: Failed to create new note');
      }
      return;
    }

    console.log('useEditorHandlers: Saving existing note:', currentNote.id);
    const success = await saveNote(currentNote.id, {
      content,
      title: content.split('\n')[0]?.slice(0, 50) || 'Untitled',
      updated_at: new Date().toISOString()
    });

    if (success) {
      setLastSaved(new Date());
      console.log('useEditorHandlers: Note saved successfully');
    } else {
      console.error('useEditorHandlers: Failed to save note');
    }
  }, [content, currentNote, saveNote, createNote, setCurrentNote, setLastSaved]);

  const handleNoteLoad = useCallback((noteId: string) => {
    console.log('useEditorHandlers: Loading note:', noteId);
    const note = notes.find(n => n.id === noteId);
    if (note) {
      setCurrentNote(note);
      setContent(note.content);
      console.log('useEditorHandlers: Note loaded:', note.id);
    } else {
      console.error('useEditorHandlers: Note not found:', noteId);
    }
  }, [notes, setCurrentNote, setContent]);

  const handleDeleteNote = useCallback(async (noteId: string) => {
    console.log('useEditorHandlers: Deleting note:', noteId);
    const success = await deleteNote(noteId);
    if (success) {
      if (currentNote?.id === noteId) {
        setCurrentNote(null);
        setContent('');
      }
      console.log('useEditorHandlers: Note deleted successfully');
    } else {
      console.error('useEditorHandlers: Failed to delete note');
    }
  }, [deleteNote, currentNote, setCurrentNote, setContent]);

  const createNewNote = useCallback(async () => {
    console.log('useEditorHandlers: Creating new note');
    const newNote = await createNote();
    if (newNote) {
      setCurrentNote(newNote);
      setContent('');
      console.log('useEditorHandlers: New note created:', newNote.id);
    } else {
      console.error('useEditorHandlers: Failed to create new note');
    }
  }, [createNote, setCurrentNote, setContent]);

  const handleImportNotes = useCallback(async (importedNotes: Record<string, string>) => {
    console.log('useEditorHandlers: Importing notes:', Object.keys(importedNotes).length);
    for (const [noteId, noteContent] of Object.entries(importedNotes)) {
      await createNote(`Imported Note`, noteContent);
    }
    console.log('useEditorHandlers: Notes import completed');
  }, [createNote]);

  return {
    handleSave,
    handleNoteLoad,
    handleDeleteNote,
    createNewNote,
    handleImportNotes,
  };
};
