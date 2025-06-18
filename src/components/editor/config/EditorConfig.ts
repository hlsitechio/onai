import { lowlight } from 'lowlight';

export const editorClassNames = {
  base: `
    prose prose-invert max-w-none
    min-h-[500px] p-6 text-white
    focus:outline-none
    [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:text-white [&_h1]:mb-4
    [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-white [&_h2]:mb-3
    [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-white [&_h3]:mb-2
    [&_p]:text-gray-300 [&_p]:leading-relaxed [&_p]:mb-3
    [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:text-gray-300
    [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:text-gray-300
    [&_li]:mb-1
    [&_blockquote]:border-l-4 [&_blockquote]:border-noteflow-400 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-gray-400
    [&_code]:bg-white/10 [&_code]:px-2 [&_code]:py-1 [&_code]:rounded [&_code]:text-noteflow-300 [&_code]:font-mono [&_code]:text-sm
    [&_pre]:bg-black/60 [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_pre]:border [&_pre]:border-white/10
    [&_.task-list]:list-none [&_.task-list]:pl-0
    [&_.task-item]:flex [&_.task-item]:items-start [&_.task-item]:gap-2 [&_.task-item]:mb-2
    [&_.task-item_input]:mt-1
  `,
  focusMode: `
    min-h-screen
    bg-black
    [&_.is-editor-empty::before]:text-gray-600
  `,
  normalMode: `
    bg-transparent
    [&_.is-editor-empty::before]:text-gray-500
  `,
};

export const loadingComponent = {
  containerClass: "flex items-center justify-center h-64 text-white",
  spinnerClass: "animate-spin rounded-full h-8 w-8 border-b-2 border-noteflow-400 mb-4",
  text: "Loading editor...",
};

export { lowlight };
