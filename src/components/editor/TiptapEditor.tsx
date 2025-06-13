
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { cn } from '@/lib/utils';
import { getUtilityExtensions } from './config/V3UtilityExtensions';
import { getFormattingExtensions } from './config/V3FormattingExtensions';
import { getTableExtensions } from './config/V3TableExtensions';
import { editorClassNames, loadingComponent } from './config/EditorConfig';
import AIAgent from '../ai-agent/AIAgent';
import InlineAIActions from '../ai-agent/InlineAIActions';
import { useAIAgent } from '@/hooks/useAIAgent';
import { useTiptapAI } from '@/hooks/useTiptapAI';
import TiptapMainToolbar from './TiptapMainToolbar';
import TiptapBubbleMenu from './TiptapBubbleMenu';
import TiptapEmptyState from './TiptapEmptyState';
import TiptapFloatingHint from './TiptapFloatingHint';

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
  const [isLoading, setIsLoading] = useState(true);
  const [selectedText, setSelectedText] = useState('');
  
  const {
    isAIAgentVisible,
    cursorPosition,
    inlineActionsPosition,
    isInlineActionsVisible,
    showAIAgent,
    hideAIAgent,
    toggleAIAgent,
    handleTextSelection,
    showInlineActions,
    hideInlineActions,
    updateCursorPosition
  } = useAIAgent();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
          HTMLAttributes: {
            class: 'font-bold tracking-tight'
          }
        },
        paragraph: {
          HTMLAttributes: {
            class: 'leading-relaxed'
          }
        }
      }),
      ...getUtilityExtensions(),
      ...getFormattingExtensions(),
      ...getTableExtensions()
    ],
    content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setContent(html);
    },
    onSelectionUpdate: ({ editor }) => {
      const { from, to } = editor.state.selection;
      const text = editor.state.doc.textBetween(from, to, '');
      
      setSelectedText(text);
      updateCursorPosition(from);
      
      if (text.trim()) {
        const coords = editor.view.coordsAtPos(from);
        showInlineActions(coords.left, coords.top - 40);
        
        handleTextSelection({
          text,
          start: from,
          end: to
        });
      } else {
        hideInlineActions();
      }
    },
    editorProps: {
      attributes: {
        class: cn(
          editorClassNames.base,
          isFocusMode ? editorClassNames.focusMode : editorClassNames.normalMode
        )
      }
    }
  });

  const {
    isProcessingAI,
    handleAITextReplace,
    handleAITextInsert,
    handleQuickAI
  } = useTiptapAI({
    editor,
    selectedText,
    hideInlineActions
  });

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key === 'A') {
        event.preventDefault();
        toggleAIAgent();
      }
      
      if (event.key === 'Escape') {
        hideAIAgent();
        hideInlineActions();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [toggleAIAgent, hideAIAgent, hideInlineActions]);

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleContentChange = useCallback((newContent: string) => {
    if (editor) {
      editor.commands.setContent(newContent);
    }
  }, [editor]);

  if (isLoading) {
    return (
      <div className={loadingComponent.containerClass}>
        <div className={loadingComponent.spinnerClass}></div>
        <p className="text-sm">{loadingComponent.text}</p>
      </div>
    );
  }

  if (!editor) {
    return <div>Editor failed to load. Please refresh the page.</div>;
  }

  return (
    <div className="relative h-full flex flex-col">
      {/* Main Toolbar */}
      <TiptapMainToolbar 
        editor={editor}
        onShowAIAgent={showAIAgent}
      />

      {/* Bubble Menu for text selection */}
      <TiptapBubbleMenu
        editor={editor}
        selectedText={selectedText}
        isProcessingAI={isProcessingAI}
        onQuickAI={handleQuickAI}
        onShowAIAgent={showAIAgent}
      />

      {/* Main Editor */}
      <div className="flex-1 relative overflow-hidden">
        <EditorContent 
          editor={editor} 
          className="h-full overflow-y-auto focus-within:outline-none p-4"
        />

        {/* AI Agent */}
        <AIAgent
          content={content}
          onContentChange={handleContentChange}
          cursorPosition={cursorPosition}
          isVisible={isAIAgentVisible}
        />

        {/* Inline AI Actions */}
        <InlineAIActions
          selectedText={selectedText}
          onTextReplace={handleAITextReplace}
          onTextInsert={handleAITextInsert}
          position={inlineActionsPosition}
          isVisible={isInlineActionsVisible}
          onClose={hideInlineActions}
        />

        {/* Floating AI hint */}
        {!isAIAgentVisible && !isInlineActionsVisible && content.length > 50 && (
          <TiptapFloatingHint onShowAIAgent={showAIAgent} />
        )}

        {/* Empty state hint */}
        {content.length === 0 && <TiptapEmptyState />}
      </div>
    </div>
  );
};

export default TiptapEditor;
