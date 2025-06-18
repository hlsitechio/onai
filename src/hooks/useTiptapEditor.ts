
import { useEditor } from '@tiptap/react';
import { useEffect, useState, useCallback } from 'react';
import StarterKit from '@tiptap/starter-kit';
import { getUtilityExtensions } from '@/components/editor/config/V3UtilityExtensions';
import { getFormattingExtensions } from '@/components/editor/config/V3FormattingExtensions';
import { getTableExtensions } from '@/components/editor/config/V3TableExtensions';
import { editorClassNames } from '@/components/editor/config/EditorConfig';
import { cn } from '@/lib/utils';

interface UseTiptapEditorProps {
  content: string;
  setContent: (content: string) => void;
  isFocusMode?: boolean;
}

export const useTiptapEditor = ({ content, setContent, isFocusMode = false }: UseTiptapEditorProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedText, setSelectedText] = useState('');

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Disable dropcursor from StarterKit to avoid duplication
        dropcursor: false,
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

  return {
    editor,
    isLoading,
    selectedText,
    handleContentChange
  };
};
