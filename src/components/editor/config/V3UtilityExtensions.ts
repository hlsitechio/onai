
import Placeholder from '@tiptap/extension-placeholder';
import Focus from '@tiptap/extension-focus';
import Dropcursor from '@tiptap/extension-dropcursor';
import Gapcursor from '@tiptap/extension-gapcursor';
import { getBaseConfig } from './V3BaseConfig';

export const getUtilityExtensions = () => {
  const baseConfig = getBaseConfig();

  return [
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
    })
  ];
};
