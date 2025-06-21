
import { useCallback } from 'react';

export interface ToolbarActions {
  execCommand: (command: string, value?: string | null) => void;
  isActive: (type: string, attrs?: any) => boolean;
  canExecute: (command: string) => boolean;
}

export function useToolbarActions(editor?: any): ToolbarActions {
  const execCommand = useCallback((command: string, value?: string | null) => {
    console.log('Executing command:', command, value);
    
    // Try editor chain method first, then fall back to document.execCommand
    try {
      if (editor?.chain?.focus) {
        switch (command) {
          case 'bold':
            editor.chain().focus().toggleBold().run();
            break;
          case 'italic':
            editor.chain().focus().toggleItalic().run();
            break;
          case 'underline':
            editor.chain().focus().toggleUnderline().run();
            break;
          case 'strikethrough':
            editor.chain().focus().toggleStrike().run();
            break;
          case 'code':
            editor.chain().focus().toggleCode().run();
            break;
          case 'superscript':
            editor.chain().focus().toggleSuperscript().run();
            break;
          case 'subscript':
            editor.chain().focus().toggleSubscript().run();
            break;
          case 'insertUnorderedList':
            editor.chain().focus().toggleBulletList().run();
            break;
          case 'insertOrderedList':
            editor.chain().focus().toggleOrderedList().run();
            break;
          case 'undo':
            editor.chain().focus().undo().run();
            break;
          case 'redo':
            editor.chain().focus().redo().run();
            break;
          case 'foreColor':
            editor.chain().focus().setColor(value || '#000000').run();
            break;
          case 'hiliteColor':
            if (value === 'transparent') {
              editor.chain().focus().unsetHighlight().run();
            } else {
              editor.chain().focus().toggleHighlight({ color: value }).run();
            }
            break;
          case 'formatBlock':
            if (value?.startsWith('h')) {
              const level = parseInt(value.slice(1));
              editor.chain().focus().toggleHeading({ level }).run();
            } else if (value === 'p') {
              editor.chain().focus().setParagraph().run();
            }
            break;
          case 'insertHTML':
            editor.chain().focus().insertContent(value || '').run();
            break;
          default:
            // Fallback to document.execCommand
            document.execCommand(command, false, value || undefined);
        }
      } else {
        // Use document.execCommand for basic browsers
        document.execCommand(command, false, value || undefined);
      }
    } catch (error) {
      console.log('Falling back to execCommand for:', command);
      document.execCommand(command, false, value || undefined);
    }
  }, [editor]);

  const isActive = useCallback((type: string, attrs?: any) => {
    if (editor?.isActive) {
      return editor.isActive(type, attrs);
    }
    return false;
  }, [editor]);

  const canExecute = useCallback((command: string) => {
    if (editor?.can) {
      switch (command) {
        case 'bold':
          return editor.can().chain().focus().toggleBold().run();
        case 'italic':
          return editor.can().chain().focus().toggleItalic().run();
        case 'undo':
          return editor.can().chain().focus().undo().run();
        case 'redo':
          return editor.can().chain().focus().redo().run();
        default:
          return true;
      }
    }
    return true;
  }, [editor]);

  return {
    execCommand,
    isActive,
    canExecute
  };
}
