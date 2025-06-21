
import React, { useEffect } from 'react';
import { useNotesManager } from '@/hooks/useNotesManager.tsx';
import { useFocusModeManager } from '@/hooks/useFocusModeManager';
import { useAuth } from '@/contexts/AuthContext';
import { useEditorManager } from '@/hooks/useEditorManager';
import { useEditorEffects } from '@/hooks/useEditorEffects';
import { useEditorHandlers } from '@/hooks/useEditorHandlers';
import { useNotesImportExport } from '@/utils/notesImportExport';
import { EditorLoadingStates } from '@/components/editor/EditorLoadingStates';
import EditorBackgroundLayout from '@/components/editor/EditorBackgroundLayout';
import EditorHeader from '@/components/editor/EditorHeader';
import EditorNormalLayout from '@/components/editor/EditorNormalLayout';
import EditorFocusLayout from '@/components/editor/EditorFocusLayout';
import { cn } from '@/lib/utils';

const EditorManager: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
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

  const {
    content,
    setContent,
    isLeftSidebarOpen,
    isAISidebarOpen,
    lastSaved,
    setLastSaved,
    toggleLeftSidebar,
    toggleAISidebar,
    execCommand,
  } = useEditorManager();

  const {
    handleSave,
    handleNoteLoad,
    handleDeleteNote,
    createNewNote,
    handleImportNotes,
  } = useEditorHandlers({
    content,
    currentNote,
    notes,
    setCurrentNote,
    setContent,
    setLastSaved,
    saveNote,
    createNote,
    deleteNote,
  });

  const { handleImportNotes: importNotesFromFile } = useNotesImportExport();

  // Handle import notes with proper callback
  const handleImportNotesWithCallback = () => {
    importNotesFromFile(async (importedNotes: Record<string, string>) => {
      await handleImportNotes(importedNotes);
    });
  };

  // Update content when current note changes
  useEffect(() => {
    if (currentNote) {
      setContent(currentNote.content || '');
    } else {
      setContent('');
    }
  }, [currentNote, setContent]);

  // Use the effects hook
  useEditorEffects({
    content,
    currentNote,
    user,
    loading,
    notes,
    createNewNote,
    handleSave,
    setIsAISidebarOpen: toggleAISidebar,
  });

  // Show loading or auth states
  const loadingStates = EditorLoadingStates({ loading: authLoading, user });
  if (loadingStates) return loadingStates;

  const lastSavedString = lastSaved ? lastSaved.toISOString() : undefined;

  // Convert notes to legacy format for compatibility
  const allNotes: Record<string, string> = {};
  notes.forEach(note => {
    allNotes[note.id] = note.content;
  });

  return (
    <EditorBackgroundLayout isFocusMode={isFocusMode}>
      {/* Header - conditionally rendered based on focus mode */}
      {!isFocusMode && <EditorHeader />}

      {/* Main Content - ensure no old interface conflicts */}
      <div className={cn(
        "w-full h-full overflow-hidden flex-1",
        // Ensure clean slate styling
        "!m-0 !p-0 !border-0 !outline-0",
        !isFocusMode && "pt-16"  
      )}>
        {isFocusMode ? (
          <EditorFocusLayout
            content={content}
            setContent={setContent}
            execCommand={execCommand}
            handleSave={handleSave}
            toggleLeftSidebar={toggleLeftSidebar}
            toggleAISidebar={toggleAISidebar}
            lastSaved={lastSavedString}
            isFocusMode={isFocusMode}
            toggleFocusMode={toggleFocusMode}
          />
        ) : (
          <EditorNormalLayout
            content={content}
            setContent={setContent}
            isLeftSidebarOpen={isLeftSidebarOpen}
            isAISidebarOpen={isAISidebarOpen}
            execCommand={execCommand}
            handleSave={handleSave}
            toggleLeftSidebar={toggleLeftSidebar}
            toggleAISidebar={toggleAISidebar}
            lastSaved={lastSavedString}
            isFocusMode={isFocusMode}
            toggleFocusMode={toggleFocusMode}
            handleNoteLoad={handleNoteLoad}
            handleDeleteNote={handleDeleteNote}
            allNotes={allNotes}
            createNewNote={createNewNote}
            handleImportNotes={handleImportNotesWithCallback}
          />
        )}
      </div>
    </EditorBackgroundLayout>
  );
};

export default EditorManager;
