
import React, { useRef } from 'react';
import { cn } from '@/lib/utils';
import { useEditorHeight } from '@/hooks/useEditorHeight';
import TextEditorToolbar from '../TextEditorToolbar';
import EditableContent from '../EditableContent';
import AIDialog from '../notes/AIDialog';

interface EditorContainerProps {
  content: string;
  setContent: (content: string) => void;
  execCommand: (command: string, value?: string | null) => void;
  handleSave: () => void;
  toggleLeftSidebar: () => void;
  toggleAISidebar: () => void;
  isLeftSidebarOpen: boolean;
  isAISidebarOpen: boolean;
  lastSaved: Date | null;
  isFocusMode: boolean;
  toggleFocusMode: () => void;
  isAIDialogOpen: boolean;
  setIsAIDialogOpen: (open: boolean) => void;
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
  isFocusMode,
  toggleFocusMode,
  isAIDialogOpen,
  setIsAIDialogOpen
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const editorHeight = useEditorHeight(editorRef, content);

  return (
    <div className="flex-1 flex flex-col min-w-0 md:min-w-0 lg:min-w-0 xl:min-w-0 max-w-full mx-auto">
      <div 
        ref={editorRef}
        className={cn(
          "rounded-xl overflow-hidden flex flex-col transition-all duration-500",
          isFocusMode 
            ? "shadow-[0_0_80px_rgba(147,51,234,0.4)] ring-2 ring-purple-500/30 bg-black/90 backdrop-blur-xl" 
            : "bg-black/30 backdrop-blur-lg"
        )}
      >
        {/* Toolbar */}
        <TextEditorToolbar 
          execCommand={execCommand}
          handleSave={handleSave}
          toggleSidebar={toggleLeftSidebar}
          toggleAI={toggleAISidebar}
          isSidebarOpen={isLeftSidebarOpen}
          isAISidebarOpen={isAISidebarOpen}
          lastSaved={lastSaved}
          isFocusMode={isFocusMode}
          toggleFocusMode={toggleFocusMode}
        />
        
        {/* Editor area with focus mode sizing */}
        <div className={cn(
          "flex-1 overflow-hidden relative transition-all duration-500",
          isFocusMode 
            ? "h-[80vh] max-h-[80vh]" 
            : "h-[450px] sm:h-[600px] md:h-[700px] lg:h-[800px] xl:h-[900px] 2xl:h-[950px]"
        )}>
          <EditableContent 
            content={content} 
            setContent={setContent} 
            isFocusMode={isFocusMode}
          />
        </div>
      </div>
      
      {/* AI Dialog */}
      <AIDialog 
        isOpen={isAIDialogOpen}
        onOpenChange={setIsAIDialogOpen}
        content={content}
        onApplyChanges={setContent}
      />
      
      {/* Additional space at the bottom - hidden in focus mode */}
      {!isFocusMode && <div className="h-6"></div>}
    </div>
  );
};

export default EditorContainer;
