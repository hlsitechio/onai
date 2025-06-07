
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import MobileToolbar from './MobileToolbar';
import MobileSidebar from './MobileSidebar';
import MobileEditor from './MobileEditor';
import { useSupabaseNotes } from '@/hooks/useSupabaseNotes';
import { useFocusModeManager } from '@/hooks/useFocusModeManager';

const MobileLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAISidebarOpen, setIsAISidebarOpen] = useState(false);
  const { isFocusMode, toggleFocusMode } = useFocusModeManager();
  
  const { 
    content, 
    setContent, 
    execCommand, 
    handleSave, 
    handleLoadNote,
    handleDeleteNote,
    allNotes,
    createNewNote,
    isSupabaseReady
  } = useSupabaseNotes();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleAI = () => setIsAISidebarOpen(!isAISidebarOpen);

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
        onLoadNote={(content) => setContent(content)}
        onSave={handleSave}
        onDeleteNote={handleDeleteNote}
        allNotes={allNotes}
        onCreateNew={createNewNote}
      />

      {/* Focus Mode Overlay */}
      {isFocusMode && (
        <div className="fixed inset-0 bg-black/95 pointer-events-none z-[-1]" />
      )}
    </div>
  );
};

export default MobileLayout;
