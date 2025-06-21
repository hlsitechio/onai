
import { useState, useCallback } from 'react';

export function useEditorManager() {
  const [content, setContent] = useState('');
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);
  const [isAISidebarOpen, setIsAISidebarOpen] = useState(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const toggleLeftSidebar = useCallback(() => {
    setIsLeftSidebarOpen(prev => !prev);
  }, []);

  const toggleAISidebar = useCallback(() => {
    setIsAISidebarOpen(prev => !prev);
  }, []);

  const execCommand = useCallback((command: string, value?: string | null) => {
    console.log('Editor command:', command, value);
  }, []);

  return {
    content,
    setContent,
    isLeftSidebarOpen,
    isAISidebarOpen,
    lastSaved,
    setLastSaved,
    toggleLeftSidebar,
    toggleAISidebar,
    execCommand,
  };
}
