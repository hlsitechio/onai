
import React from 'react';
import { useDeviceDetection } from "@/hooks/useDeviceDetection";
import { useNotesManager } from "@/hooks/useNotesManager";
import { useToast } from "@/hooks/use-toast";
import NotesEditorLayout from "./NotesEditorLayout";
import MobileLayout from "../mobile/MobileLayout";

// Define the Note interface expected by NotesSidebar
export interface SidebarNote {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const NotesEditorContainer: React.FC = () => {
  const { isMobile } = useDeviceDetection();
  const { toast } = useToast();
  const {
    notes,
    currentNote,
    setCurrentNote,
    loading,
    saving,
    createNote,
    saveNote,
    deleteNote,
    loadNotes,
  } = useNotesManager();

  // Show mobile layout for mobile devices
  if (isMobile) {
    return <MobileLayout />;
  }

  // Convert notes array to Record format for NotesSidebar compatibility
  const notesRecord: Record<string, SidebarNote> = {};
  notes.forEach(note => {
    notesRecord[note.id] = {
      id: note.id,
      title: note.title,
      content: note.content,
      createdAt: new Date(note.created_at),
      updatedAt: new Date(note.updated_at)
    };
  });

  const handleApplyAIContent = (aiContent: string) => {
    const selectedNoteId = currentNote?.id || null;
    const currentContent = currentNote?.content || '';

    if (selectedNoteId && currentContent !== undefined) {
      const newContent = currentContent + '\n\n' + aiContent;
      if (currentNote) {
        saveNote(currentNote.id, { content: newContent });
      }
      toast({
        title: "AI content applied",
        description: "The AI response has been added to your note.",
      });
    } else {
      // Create a new note with AI content
      createNote('New Note', aiContent).then(newNote => {
        if (newNote) {
          setCurrentNote(newNote);
        }
      });
      toast({
        title: "New note created",
        description: "A new note has been created with the AI response.",
      });
    }
  };

  const handleLoadNote = (noteId: string) => {
    const note = notes.find(n => n.id === noteId);
    if (note) {
      setCurrentNote(note);
    }
  };

  const handleCreateNote = async () => {
    const newNote = await createNote();
    if (newNote) {
      setCurrentNote(newNote);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    const success = await deleteNote(noteId);
    if (success && currentNote?.id === noteId) {
      setCurrentNote(null);
    }
  };

  const handleRenameNote = async (noteId: string, newTitle: string) => {
    await saveNote(noteId, { title: newTitle });
  };

  const handleContentChange = (content: string) => {
    if (currentNote) {
      saveNote(currentNote.id, { content });
    }
  };

  return (
    <NotesEditorLayout
      notesRecord={notesRecord}
      currentNote={currentNote}
      saving={saving}
      onLoadNote={handleLoadNote}
      onCreateNote={handleCreateNote}
      onDeleteNote={handleDeleteNote}
      onRenameNote={handleRenameNote}
      onContentChange={handleContentChange}
      onApplyAIContent={handleApplyAIContent}
    />
  );
};

export default NotesEditorContainer;
