
import Placeholder from '@tiptap/extension-placeholder';
import Focus from '@tiptap/extension-focus';
import Dropcursor from '@tiptap/extension-dropcursor';

export const getUtilityExtensions = () => [
  Placeholder.configure({
    placeholder: ({ node }) => {
      if (node.type.name === 'heading') {
        return 'What\'s the title?';
      }
      return 'Start writing with AI assistance...';
    },
    emptyEditorClass: 'is-editor-empty',
    emptyNodeClass: 'is-empty',
    showOnlyWhenEditable: true,
  }),
  Focus.configure({
    className: 'has-focus',
    mode: 'all',
  }),
  Dropcursor.configure({
    color: '#7c3aed',
    width: 2,
  }),
];
