
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import Typography from '@tiptap/extension-typography';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';

export const getFormattingExtensions = () => [
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
  }),
  Highlight.configure({
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
];
