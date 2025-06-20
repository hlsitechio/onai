
import React, { useState, useEffect } from 'react';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import { useFocusModeManager } from '@/hooks/useFocusModeManager';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useSidebarManager } from '@/hooks/useSidebarManager';
import NotesEditor from '@/components/notes/NotesEditor';
import NotesSidebar from '@/components/notes/NotesSidebar';
import EnhancedAISidebar from '@/components/notes/EnhancedAISidebar';
import DotGridBackground from '@/components/DotGridBackground';
import MobileLayout from '@/components/mobile/MobileLayout';
import { cn } from '@/lib/utils';

const Notes: React.FC = () => {
  const [content, setContent] = useState('');
  const { isMobile } = useDeviceDetection();
  const { isFocusMode } = useFocusModeManager();
  const { 
    isSidebarCollapsed, 
    isAISidebarVisible, 
    toggleSidebar, 
    toggleAISidebar 
  } = useSidebarManager();

  // Keyboard shortcuts
  useKeyboardShortcuts({
    'ctrl+\\': toggleSidebar,
    'ctrl+shift+a': toggleAISidebar
  });

  // If mobile, show mobile layout
  if (isMobile) {
    return <MobileLayout />;
  }

  return (
    <div className="flex-1 flex h-full overflow-hidden bg-gradient-to-br from-[#050510] to-[#0a0518]">
      <DotGridBackground />
      
      <div className="relative z-10 flex w-full h-full">
        {/* Sidebar */}
        <div className={cn(
          "transition-all duration-300 ease-in-out bg-black/20 backdrop-blur-sm border-r border-white/5",
          isSidebarCollapsed ? "w-16" : "w-80"
        )}>
          <NotesSidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Editor */}
          <div className="flex-1">
            <NotesEditor />
          </div>

          {/* Enhanced AI Sidebar */}
          {!isMobile && (
            <div className={cn(
              "transition-all duration-300 ease-in-out bg-black/10 border-l border-white/5",
              isAISidebarVisible ? "w-96" : "w-0 overflow-hidden"
            )}>
              {isAISidebarVisible && (
                <EnhancedAISidebar
                  content={content}
                  onApplyChanges={(newContent) => {
                    setContent(newContent);
                  }}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notes;
