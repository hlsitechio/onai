
import type { EditorProps as TiptapEditorProps } from '@tiptap/pm/view';
import { editorClassNames } from '../config/EditorConfig';

export const createEditorProps = (
  isFocusMode: boolean = false,
  onSave?: () => void
): TiptapEditorProps => {
  return {
    attributes: {
      class: [
        ...editorClassNames.base,
        isFocusMode ? editorClassNames.focusMode : editorClassNames.normalMode
      ].join(' ')
    },
    
    handleKeyDown: (view, event) => {
      // Save shortcut
      if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault();
        onSave?.();
        return true;
      }
      
      // Bold shortcut
      if ((event.ctrlKey || event.metaKey) && event.key === 'b') {
        event.preventDefault();
        view.dispatch(view.state.tr.addMark(
          view.state.selection.from,
          view.state.selection.to,
          view.state.schema.marks.strong.create()
        ));
        return true;
      }
      
      // Italic shortcut
      if ((event.ctrlKey || event.metaKey) && event.key === 'i') {
        event.preventDefault();
        view.dispatch(view.state.tr.addMark(
          view.state.selection.from,
          view.state.selection.to,
          view.state.schema.marks.em.create()
        ));
        return true;
      }
      
      return false;
    },
    
    handlePaste: (view, event, slice) => {
      // Allow default paste behavior for V3 compatibility
      return false;
    },
    
    handleDrop: (view, event, slice, moved) => {
      // Allow default drop behavior for V3 compatibility
      return false;
    },
    
    transformPastedHTML: (html) => {
      // V3-compatible HTML transformation
      return html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
    },
    
    transformPastedText: (text) => {
      // V3-compatible text transformation
      return text.trim();
    },
    
    clipboardTextSerializer: (slice) => {
      // V3-compatible text serialization
      return slice.content.textBetween(0, slice.content.size, '\n\n');
    }
  };
};
