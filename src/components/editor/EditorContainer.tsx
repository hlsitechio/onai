
import React from 'react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '../ui/resizable';
import EditorToolbar from './EditorToolbar';
import EditorContent from './EditorContent';
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

      {/* Main Editor Area with Vertical Resizing */}
      <div className="flex-1 relative overflow-hidden">
        <ResizablePanelGroup 
          direction="vertical" 
          className="h-full w-full"
          autoSaveId="editor-content-vertical-layout"
        >
          {/* Main Editor Content Panel */}
          <ResizablePanel 
            id="editor-main-content"
            defaultSize={75}
            minSize={30}
            maxSize={95}
            className="min-h-0"
          >
            <EditorContent
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
          </ResizablePanel>
          
          {/* Vertical Resize Handle */}
          <ResizableHandle 
            withHandle={true}
            className="h-2 hover:h-3 transition-all duration-200 z-30 cursor-row-resize"
          />
          
          {/* Bottom Expandable Panel */}
          <ResizablePanel 
            id="editor-bottom-space"
            defaultSize={25}
            minSize={5}
            maxSize={70}
            className="min-h-0"
          >
            <div className="h-full w-full bg-gradient-to-br from-[#05020f] to-[#0c061a] rounded-lg border border-white/5 p-4">
              <div className="text-center text-slate-400 flex items-center justify-center h-full">
                <div>
                  <div className="mb-2 opacity-40">
                    <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-gradient-to-br from-noteflow-400/30 to-noteflow-600/30 flex items-center justify-center">
                      <span className="text-sm">📋</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500">Extra workspace</p>
                  <p className="text-xs text-slate-600 mt-1">Drag the line above to resize</p>
                </div>
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default EditorContainer;
