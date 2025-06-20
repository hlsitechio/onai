
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useCallback, useEffect, useState } from 'react';

// Import all necessary extensions
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import Typography from '@tiptap/extension-typography';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Image from '@tiptap/extension-image';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';

interface UseTiptapEditorProps {
  content: string;
  setContent: (content: string) => void;
  isFocusMode?: boolean;
}

export const useTiptapEditor = ({ content, setContent, isFocusMode }: UseTiptapEditorProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedText, setSelectedText] = useState('');
  const [editorReady, setEditorReady] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Keep StarterKit simple and disable conflicting extensions
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
        // Disable extensions we'll configure separately
        strike: false, // We'll add this back if needed
      }),
      // Add additional extensions with proper error handling
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-noteflow-400 underline hover:text-noteflow-300 cursor-pointer',
        },
      }),
      Underline.configure({
        HTMLAttributes: {
          class: 'underline',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right', 'justify'],
        defaultAlignment: 'left',
      }),
      // Ensure Highlight is properly configured
      Highlight.configure({
        multicolor: true,
        HTMLAttributes: {
          class: 'bg-yellow-200 text-black px-1 rounded',
        },
      }),
      Typography,
      TaskList.configure({
        HTMLAttributes: {
          class: 'task-list',
        },
      }),
      TaskItem.configure({
        nested: true,
        HTMLAttributes: {
          class: 'task-item',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
        },
        allowBase64: true,
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'border-collapse table-auto w-full',
        },
      }),
      TableRow.configure({
        HTMLAttributes: {
          class: 'border-b',
        },
      }),
      TableHeader.configure({
        HTMLAttributes: {
          class: 'font-bold text-left p-2 border',
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: 'p-2 border',
        },
      }),
    ],
    content: content || '<p></p>',
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
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
    onCreate: ({ editor }) => {
      setIsLoading(false);
      setEditorReady(true);
      console.log('Editor created with extensions:', editor.extensionManager.extensions.map(ext => ext.name));
    },
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none focus:outline-none min-h-[200px] p-4',
      },
    },
  });

  useEffect(() => {
    if (editor && editorReady && content !== editor.getHTML()) {
      editor.commands.setContent(content || '<p></p>', false);
    }
  }, [content, editor, editorReady]);

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

  // Helper function to safely execute commands
  const safeCommand = useCallback((commandName: string, commandFn: () => boolean) => {
    if (!editor) {
      console.warn(`Editor not available for command: ${commandName}`);
      return false;
    }
    
    try {
      return commandFn();
    } catch (error) {
      console.error(`Error executing command ${commandName}:`, error);
      return false;
    }
  }, [editor]);

  return {
    editor,
    isLoading,
    selectedText,
    handleContentChange,
    safeCommand,
  };
};
