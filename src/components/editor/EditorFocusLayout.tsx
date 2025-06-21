
import React from 'react';
import PlateEditor from '@/components/editor/PlateEditor';
import EditorToolbar from '@/components/editor/EditorToolbar';
import { cn } from '@/lib/utils';

interface EditorFocusLayoutProps {
  content: string;
  setContent: (content: string) => void;
  execCommand: (command: string, value?: string | null) => void;
  handleSave: () => void;
  toggleLeftSidebar: () => void;
  toggleAISidebar: () => void;
  lastSaved: string | undefined;
  isFocusMode: boolean;
  toggleFocusMode: () => void;
}

const EditorFocusLayout: React.FC<EditorFocusLayoutProps> = ({
  content,
  setContent,
  execCommand,
  handleSave,
  toggleLeftSidebar,
  toggleAISidebar,
  lastSaved,
  isFocusMode,
  toggleFocusMode,
}) => {
  return (
    <div className="h-full w-full bg-black">
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
          isLeftSidebarOpen={false}
          isAISidebarOpen={false}
          lastSaved={lastSaved}
          isFocusMode={isFocusMode}
          toggleFocusMode={toggleFocusMode}
        />

        {/* Main Editor Area */}
        <div className="flex-1 relative overflow-hidden">
          <PlateEditor
            content={content}
            setContent={setContent}
            isFocusMode={isFocusMode}
          />
        </div>
      </div>
    </div>
  );
};

export default EditorFocusLayout;
