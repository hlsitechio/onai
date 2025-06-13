
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
import Underline from '@tiptap/extension-underline';
import { getV3CompatibleExtensions } from '@/utils/tiptapMigration';
import { lowlight } from './EditorConfig';

export const createEditorExtensions = () => {
  const v3Config = getV3CompatibleExtensions();

  return [
    StarterKit.configure({
      ...v3Config.StarterKit,
      codeBlock: false
    }),
    TextAlign.configure(v3Config.TextAlign),
    Link.configure(v3Config.Link),
    Image.configure(v3Config.Image),
    Table.configure({
      ...v3Config.Table,
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
      multicolor: true,
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
      includeChildren: true,
      showOnlyCurrent: false,
      showOnlyWhenEditable: true,
    }),
    Focus.configure({
      className: 'has-focus',
      mode: 'all',
    }),
    Dropcursor.configure({
      color: '#3b82f6',
      width: 2,
    }),
    Gapcursor,
    Underline,
  ];
};
