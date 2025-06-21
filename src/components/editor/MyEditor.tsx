
import React from 'react';
import { HeadingButton } from '@/components/tiptap-ui/heading-button';
import { EditorContent, EditorContext, useEditor } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';

import '@/components/tiptap-node/paragraph-node/paragraph-node.scss';

export default function MyEditor() {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit],
    content: `
      <h1>Heading 1</h1>
      <h2>Heading 2</h2>
      <h3>Heading 3</h3>
      <h4>Heading 4</h4>
    `,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
      },
    },
  });

  return (
    <EditorContext.Provider value={{ editor }}>
      <div className="w-full max-w-4xl mx-auto p-4">
        <div className="tiptap-button-group" data-orientation="horizontal">
          <HeadingButton level={1} />
          <HeadingButton level={2} />
          <HeadingButton level={3} />
          <HeadingButton level={4} />
        </div>

        <EditorContent 
          editor={editor} 
          role="presentation"
          className="min-h-[200px] p-4 border border-input rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
        />
      </div>
    </EditorContext.Provider>
  );
}
