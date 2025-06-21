
import { useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useFocusModeManager } from '@/hooks/useFocusModeManager';

interface UseEditorEffectsProps {
  content: string;
  currentNote: any;
  user: any;
  loading: boolean;
  notes: any[];
  createNewNote: () => void;
  handleSave: () => void;
  setIsAISidebarOpen: (value: boolean) => void;
}

export function useEditorEffects({
  content,
  currentNote,
  user,
  loading,
  notes,
  createNewNote,
  handleSave,
  setIsAISidebarOpen,
}: UseEditorEffectsProps) {
  const { toast } = useToast();
  const { toggleFocusMode } = useFocusModeManager();

  // Auto-save functionality with improved content detection
  useEffect(() => {
    if (!currentNote || !content.trim()) return;
    
    // Better content validation
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    const textContent = tempDiv.textContent || tempDiv.innerText || '';
    
    if (textContent.trim() && content !== '<p></p>' && content !== currentNote.content) {
      const timer = setTimeout(() => {
        handleSave();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [content, currentNote, handleSave]);

  // Create initial note for new users
  useEffect(() => {
    if (user && !loading && notes.length === 0 && !currentNote) {
      createNewNote();
    }
  }, [user, loading, notes.length, currentNote, createNewNote]);

  // PWA shortcuts handling
  useEffect(() => {
    const handlePWAShortcuts = (event: CustomEvent) => {
      switch (event.type) {
        case 'pwa:new-note':
          createNewNote();
          toast({
            title: 'New Note',
            description: 'Started a new note from app shortcut.',
          });
          break;
        case 'pwa:open-ai':
          setIsAISidebarOpen(true);
          toast({
            title: 'AI Assistant',
            description: 'AI assistant opened from app shortcut.',
          });
          break;
      }
    };

    window.addEventListener('pwa:new-note', handlePWAShortcuts as EventListener);
    window.addEventListener('pwa:open-ai', handlePWAShortcuts as EventListener);

    return () => {
      window.removeEventListener('pwa:new-note', handlePWAShortcuts as EventListener);
      window.removeEventListener('pwa:open-ai', handlePWAShortcuts as EventListener);
    };
  }, [createNewNote, setIsAISidebarOpen, toast]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === 's') {
        event.preventDefault();
        handleSave();
      }
      
      if (event.key === 'F11') {
        event.preventDefault();
        toggleFocusMode();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleSave, toggleFocusMode]);
}
