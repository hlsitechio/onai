
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
import { lowlight } from './EditorConfig';

export interface V3ExtensionConfig {
  name: string;
  priority: number;
  performance: {
    lazy: boolean;
    cacheable: boolean;
    memoryOptimized: boolean;
  };
  accessibility: {
    ariaLabels: boolean;
    keyboardNavigation: boolean;
    screenReaderSupport: boolean;
  };
  security: {
    sanitizeContent: boolean;
    allowedAttributes: string[];
    allowedTags: string[];
  };
}

export const getV3EnhancedExtensions = () => {
  const baseConfig: Partial<V3ExtensionConfig> = {
    priority: 100,
    performance: {
      lazy: true,
      cacheable: true,
      memoryOptimized: true
    },
    accessibility: {
      ariaLabels: true,
      keyboardNavigation: true,
      screenReaderSupport: true
    },
    security: {
      sanitizeContent: true,
      allowedAttributes: ['class', 'id', 'href', 'src', 'alt', 'title'],
      allowedTags: ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'a', 'img', 'table', 'tr', 'td', 'th']
    }
  };

  return [
    StarterKit.configure({
      ...baseConfig,
      history: {
        depth: 100,
        newGroupDelay: 500,
        preserveItems: true
      },
      codeBlock: false,
      bulletList: {
        HTMLAttributes: {
          class: 'prose-list-disc',
          role: 'list'
        }
      },
      orderedList: {
        HTMLAttributes: {
          class: 'prose-list-decimal',
          role: 'list'
        }
      },
      listItem: {
        HTMLAttributes: {
          role: 'listitem'
        }
      },
      heading: {
        levels: [1, 2, 3, 4, 5, 6],
        HTMLAttributes: {
          class: 'prose-heading',
          role: 'heading'
        }
      }
    }),

    TextAlign.configure({
      ...baseConfig,
      types: ['heading', 'paragraph', 'div'],
      alignments: ['left', 'center', 'right', 'justify'],
      defaultAlignment: 'left'
    }),

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

    Table.configure({
      ...baseConfig,
      resizable: true,
      handleWidth: 5,
      cellMinWidth: 25,
      allowTableNodeSelection: true,
      HTMLAttributes: {
        class: 'border-collapse w-full table-auto',
        role: 'table'
      }
    }),

    TableRow.configure({
      HTMLAttributes: {
        class: 'border-b border-white/20',
        role: 'row'
      }
    }),

    TableHeader.configure({
      HTMLAttributes: {
        class: 'bg-white/10 font-bold p-3 border border-white/20 text-left',
        role: 'columnheader',
        scope: 'col'
      }
    }),

    TableCell.configure({
      HTMLAttributes: {
        class: 'p-3 border border-white/20',
        role: 'cell'
      }
    }),

    Color.configure({
      types: ['textStyle'],
      keepMarks: true
    }),

    TextStyle.configure({
      HTMLAttributes: {
        class: 'prose-text-style'
      }
    }),

    Highlight.configure({
      ...baseConfig,
      multicolor: true,
      HTMLAttributes: {
        class: 'bg-yellow-400/80 text-black px-1 rounded transition-colors',
        'data-highlight': 'true'
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
      openSingleQuote: ''',
      closeSingleQuote: ''',
      ellipsis: '…',
      emDash: '—',
      enDash: '–'
    }),

    Placeholder.configure({
      ...baseConfig,
      placeholder: ({ node }) => {
        if (node.type.name === 'heading') {
          return 'What\'s the title?';
        }
        return 'Start writing your V3-ready note...';
      },
      includeChildren: true,
      showOnlyCurrent: false,
      showOnlyWhenEditable: true,
      emptyEditorClass: 'is-editor-empty'
    }),

    Focus.configure({
      ...baseConfig,
      className: 'has-focus ring-2 ring-blue-400/50 rounded transition-all',
      mode: 'all'
    }),

    Dropcursor.configure({
      ...baseConfig,
      color: '#3b82f6',
      width: 3,
      class: 'drop-cursor-enhanced'
    }),

    Gapcursor.configure({
      ...baseConfig
    }),

    Underline.configure({
      ...baseConfig,
      HTMLAttributes: {
        class: 'underline decoration-2 underline-offset-2'
      }
    })
  ];
};

export const validateV3ExtensionConfig = (config: any): boolean => {
  try {
    return config && typeof config === 'object' && config.name;
  } catch (error) {
    console.warn('V3 Extension validation failed:', error);
    return false;
  }
};
