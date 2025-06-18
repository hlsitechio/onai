
import React from 'react';
import { useTiptapEditor } from '@/hooks/useTiptapEditor';
import { useTiptapAIAgent } from '@/hooks/useTiptapAIAgent';
import TiptapEnhancedToolbar from './toolbar/TiptapEnhancedToolbar';
import EditorLoadingState from './EditorLoadingState';
import EditorErrorState from './EditorErrorState';
import EditorContentArea from './EditorContentArea';

interface TiptapEditorProps {
  content: string;
  setContent: (content: string) => void;
  isFocusMode?: boolean;
}

const TiptapEditor: React.FC<TiptapEditorProps> = ({
  content,
  setContent,
  isFocusMode = false
}) => {
  const {
    editor,
    isLoading,
    selectedText,
    handleContentChange
  } = useTiptapEditor({ content, setContent, isFocusMode });

  const {
    isAIAgentVisible,
    aiPosition,
    showAIAgent,
    hideAIAgent
  } = useTiptapAIAgent(editor, selectedText);

  if (isLoading) {
    return <EditorLoadingState />;
  }

  if (!editor) {
    return <EditorErrorState />;
  }

  return (
    <div className="relative h-full flex flex-col">
      {/* Enhanced Toolbar - only show if not in focus mode */}
      {!isFocusMode && <TiptapEnhancedToolbar editor={editor} />}

      {/* Main Editor Content */}
      <EditorContentArea
        editor={editor}
        content={content}
        selectedText={selectedText}
        handleContentChange={handleContentChange}
        isAIAgentVisible={isAIAgentVisible}
        aiPosition={aiPosition}
        hideAIAgent={hideAIAgent}
        showAIAgent={showAIAgent}
        isFocusMode={isFocusMode}
      />
    </div>
  );
};

export default TiptapEditor;
