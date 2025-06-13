
import { cn } from '@/lib/utils';
import { editorClassNames } from '../config/EditorConfig';

export const createEditorProps = (isFocusMode: boolean, onSave?: () => void) => {
  return {
    attributes: {
      class: cn(
        ...editorClassNames.base,
        isFocusMode ? editorClassNames.focusMode : editorClassNames.normalMode
      ),
    },
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
  };
};
