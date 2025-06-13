
import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import { validateContent } from '@/utils/tiptapMigration';
import TiptapToolbar from './TiptapToolbar';
import { createEditorExtensions } from './config/EditorExtensions';
import { createEditorEventHandlers } from './handlers/EditorEventHandlers';
import { createEditorProps } from './props/EditorProps';
import { loadingComponent } from './config/EditorConfig';

interface TiptapEditorProps {
  content: string;
  setContent: (content: string) => void;
  isFocusMode?: boolean;
  onSave?: () => void;
}

const TiptapEditor: React.FC<TiptapEditorProps> = ({
  content,
  setContent,
  isFocusMode = false,
  onSave
}) => {
  const extensions = createEditorExtensions();
  const eventHandlers = createEditorEventHandlers(setContent, onSave);
  const editorProps = createEditorProps(isFocusMode, onSave);

  const editor = useEditor({
    extensions,
    content,
    ...eventHandlers,
    editorProps,
  });

  React.useEffect(() => {
    if (editor && editor.getHTML() !== content) {
      const isValid = validateContent(content);
      if (isValid) {
        editor.commands.setContent(content, false);
      } else {
        console.warn('Invalid content detected, skipping update');
      }
    }
  }, [content, editor]);

  if (!editor) {
    return (
      <div className={loadingComponent.containerClass}>
        <div className="text-center">
          <div className={loadingComponent.spinnerClass}></div>
          <p>{loadingComponent.text}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <TiptapToolbar editor={editor} onSave={onSave} />
      <div className="flex-1 overflow-auto">
        <EditorContent 
          editor={editor} 
          className="h-full"
        />
      </div>
    </div>
  );
};

export default TiptapEditor;
