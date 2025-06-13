
import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import Color from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import Highlight from '@tiptap/extension-highlight';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import Typography from '@tiptap/extension-typography';
import Placeholder from '@tiptap/extension-placeholder';
import Focus from '@tiptap/extension-focus';
import Dropcursor from '@tiptap/extension-dropcursor';
import Gapcursor from '@tiptap/extension-gapcursor';
import { lowlight } from 'lowlight';
import { cn } from '@/lib/utils';
import TiptapToolbar from './TiptapToolbar';

interface TiptapEditorProps {
  content: string;
  setContent: (content: string) => void;
  isFocusMode?: boolean;
  onSave?: () => void;
}

const TiptapEditor: React.FC<TiptapEditorProps> = ({
  content,
  setContent,
  isFocusMode = false,
  onSave
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false, // We'll use CodeBlockLowlight instead
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-400 underline cursor-pointer hover:text-blue-300',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
        },
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'border border-white/20 border-collapse',
        },
      }),
      TableRow.configure({
        HTMLAttributes: {
          class: 'border-b border-white/20',
        },
      }),
      TableHeader.configure({
        HTMLAttributes: {
          class: 'bg-white/10 font-bold p-2 border border-white/20',
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: 'p-2 border border-white/20',
        },
      }),
      Color.configure({
        types: ['textStyle'],
      }),
      TextStyle,
      Highlight.configure({
        HTMLAttributes: {
          class: 'bg-yellow-400 text-black px-1 rounded',
        },
      }),
      TaskList.configure({
        HTMLAttributes: {
          class: 'not-prose list-none',
        },
      }),
      TaskItem.configure({
        nested: true,
        HTMLAttributes: {
          class: 'flex items-start gap-2 mb-2',
        },
      }),
      CodeBlockLowlight.configure({
        lowlight,
        HTMLAttributes: {
          class: 'bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto',
        },
      }),
      Typography,
      Placeholder.configure({
        placeholder: 'Start writing your note...',
        emptyEditorClass: 'is-editor-empty',
      }),
      Focus.configure({
        className: 'has-focus',
      }),
      Dropcursor.configure({
        color: '#3b82f6',
      }),
      Gapcursor,
    ],
    content,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: cn(
          'prose prose-invert max-w-none',
          'focus:outline-none',
          'min-h-[400px] p-6',
          '[&_.ProseMirror]:outline-none',
          '[&_.is-editor-empty:first-child::before]:content-[attr(data-placeholder)]',
          '[&_.is-editor-empty:first-child::before]:float-left',
          '[&_.is-editor-empty:first-child::before]:text-gray-400',
          '[&_.is-editor-empty:first-child::before]:pointer-events-none',
          '[&_.is-editor-empty:first-child::before]:h-0',
          '[&_h1]:text-white [&_h2]:text-white [&_h3]:text-white',
          '[&_p]:text-white [&_li]:text-white [&_strong]:text-white',
          '[&_em]:text-white [&_code]:text-white',
          '[&_blockquote]:border-l-4 [&_blockquote]:border-blue-400',
          '[&_blockquote]:pl-4 [&_blockquote]:text-gray-300',
          '[&_ul]:list-disc [&_ol]:list-decimal',
          '[&_ul[data-type="taskList"]]:list-none',
          '[&_li[data-type="taskItem"]]:flex [&_li[data-type="taskItem"]]:items-start',
          '[&_li[data-type="taskItem"]]:gap-2',
          '[&_input[type="checkbox"]]:mr-2 [&_input[type="checkbox"]]:mt-1',
          '[&_table]:border-collapse [&_table]:w-full',
          '[&_td]:border [&_td]:border-white/20 [&_td]:p-2',
          '[&_th]:border [&_th]:border-white/20 [&_th]:p-2',
          '[&_th]:bg-white/10 [&_th]:font-bold',
          '[&_.has-focus]:ring-2 [&_.has-focus]:ring-blue-400',
          isFocusMode ? 'bg-black/70' : 'bg-black/30'
        ),
      },
      handleKeyDown: (view, event) => {
        if ((event.ctrlKey || event.metaKey) && event.key === 's') {
          event.preventDefault();
          onSave?.();
          return true;
        }
        return false;
      },
    },
  });

  React.useEffect(() => {
    if (editor && editor.getHTML() !== content) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) {
    return (
      <div className="flex items-center justify-center h-[400px] text-gray-400">
        Loading editor...
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <TiptapToolbar editor={editor} />
      <div className="flex-1 overflow-auto">
        <EditorContent 
          editor={editor} 
          className="h-full"
        />
      </div>
    </div>
  );
};

export default TiptapEditor;
