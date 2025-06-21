
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import MobileSidebar from './MobileSidebar';
import UnifiedEditor from '../editor/UnifiedEditor';
import UnifiedToolbar from '../editor/toolbar/UnifiedToolbar';
import { useNotesManager } from '@/hooks/useNotesManager.tsx';
import { useFocusModeManager } from '@/hooks/useFocusModeManager';

const MobileLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAISidebarOpen, setIsAISidebarOpen] = useState(false);
  const [content, setContent] = useState('');

  const {
    isFocusMode,
    toggleFocusMode
  } = useFocusModeManager();

  const {
    notes,
    currentNote,
    setCurrentNote,
    loading,
    saving,
    createNote,
    saveNote,
    deleteNote
  } = useNotesManager();

  const toggleLeftSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleAISidebar = () => setIsAISidebarOpen(!isAISidebarOpen);

  const handleSave = async () => {
    if (currentNote && content !== currentNote.content) {
      await saveNote(currentNote.id, {
        content
      });
    }
  };

  const handleLoadNote = (note: any) => {
    setCurrentNote(note);
    setContent(note.content);
  };

  const handleDeleteNote = async (noteId: string): Promise<boolean> => {
    const success = await deleteNote(noteId);
    if (success && currentNote?.id === noteId) {
      const remainingNotes = notes.filter(note => note.id !== noteId);
      if (remainingNotes.length > 0) {
        handleLoadNote(remainingNotes[0]);
      } else {
        setCurrentNote(null);
        setContent('');
      }
    }
    return success;
  };

  const handleCreateNew = async () => {
    const newNote = await createNote();
    if (newNote) {
      handleLoadNote(newNote);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <UnifiedToolbar
        handleSave={handleSave}
        toggleLeftSidebar={toggleLeftSidebar}
        toggleAISidebar={toggleAISidebar}
        isLeftSidebarOpen={isSidebarOpen}
        isAISidebarOpen={isAISidebarOpen}
        isFocusMode={isFocusMode}
        toggleFocusMode={toggleFocusMode}
      />
      
      <div className="flex flex-1 overflow-hidden">
        {isSidebarOpen && (
          <MobileSidebar
            notes={notes}
            currentNote={currentNote}
            onLoadNote={handleLoadNote}
            onDeleteNote={handleDeleteNote}
            onCreateNew={handleCreateNew}
            loading={loading}
          />
        )}
        
        <div className="flex-1 flex flex-col">
          <UnifiedEditor
            content={content}
            setContent={setContent}
            isFocusMode={isFocusMode}
          />
        </div>
      </div>
    </div>
  );
};

export default MobileLayout;
