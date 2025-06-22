
import React, { useState, useEffect } from 'react';
import { useNotesManager, Note } from '@/hooks/useNotesManager';
import NotesEditorFlexibleLayout from './NotesEditorFlexibleLayout';

export interface SidebarNote {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const NotesEditorContainer: React.FC = () => {
  const {
    notes,
    currentNote,
    setCurrentNote,
    loading,
    saving,
    createNote,
    saveNote,
    deleteNote,
  } = useNotesManager();

  const [content, setContent] = useState('');

  // Convert Note[] to Record<string, SidebarNote> for compatibility
  const notesRecord: Record<string, SidebarNote> = {};
  notes.forEach(note => {
    notesRecord[note.id] = {
      id: note.id,
      title: note.title || 'Untitled Note',
      content: note.content,
      createdAt: new Date(note.created_at),
      updatedAt: new Date(note.updated_at),
    };
  });

  // Update content when current note changes
  useEffect(() => {
    if (currentNote) {
      setContent(currentNote.content || '');
    } else {
      setContent('');
    }
  }, [currentNote]);

  const handleLoadNote = (noteId: string) => {
    const note = notes.find(n => n.id === noteId);
    if (note) {
      setCurrentNote(note);
      setContent(note.content);
    }
  };

  const handleCreateNote = async () => {
    const newNote = await createNote();
    if (newNote) {
      setCurrentNote(newNote);
      setContent(newNote.content);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    const success = await deleteNote(noteId);
    if (success && currentNote?.id === noteId) {
      // If we deleted the current note, clear the editor
      setCurrentNote(null);
      setContent('');
    }
  };

  const handleRenameNote = async (noteId: string, newTitle: string) => {
    // Find the note to update
    const noteToUpdate = notes.find(n => n.id === noteId);
    if (noteToUpdate) {
      // Update the note with the new title
      const success = await saveNote(noteId, { title: newTitle });
      return success;
    }
    return false;
  };

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    if (currentNote) {
      // Auto-save after a short delay
      const updatedNote = { ...currentNote, content: newContent };
      setCurrentNote(updatedNote);
      // Trigger save
      setTimeout(() => {
        saveNote(currentNote.id, { content: newContent });
      }, 1000);
    }
  };

  const handleApplyAIContent = (aiContent: string) => {
    setContent(aiContent);
    if (currentNote) {
      const updatedNote = { ...currentNote, content: aiContent };
      setCurrentNote(updatedNote);
      saveNote(currentNote.id, { content: aiContent });
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="text-white text-lg">Loading notes...</div>
      </div>
    );
  }

  return (
    <NotesEditorFlexibleLayout
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
