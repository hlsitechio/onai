
import React from 'react';
import UnifiedEditor from './UnifiedEditor';
import UnifiedToolbar from './toolbar/UnifiedToolbar';
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
  saving?: boolean;
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
  saving = false,
}) => {
  return (
    <div className="h-full w-full flex flex-col">
      {/* Unified Toolbar */}
      <UnifiedToolbar
        handleSave={handleSave}
        toggleLeftSidebar={toggleLeftSidebar}
        toggleAISidebar={toggleAISidebar}
        isLeftSidebarOpen={false}
        isAISidebarOpen={false}
        lastSaved={lastSaved}
        isFocusMode={isFocusMode}
        toggleFocusMode={toggleFocusMode}
        saving={saving}
      />

      {/* Main Editor Area */}
      <div className="flex-1 relative overflow-hidden">
        <UnifiedEditor
          content={content}
          setContent={setContent}
          isFocusMode={isFocusMode}
        />
      </div>
    </div>
  );
};

export default EditorFocusLayout;
