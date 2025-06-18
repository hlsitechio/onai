
import { Extension } from '@tiptap/core';
import { Placeholder } from '@tiptap/extension-placeholder';
import { Focus } from '@tiptap/extension-focus';
import { Typography } from '@tiptap/extension-typography';

export const getUtilityExtensions = (): Extension[] => {
  return [
    Placeholder.configure({
      placeholder: ({ node }) => {
        if (node.type.name === 'heading') {
          return 'What's the title?';
        }
        return 'Start writing your thoughts...';
      },
      emptyEditorClass: 'is-editor-empty',
      emptyNodeClass: 'is-empty',
      includeChildren: true,
    }),
    Focus.configure({
      className: 'has-focus',
      mode: 'all',
    }),
    Typography.configure({
      openDoubleQuote: '"',
      closeDoubleQuote: '"',
      openSingleQuote: ''',
      closeSingleQuote: ''',
    }),
  ];
};
