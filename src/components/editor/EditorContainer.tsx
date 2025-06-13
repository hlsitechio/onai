
import React from 'react';
import EditableContent from '../EditableContent';
import EditorToolbar from './EditorToolbar';
import { cn } from '@/lib/utils';

interface EditorContainerProps {
  content: string;
  setContent: (content: string) => void;
  execCommand: (command: string, value?: string | null) => void;
  handleSave: () => void;
  toggleLeftSidebar: () => void;
  toggleAISidebar: () => void;
  isLeftSidebarOpen: boolean;
  isAISidebarOpen: boolean;
  lastSaved?: string;
  isFocusMode?: boolean;
  toggleFocusMode?: () => void;
  isAIDialogOpen?: boolean;
  setIsAIDialogOpen?: (open: boolean) => void;
}

const EditorContainer: React.FC<EditorContainerProps> = ({
  content,
  setContent,
  execCommand,
  handleSave,
  toggleLeftSidebar,
  toggleAISidebar,
  isLeftSidebarOpen,
  isAISidebarOpen,
  lastSaved,
  isFocusMode = false,
  toggleFocusMode = () => {},
  isAIDialogOpen = false,
  setIsAIDialogOpen = () => {}
}) => {
  return (
    <div className={cn(
      "flex flex-col h-full transition-all duration-300 ease-in-out",
      "bg-gradient-to-br from-[#03010a] to-[#0a0518]",
      "rounded-lg border border-white/5 overflow-hidden",
      "shadow-[0_8px_30px_rgb(0,0,0,0.4)]"
    )}>
      {/* Editor Toolbar */}
      <EditorToolbar
        execCommand={execCommand}
        handleSave={handleSave}
        toggleLeftSidebar={toggleLeftSidebar}
        toggleAISidebar={toggleAISidebar}
        isLeftSidebarOpen={isLeftSidebarOpen}
        isAISidebarOpen={isAISidebarOpen}
        lastSaved={lastSaved}
        isFocusMode={isFocusMode}
        toggleFocusMode={toggleFocusMode}
      />

      {/* Main Editor Area */}
      <div className="flex-1 relative overflow-hidden">
        <EditableContent
          content={content}
          setContent={setContent}
          isFocusMode={isFocusMode}
        />
        
        {/* AI Usage Hint */}
        {content.length === 0 && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="flex items-center justify-center h-full">
              <div className="text-center max-w-md px-6">
                <div className="mb-4 opacity-60">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-noteflow-400 to-noteflow-600 flex items-center justify-center">
                    <span className="text-2xl">✨</span>
                  </div>
                </div>
                <h3 className="text-lg font-medium text-white mb-2">
                  Start writing with AI assistance
                </h3>
                <p className="text-sm text-slate-400 mb-4">
                  Type your thoughts, select text for AI enhancements, or use keyboard shortcuts for quick actions.
                </p>
                <div className="text-xs text-slate-500 space-y-1">
                  <div>• Select text to see AI options</div>
                  <div>• Press <kbd className="bg-white/10 px-1 rounded">Ctrl+Shift+A</kbd> for AI Agent</div>
                  <div>• Use the AI sidebar for advanced features</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditorContainer;
