
import React, { useState, useEffect } from 'react';
import { useNotesManager } from '@/hooks/useNotesManager.tsx';
import { useFocusModeManager } from '@/hooks/useFocusModeManager';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import TiptapEditor from '../editor/TiptapEditor';
import MobileLayout from '../mobile/MobileLayout';
import { Loader2, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

const NotesEditor: React.FC = () => {
  const [content, setContent] = useState('');
  const { isMobile } = useDeviceDetection();
  const { isFocusMode } = useFocusModeManager();
  
  const {
    notes,
    currentNote,
    setCurrentNote,
    loading,
    saveNote,
  } = useNotesManager();

  // Update content when current note changes
  useEffect(() => {
    if (currentNote) {
      setContent(currentNote.content);
    } else {
      setContent('');
    }
  }, [currentNote]);

  // Auto-save functionality
  useEffect(() => {
    if (content.trim() && content !== '<p></p>' && currentNote && content !== currentNote.content) {
      const timer = setTimeout(async () => {
        await saveNote(currentNote.id, { content });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [content, currentNote, saveNote]);

  // If mobile, use the mobile layout
  if (isMobile) {
    return <MobileLayout />;
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-black/10">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-noteflow-400 mx-auto mb-4" />
          <p className="text-gray-400">Loading editor...</p>
        </div>
      </div>
    );
  }

  // Empty state when no note is selected
  if (!currentNote) {
    return (
      <div className="flex-1 flex items-center justify-center bg-black/10">
        <div className="text-center max-w-md px-6">
          <FileText className="h-16 w-16 text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-white mb-3">
            No note selected
          </h3>
          <p className="text-gray-400 mb-6">
            Select a note from the sidebar to start editing, or create a new note.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "flex-1 flex flex-col transition-all duration-300 ease-in-out",
      "bg-gradient-to-br from-[#03010a] to-[#0a0518]",
      "rounded-lg border border-white/5 overflow-hidden",
      "shadow-[0_8px_30px_rgb(0,0,0,0.4)]"
    )}>
      <TiptapEditor
        content={content}
        setContent={setContent}
        isFocusMode={isFocusMode}
      />
    </div>
  );
};

export default NotesEditor;
