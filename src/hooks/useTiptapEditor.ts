
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import { useCallback, useEffect, useState } from 'react';

interface UseTiptapEditorProps {
  content: string;
  setContent: (content: string) => void;
  isFocusMode?: boolean;
}

export const useTiptapEditor = ({ content, setContent, isFocusMode }: UseTiptapEditorProps) => {
  // Always call all hooks in the same order - no conditional calls
  const [isLoading, setIsLoading] = useState(true);
  const [selectedText, setSelectedText] = useState('');
  const [editorReady, setEditorReady] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
    ],
    content: content || '<p></p>',
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      // Improve content detection - check for actual text content, not just HTML tags
      const textContent = editor.getText().trim();
      const hasRealContent = textContent.length > 0 && textContent !== '';
      
      if (hasRealContent || html !== '<p></p>') {
        setContent(html);
      }
    },
    onSelectionUpdate: ({ editor }) => {
      const { from, to } = editor.state.selection;
      const text = editor.state.doc.textBetween(from, to, ' ');
      setSelectedText(text);
    },
    onCreate: () => {
      setIsLoading(false);
      setEditorReady(true);
    },
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none focus:outline-none min-h-[200px] p-4',
      },
    },
  });

  // Update editor content when content prop changes - always run this effect
  useEffect(() => {
    // Only update if editor exists, is ready, and content is different
    if (editor && editorReady && content !== editor.getHTML()) {
      editor.commands.setContent(content || '<p></p>', false);
    }
  }, [content, editor, editorReady]);

  // Cleanup effect - always run
  useEffect(() => {
    return () => {
      if (editor) {
        editor.destroy();
      }
    };
  }, [editor]);

  const handleContentChange = useCallback((newContent: string) => {
    setContent(newContent);
  }, [setContent]);

  return {
    editor,
    isLoading,
    selectedText,
    handleContentChange,
  };
};
