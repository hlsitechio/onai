
import { getActiveEditor, wrapSelectedText, insertTextAtCursor } from './editorUtils';
import DOMPurify from 'dompurify';

// Enhanced formatting functions
export const handleBold = () => {
  const editor = getActiveEditor();
  if (editor && editor.contentEditable === 'true') {
    document.execCommand('bold', false);
    const event = new Event('input', { bubbles: true });
    editor.dispatchEvent(event);
  } else {
    wrapSelectedText('**');
  }
};

export const handleItalic = () => {
  const editor = getActiveEditor();
  if (editor && editor.contentEditable === 'true') {
    document.execCommand('italic', false);
    const event = new Event('input', { bubbles: true });
    editor.dispatchEvent(event);
  } else {
    wrapSelectedText('*');
  }
};

export const handleUnderline = () => {
  const editor = getActiveEditor();
  if (editor && editor.contentEditable === 'true') {
    document.execCommand('underline', false);
    const event = new Event('input', { bubbles: true });
    editor.dispatchEvent(event);
  } else {
    wrapSelectedText('<u>', '</u>');
  }
};

export const handleStrikethrough = () => wrapSelectedText('~~');
export const handleCode = () => wrapSelectedText('`');

export const handleHeading = (level: number) => {
  const editor = getActiveEditor();
  if (!editor) return;

  const prefix = '#'.repeat(level) + ' ';
  
  if (editor.tagName === 'TEXTAREA') {
    const textarea = editor as HTMLTextAreaElement;
    const start = textarea.selectionStart;
    const lines = textarea.value.split('\n');
    let currentLine = 0;
    let charCount = 0;
    
    for (let i = 0; i < lines.length; i++) {
      if (charCount + lines[i].length >= start) {
        currentLine = i;
        break;
      }
      charCount += lines[i].length + 1;
    }
    
    const currentLineText = lines[currentLine];
    const headingMatch = currentLineText.match(/^#{1,6}\s*/);
    if (headingMatch) {
      lines[currentLine] = currentLineText.replace(/^#{1,6}\s*/, '');
    }
    
    lines[currentLine] = prefix + lines[currentLine];
    textarea.value = lines.join('\n');
    
    const event = new Event('input', { bubbles: true });
    textarea.dispatchEvent(event);
    textarea.focus();
  } else {
    // For contentEditable, use document.execCommand for headings
    document.execCommand('formatBlock', false, `h${level}`);
    const event = new Event('input', { bubbles: true });
    editor.dispatchEvent(event);
  }
};

export const handleInsertList = (ordered: boolean = false) => {
  const editor = getActiveEditor();
  if (!editor) return;

  if (editor.contentEditable === 'true') {
    if (ordered) {
      document.execCommand('insertOrderedList', false);
    } else {
      document.execCommand('insertUnorderedList', false);
    }
    const event = new Event('input', { bubbles: true });
    editor.dispatchEvent(event);
  } else {
    const prefix = ordered ? '1. ' : '- ';
    insertTextAtCursor('\n' + prefix);
  }
};

export const handleInsertLink = () => {
  const url = prompt('Enter URL:', 'https://');
  if (url && url.trim()) {
    const sanitizedUrl = DOMPurify.sanitize(url.trim());
    const linkText = prompt('Enter link text:', 'Link text') || 'Link text';
    
    const editor = getActiveEditor();
    if (editor && editor.contentEditable === 'true') {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const selectedText = range.toString();
        
        if (selectedText) {
          document.execCommand('createLink', false, sanitizedUrl);
        } else {
          const link = document.createElement('a');
          link.href = sanitizedUrl;
          link.textContent = linkText;
          range.insertNode(link);
          range.setStartAfter(link);
          range.collapse(true);
          selection.removeAllRanges();
          selection.addRange(range);
        }
        
        const event = new Event('input', { bubbles: true });
        editor.dispatchEvent(event);
      }
    } else {
      insertTextAtCursor(`[${linkText}](${sanitizedUrl})`);
    }
  }
};

export const handleBlockquote = () => {
  const editor = getActiveEditor();
  if (!editor) return;

  if (editor.contentEditable === 'true') {
    document.execCommand('formatBlock', false, 'blockquote');
    const event = new Event('input', { bubbles: true });
    editor.dispatchEvent(event);
  } else {
    insertTextAtCursor('\n> ');
  }
};

export const handleInsertImage = () => {
  const url = prompt('Enter image URL:', 'https://');
  if (url && url.trim()) {
    const altText = prompt('Enter alt text:', 'Image') || 'Image';
    const sanitizedUrl = DOMPurify.sanitize(url.trim());
    
    const editor = getActiveEditor();
    if (editor && editor.contentEditable === 'true') {
      const img = document.createElement('img');
      img.src = sanitizedUrl;
      img.alt = altText;
      img.style.maxWidth = '100%';
      
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.insertNode(img);
        range.setStartAfter(img);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
        
        const event = new Event('input', { bubbles: true });
        editor.dispatchEvent(event);
      }
    } else {
      insertTextAtCursor(`\n![${altText}](${sanitizedUrl})\n`);
    }
  }
};
