
import { getActiveEditor } from './editorUtils';
import DOMPurify from 'dompurify';

export const handleFind = (text: string, options: { caseSensitive: boolean; wholeWord: boolean; useRegex?: boolean }) => {
  if (!text.trim()) return;
  
  const editor = getActiveEditor();
  if (!editor) return;
  
  let content = '';
  if (editor.tagName === 'TEXTAREA') {
    content = (editor as HTMLTextAreaElement).value;
  } else {
    content = editor.textContent || '';
  }
  
  try {
    const searchText = options.caseSensitive ? content : content.toLowerCase();
    const findText = options.caseSensitive ? text : text.toLowerCase();
    const index = searchText.indexOf(findText);
    
    if (index !== -1) {
      if (editor.tagName === 'TEXTAREA') {
        const textarea = editor as HTMLTextAreaElement;
        textarea.setSelectionRange(index, index + text.length);
        textarea.focus();
      } else {
        // For contentEditable, we'll focus the editor
        editor.focus();
      }
    }
  } catch (error) {
    console.error('Search error:', error);
  }
};

export const handleReplace = (findText: string, replaceText: string, replaceAll: boolean) => {
  const editor = getActiveEditor();
  if (!editor) return;
  
  const sanitizedReplaceText = DOMPurify.sanitize(replaceText);
  
  if (editor.tagName === 'TEXTAREA') {
    const textarea = editor as HTMLTextAreaElement;
    if (replaceAll) {
      const newContent = textarea.value.replace(
        new RegExp(findText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), 
        sanitizedReplaceText
      );
      textarea.value = newContent;
    } else {
      const selectedText = textarea.value.substring(textarea.selectionStart, textarea.selectionEnd);
      if (selectedText === findText) {
        const start = textarea.selectionStart;
        const beforeText = textarea.value.substring(0, start);
        const afterText = textarea.value.substring(textarea.selectionEnd);
        
        textarea.value = beforeText + sanitizedReplaceText + afterText;
        textarea.setSelectionRange(start + sanitizedReplaceText.length, start + sanitizedReplaceText.length);
      }
    }
    
    const event = new Event('input', { bubbles: true });
    textarea.dispatchEvent(event);
    textarea.focus();
  }
};
