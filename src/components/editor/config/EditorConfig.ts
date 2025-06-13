
import { common, createLowlight } from 'lowlight';

export const lowlight = createLowlight(common);

export const editorClassNames = {
  base: [
    'prose prose-invert max-w-none',
    'focus:outline-none',
    'min-h-[400px] p-6',
    '[&_.ProseMirror]:outline-none',
    '[&_.is-editor-empty:first-child::before]:content-[attr(data-placeholder)]',
    '[&_.is-editor-empty:first-child::before]:float-left',
    '[&_.is-editor-empty:first-child::before]:text-gray-400',
    '[&_.is-editor-empty:first-child::before]:pointer-events-none',
    '[&_.is-editor-empty:first-child::before]:h-0',
    '[&_h1]:text-white [&_h2]:text-white [&_h3]:text-white',
    '[&_p]:text-white [&_li]:text-white [&_strong]:text-white',
    '[&_em]:text-white [&_code]:text-white',
    '[&_blockquote]:border-l-4 [&_blockquote]:border-blue-400',
    '[&_blockquote]:pl-4 [&_blockquote]:text-gray-300',
    '[&_ul]:list-disc [&_ol]:list-decimal',
    '[&_ul[data-type="taskList"]]:list-none',
    '[&_li[data-type="taskItem"]]:flex [&_li[data-type="taskItem"]]:items-start',
    '[&_li[data-type="taskItem"]]:gap-2',
    '[&_input[type="checkbox"]]:mr-2 [&_input[type="checkbox"]]:mt-1',
    '[&_table]:border-collapse [&_table]:w-full',
    '[&_td]:border [&_td]:border-white/20 [&_td]:p-2',
    '[&_th]:border [&_th]:border-white/20 [&_th]:p-2',
    '[&_th]:bg-white/10 [&_th]:font-bold',
    '[&_.has-focus]:ring-2 [&_.has-focus]:ring-blue-400',
    // Improved line spacing
    '[&_p]:leading-relaxed [&_p]:mb-2',
    '[&_li]:leading-relaxed [&_li]:mb-1',
    '[&_h1]:leading-tight [&_h1]:mb-3',
    '[&_h2]:leading-tight [&_h2]:mb-2',
    '[&_h3]:leading-tight [&_h3]:mb-2',
    'leading-relaxed'
  ],
  focusMode: 'bg-black/70',
  normalMode: 'bg-black/30'
};

export const loadingComponent = {
  containerClass: 'flex items-center justify-center h-[400px] text-gray-400',
  spinnerClass: 'animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400 mx-auto mb-2',
  text: 'Loading V3-ready editor...'
};
