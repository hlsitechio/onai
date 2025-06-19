
import React from 'react';
import { EditorContent } from '@tiptap/react';
import type { Editor } from '@tiptap/react';
import AICommandCenter from '../ai-command-center/AICommandCenter';
import TiptapBubbleMenu from './TiptapBubbleMenu';
import TiptapFloatingHint from './TiptapFloatingHint';

interface EditorContentAreaProps {
  editor: Editor;
  content: string;
  selectedText: string;
  handleContentChange: (content: string) => void;
  isAIAgentVisible: boolean;
  aiPosition: { x: number; y: number };
  hideAIAgent: () => void;
  showAIAgent: () => void;
  isFocusMode: boolean;
}

const EditorContentArea: React.FC<EditorContentAreaProps> = ({
  editor,
  content,
  selectedText,
  handleContentChange,
  isAIAgentVisible,
  aiPosition,
  hideAIAgent,
  showAIAgent,
  isFocusMode
}) => {
  // Check if content is empty (only contains empty paragraph tags or is truly empty)
  const isContentEmpty = !content || content === '<p></p>' || content.trim() === '';

  return (
    <div className="flex-1 relative overflow-hidden">
      <EditorContent 
        editor={editor} 
        className="h-full overflow-y-auto focus-within:outline-none p-4"
      />

      {/* Bubble Menu for text selection - simplified without AI button */}
      <TiptapBubbleMenu
        editor={editor}
        selectedText={selectedText}
        isProcessingAI={false}
        onQuickAI={() => {}}
        onShowAIAgent={showAIAgent}
      />

      {/* Unified AI Command Center */}
      <AICommandCenter
        content={content}
        onContentChange={handleContentChange}
        selectedText={selectedText}
        cursorPosition={editor?.state.selection.from || 0}
        isVisible={isAIAgentVisible}
        onClose={hideAIAgent}
        position={aiPosition}
      />

      {/* Floating AI hint - only show when content exists and AI agent is not visible */}
      {!isAIAgentVisible && !isContentEmpty && !isFocusMode && (
        <TiptapFloatingHint onShowAIAgent={showAIAgent} />
      )}
    </div>
  );
};

export default EditorContentArea;
