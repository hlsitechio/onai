
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import Typography from '@tiptap/extension-typography';
import { lowlight } from './EditorConfig';
import { getBaseConfig } from './V3BaseConfig';

export const getContentExtensions = () => {
  const baseConfig = getBaseConfig();

  return [
    Link.configure({
      ...baseConfig,
      openOnClick: false,
      linkOnPaste: true,
      autolink: true,
      protocols: ['http', 'https', 'mailto', 'tel'],
      validate: (href: string) => {
        try {
          new URL(href);
          return true;
        } catch {
          return href.startsWith('mailto:') || href.startsWith('tel:');
        }
      },
      HTMLAttributes: {
        class: 'text-blue-400 underline cursor-pointer hover:text-blue-300 transition-colors',
        target: '_blank',
        rel: 'noopener noreferrer',
        role: 'link'
      }
    }),

    Image.configure({
      ...baseConfig,
      inline: false,
      allowBase64: true,
      HTMLAttributes: {
        class: 'max-w-full h-auto rounded-lg shadow-lg',
        loading: 'lazy',
        role: 'img'
      }
    }),

    TaskList.configure({
      ...baseConfig,
      HTMLAttributes: {
        class: 'not-prose list-none space-y-2',
        role: 'list'
      }
    }),

    TaskItem.configure({
      ...baseConfig,
      nested: true,
      HTMLAttributes: {
        class: 'flex items-start gap-3 group',
        role: 'listitem'
      }
    }),

    CodeBlockLowlight.configure({
      ...baseConfig,
      lowlight,
      HTMLAttributes: {
        class: 'bg-gray-900/90 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto shadow-inner',
        role: 'code',
        'aria-label': 'Code block'
      }
    }),

    Typography.configure({
      ...baseConfig,
      openDoubleQuote: '"',
      closeDoubleQuote: '"',
      openSingleQuote: '\'',
      closeSingleQuote: '\'',
      ellipsis: '…',
      emDash: '—'
    })
  ];
};
