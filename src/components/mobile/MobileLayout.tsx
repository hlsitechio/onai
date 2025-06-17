
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import MobileToolbar from './MobileToolbar';
import MobileSidebar from './MobileSidebar';
import MobileEditor from './MobileEditor';
import { useNotesManager } from '@/hooks/useNotesManager.tsx';
import { useFocusModeManager } from '@/hooks/useFocusModeManager';

const MobileLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAISidebarOpen, setIsAISidebarOpen] = useState(false);
  const [content, setContent] = useState('');
  const { isFocusMode, toggleFocusMode } = useFocusModeManager();
  
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

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleAI = () => setIsAISidebarOpen(!isAISidebarOpen);

  const handleSave = async () => {
    if (currentNote && content !== currentNote.content) {
      await saveNote(currentNote.id, { content });
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

  const execCommand = (command: string, value?: string | null) => {
    if (command === 'bold') {
      document.execCommand('bold', false);
    } else if (command === 'italic') {
      document.execCommand('italic', false);
    }
  };

  // Convert notes to legacy format for compatibility
  const allNotes: Record<string, string> = {};
  notes.forEach(note => {
    allNotes[note.id] = note.content;
  });

  return (
    <div className={cn(
      "flex flex-col h-screen w-full overflow-hidden",
      isFocusMode ? "bg-black" : "bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
    )}>
      {/* Mobile Toolbar */}
      <MobileToolbar
        execCommand={execCommand}
        handleSave={handleSave}
        toggleSidebar={toggleSidebar}
        toggleAI={toggleAI}
        isSidebarOpen={isSidebarOpen}
        isAISidebarOpen={isAISidebarOpen}
        isFocusMode={isFocusMode}
        toggleFocusMode={toggleFocusMode}
      />

      {/* Editor Container */}
      <div className={cn(
        "flex-1 overflow-hidden relative",
        isFocusMode 
          ? "bg-black" 
          : "bg-black/20 backdrop-blur-sm"
      )}>
        <MobileEditor
          content={content}
          setContent={setContent}
          isFocusMode={isFocusMode}
        />
      </div>

      {/* Mobile Sidebar */}
      <MobileSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        currentContent={content}
        onLoadNote={(noteContent) => setContent(noteContent)}
        onSave={handleSave}
        onDeleteNote={handleDeleteNote}
        allNotes={allNotes}
        onCreateNew={handleCreateNew}
      />

      {/* Focus Mode Overlay */}
      {isFocusMode && (
        <div className="fixed inset-0 bg-black/95 pointer-events-none z-[-1]" />
      )}
    </div>
  );
};

export default MobileLayout;
