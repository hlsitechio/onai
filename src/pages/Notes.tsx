
import React, { useState, useEffect } from 'react';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import { useFocusModeManager } from '@/hooks/useFocusModeManager';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useSidebarManager } from '@/hooks/useSidebarManager';
import NotesEditor from '@/components/notes/NotesEditor';
import NotesSidebar from '@/components/notes/NotesSidebar';
import EnhancedAISidebar from '@/components/notes/EnhancedAISidebar';
import AIFloatingToolbar from '@/components/editor/ai-enhanced/AIFloatingToolbar';
import DotGridBackground from '@/components/DotGridBackground';
import MobileLayout from '@/components/mobile/MobileLayout';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { callGeminiAI } from '@/utils/aiUtils';

const Notes: React.FC = () => {
  const [content, setContent] = useState('');
  const { isMobile } = useDeviceDetection();
  const { isFocusMode } = useFocusModeManager();
  const { toast } = useToast();
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

  const handleQuickAction = async (action: string) => {
    if (!content.trim()) {
      toast({
        title: 'No content',
        description: 'Please add some content to your note first.',
        variant: 'destructive'
      });
      return;
    }

    try {
      let prompt = '';
      switch (action) {
        case 'improve':
          prompt = 'Please improve and enhance this text while maintaining its original meaning:';
          break;
        case 'summarize':
          prompt = 'Please provide a concise summary of this content:';
          break;
        case 'ideas':
          prompt = 'Based on this content, please generate 5-7 related ideas or concepts:';
          break;
        case 'continue':
          prompt = 'Please continue writing this content in the same style and tone:';
          break;
        case 'translate':
          prompt = 'Please translate this content to Spanish:';
          break;
        case 'grammar':
          prompt = 'Please fix any grammar, spelling, or punctuation errors in this text:';
          break;
        default:
          prompt = 'Please help me with this content:';
      }

      const response = await callGeminiAI(prompt, content, action);
      setContent(content + '\n\n' + response);
      
      toast({
        title: 'AI Action Complete',
        description: `${action.charAt(0).toUpperCase() + action.slice(1)} completed successfully.`,
      });
    } catch (error) {
      toast({
        title: 'AI Action Failed',
        description: 'Failed to process your request. Please try again.',
        variant: 'destructive'
      });
    }
  };

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
          <div className="flex-1 relative">
            <NotesEditor />
            
            {/* AI Floating Toolbar */}
            {!isFocusMode && (
              <AIFloatingToolbar
                onOpenChat={toggleAISidebar}
                onQuickAction={handleQuickAction}
                isVisible={!isAISidebarVisible}
              />
            )}
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
                  onClose={toggleAISidebar}
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
