
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { cn } from '@/lib/utils';
import { getUtilityExtensions } from './config/V3UtilityExtensions';
import { getFormattingExtensions } from './config/V3FormattingExtensions';
import { getTableExtensions } from './config/V3TableExtensions';
import { editorClassNames, loadingComponent } from './config/EditorConfig';
import AICommandCenter from '../ai-command-center/AICommandCenter';
import { useAIAgent } from '@/hooks/useAIAgent';
import TiptapEnhancedToolbar from './toolbar/TiptapEnhancedToolbar';
import TiptapBubbleMenu from './TiptapBubbleMenu';
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
  
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
          HTMLAttributes: {
            class: 'font-bold tracking-tight text-white'
          }
        },
        paragraph: {
          HTMLAttributes: {
            class: 'leading-relaxed text-gray-300'
          }
        },
        blockquote: {
          HTMLAttributes: {
            class: 'border-l-4 border-noteflow-400 pl-4 italic text-gray-400'
          }
        },
        codeBlock: {
          HTMLAttributes: {
            class: 'bg-black/60 rounded-lg p-4 font-mono text-sm text-gray-300 border border-white/10'
          }
        },
        code: {
          HTMLAttributes: {
            class: 'bg-white/10 px-1.5 py-0.5 rounded text-noteflow-300 font-mono text-sm'
          }
        },
        horizontalRule: {
          HTMLAttributes: {
            class: 'border-white/20 my-6'
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
        handleTextSelection({
          text,
          start: from,
          end: to
        });
      }
    },
    editorProps: {
      attributes: {
        class: cn(
          editorClassNames.base,
          isFocusMode ? editorClassNames.focusMode : editorClassNames.normalMode,
          'prose prose-invert max-w-none'
        )
      }
    }
  });

  const {
    isAIAgentVisible,
    aiPosition,
    showAIAgent,
    hideAIAgent,
    toggleAIAgent,
    handleTextSelection,
    updateCursorPosition
  } = useAIAgent(editor);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key === 'A') {
        event.preventDefault();
        toggleAIAgent();
      }
      
      if (event.key === 'Escape') {
        hideAIAgent();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [toggleAIAgent, hideAIAgent]);

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleContentChange = useCallback((newContent: string) => {
    if (editor) {
      editor.commands.setContent(newContent);
    }
  }, [editor]);

  // Check if content is empty (only contains empty paragraph tags or is truly empty)
  const isContentEmpty = !content || content === '<p></p>' || content.trim() === '';

  if (isLoading) {
    return (
      <div className={loadingComponent.containerClass}>
        <div className={loadingComponent.spinnerClass}></div>
        <p className="text-sm">{loadingComponent.text}</p>
      </div>
    );
  }

  if (!editor) {
    return (
      <div className="flex items-center justify-center h-full text-white">
        <p>Editor failed to load. Please refresh the page.</p>
      </div>
    );
  }

  return (
    <div className="relative h-full flex flex-col">
      {/* Enhanced Toolbar - only show if not in focus mode */}
      {!isFocusMode && <TiptapEnhancedToolbar editor={editor} />}

      {/* Bubble Menu for text selection */}
      <TiptapBubbleMenu
        editor={editor}
        selectedText={selectedText}
        isProcessingAI={false}
        onQuickAI={() => {}}
        onShowAIAgent={showAIAgent}
      />

      {/* Main Editor */}
      <div className="flex-1 relative overflow-hidden">
        <EditorContent 
          editor={editor} 
          className="h-full overflow-y-auto focus-within:outline-none p-4"
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
    </div>
  );
};

export default TiptapEditor;
