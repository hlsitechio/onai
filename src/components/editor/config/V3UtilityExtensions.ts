
import { Extension } from '@tiptap/core';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Typography from '@tiptap/extension-typography';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';

export const getUtilityExtensions = () => {
  return [
    // Image support
    Image.configure({
      inline: true,
      allowBase64: true,
      HTMLAttributes: {
        class: 'rounded-lg max-w-full h-auto shadow-md',
      },
    }),

    // Link support
    Link.configure({
      openOnClick: false,
      HTMLAttributes: {
        class: 'text-noteflow-400 hover:text-noteflow-300 underline cursor-pointer transition-colors',
        rel: 'noopener noreferrer',
        target: '_blank',
      },
    }),

    // Task lists
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

    // Placeholder text
    Placeholder.configure({
      placeholder: ({ node }) => {
        if (node.type.name === 'heading') {
          return `Heading ${node.attrs.level}`;
        }
        if (node.type.name === 'taskItem') {
          return 'Add a task...';
        }
        return 'Start writing your thoughts here...';
      },
      includeChildren: true,
    }),

    // Typography enhancements
    Typography.configure({
      // Enable smart quotes, em dashes, etc.
    }),

    // Custom focus extension for better UX
    Extension.create({
      name: 'focusMode',
      addGlobalAttributes() {
        return [
          {
            types: ['paragraph', 'heading'],
            attributes: {
              class: {
                default: null,
                parseHTML: element => element.getAttribute('class'),
                renderHTML: attributes => {
                  if (!attributes.class) {
                    return {};
                  }
                  return { class: attributes.class };
                },
              },
            },
          },
        ];
      },
    }),
  ];
};
