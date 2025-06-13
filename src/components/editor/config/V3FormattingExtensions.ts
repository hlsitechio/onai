
import Color from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import Highlight from '@tiptap/extension-highlight';
import Underline from '@tiptap/extension-underline';
import { getBaseConfig } from './V3BaseConfig';

export const getFormattingExtensions = () => {
  const baseConfig = getBaseConfig();

  return [
    Color.configure({
      types: ['textStyle']
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

    Underline.configure({
      ...baseConfig,
      HTMLAttributes: {
        class: 'underline decoration-2 underline-offset-2'
      }
    })
  ];
};
