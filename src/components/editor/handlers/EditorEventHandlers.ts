
import type { Editor } from '@tiptap/react';
import { validateContent, checkV3Readiness } from '@/utils/tiptapMigration';

export const createEditorEventHandlers = (
  setContent: (content: string) => void,
  onSave?: () => void
) => {
  return {
    onUpdate: ({ editor: updatedEditor }: { editor: Editor }) => {
      const newContent = updatedEditor.getHTML();
      if (validateContent(newContent)) {
        setContent(newContent);
      }
    },
    onCreate: ({ editor: createdEditor }: { editor: Editor }) => {
      const readiness = checkV3Readiness(createdEditor);
      console.log('Tiptap V3 Readiness:', readiness);
    },
    onSelectionUpdate: ({ editor: updatedEditor }: { editor: Editor }) => {
      console.log('Selection updated - V3 ready');
    },
    editorProps: {
      handleKeyDown: (view: any, event: KeyboardEvent) => {
        if ((event.ctrlKey || event.metaKey) && event.key === 's') {
          event.preventDefault();
          onSave?.();
          return true;
        }
        return false;
      },
      handlePaste: (view: any, event: ClipboardEvent, slice: any) => {
        return false;
      },
      handleDrop: (view: any, event: DragEvent, slice: any, moved: boolean) => {
        return false;
      },
    }
  };
};
