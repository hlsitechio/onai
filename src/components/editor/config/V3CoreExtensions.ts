
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import { getBaseConfig } from './V3BaseConfig';

export const getCoreExtensions = () => {
  const baseConfig = getBaseConfig();

  return [
    StarterKit.configure({
      ...baseConfig,
      history: {
        depth: 100,
        newGroupDelay: 500
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
    })
  ];
};
