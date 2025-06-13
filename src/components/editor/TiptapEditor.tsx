
import React, { useEffect, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import { validateContent } from '@/utils/tiptapMigration';
import { createContentValidator } from '@/utils/v3ContentValidation';
import { optimizeEditorForV3 } from '@/utils/v3PerformanceOptimizations';
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
  const performanceOptimizerCleanupRef = useRef<(() => void) | null>(null);

  const editor = useEditor({
    extensions,
    content,
    ...eventHandlers,
    editorProps,
    onCreate: ({ editor: createdEditor }) => {
      // Initialize V3 performance optimizations
      const cleanup = optimizeEditorForV3(createdEditor);
      performanceOptimizerCleanupRef.current = cleanup;
      
      // Initialize content validator
      const validator = createContentValidator(createdEditor);
      console.log('V3 Content Validation:', validator.getValidationReport());
      
      // Call original onCreate if it exists
      eventHandlers.onCreate?.({ editor: createdEditor });
    },
    onUpdate: ({ editor: updatedEditor }) => {
      const content = updatedEditor.getHTML();
      if (validateContent(content)) {
        setContent(content);
      }
      
      // Call original onUpdate if it exists
      eventHandlers.onUpdate?.({ editor: updatedEditor });
    }
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

  // Cleanup performance optimizer on unmount
  useEffect(() => {
    return () => {
      if (performanceOptimizerCleanupRef.current) {
        performanceOptimizerCleanupRef.current();
      }
    };
  }, []);

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
