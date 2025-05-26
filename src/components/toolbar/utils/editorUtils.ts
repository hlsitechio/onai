
import DOMPurify from 'dompurify';

// Get active editor element (either textarea or contentEditable div)
export const getActiveEditor = (): HTMLTextAreaElement | HTMLDivElement | null => {
  const activeElement = document.activeElement as HTMLTextAreaElement | HTMLDivElement;
  
  // Check for textarea first
  if (activeElement && activeElement.tagName === 'TEXTAREA') {
    return activeElement as HTMLTextAreaElement;
  }
  
  // Check for contentEditable div
  if (activeElement && activeElement.contentEditable === 'true') {
    return activeElement as HTMLDivElement;
  }
  
  // Fallback: look for any contentEditable element in the editor
  const contentEditableElements = document.querySelectorAll('[contenteditable="true"]');
  if (contentEditableElements.length > 0) {
    return contentEditableElements[0] as HTMLDivElement;
  }
  
  // Fallback: look for textarea in the editor
  const textareaElements = document.querySelectorAll('textarea');
  if (textareaElements.length > 0) {
    return textareaElements[0] as HTMLTextAreaElement;
  }
  
  return null;
};

// Enhanced text manipulation for both textarea and contentEditable
export const insertTextAtCursor = (text: string) => {
  const editor = getActiveEditor();
  if (!editor) {
    console.warn('No active editor found');
    return;
  }

  if (editor.tagName === 'TEXTAREA') {
    const textarea = editor as HTMLTextAreaElement;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const beforeText = textarea.value.substring(0, start);
    const afterText = textarea.value.substring(end);
    
    textarea.value = beforeText + text + afterText;
    
    // Trigger change event to update the editor state
    const event = new Event('input', { bubbles: true });
    textarea.dispatchEvent(event);
    
    const newCursorPos = start + text.length;
    textarea.setSelectionRange(newCursorPos, newCursorPos);
    textarea.focus();
  } else {
    // ContentEditable div
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      
      // Create text node for plain text or HTML for formatted content
      const isHTML = text.includes('<') && text.includes('>');
      if (isHTML) {
        const div = document.createElement('div');
        div.innerHTML = DOMPurify.sanitize(text);
        const fragment = document.createDocumentFragment();
        while (div.firstChild) {
          fragment.appendChild(div.firstChild);
        }
        range.insertNode(fragment);
      } else {
        const textNode = document.createTextNode(text);
        range.insertNode(textNode);
        range.setStartAfter(textNode);
      }
      
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
      
      // Trigger input event to update content
      const event = new Event('input', { bubbles: true });
      editor.dispatchEvent(event);
    }
    editor.focus();
  }
};

export const wrapSelectedText = (prefix: string, suffix: string = prefix) => {
  const editor = getActiveEditor();
  if (!editor) {
    console.warn('No active editor found');
    return;
  }

  if (editor.tagName === 'TEXTAREA') {
    const textarea = editor as HTMLTextAreaElement;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    const beforeText = textarea.value.substring(0, start);
    const afterText = textarea.value.substring(end);
    
    const newText = beforeText + prefix + selectedText + suffix + afterText;
    textarea.value = newText;
    
    const event = new Event('input', { bubbles: true });
    textarea.dispatchEvent(event);
    
    const newCursorPos = start + prefix.length + selectedText.length + suffix.length;
    textarea.setSelectionRange(newCursorPos, newCursorPos);
    textarea.focus();
  } else {
    // ContentEditable div
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const selectedText = range.toString();
      
      range.deleteContents();
      const wrappedText = prefix + selectedText + suffix;
      const textNode = document.createTextNode(wrappedText);
      range.insertNode(textNode);
      
      // Set cursor after the wrapped text
      range.setStartAfter(textNode);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
      
      const event = new Event('input', { bubbles: true });
      editor.dispatchEvent(event);
    }
    editor.focus();
  }
};
