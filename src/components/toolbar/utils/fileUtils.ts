
import { getActiveEditor, insertTextAtCursor } from './editorUtils';

export const handleInsertTable = (rows: number, cols: number, hasHeader: boolean) => {
  let tableMarkdown = '\n';
  
  if (hasHeader) {
    const headerCells = Array(cols).fill('Header').map((text, i) => `${text} ${i + 1}`);
    tableMarkdown += '| ' + headerCells.join(' | ') + ' |\n';
    tableMarkdown += '| ' + Array(cols).fill('---').join(' | ') + ' |\n';
    rows--;
  }
  
  for (let r = 0; r < rows; r++) {
    const rowCells = Array(cols).fill('Cell');
    tableMarkdown += '| ' + rowCells.join(' | ') + ' |\n';
  }
  
  tableMarkdown += '\n';
  insertTextAtCursor(tableMarkdown);
};

export const handleExportMarkdown = () => {
  const editor = getActiveEditor();
  if (!editor) return;
  
  let content = '';
  if (editor.tagName === 'TEXTAREA') {
    content = (editor as HTMLTextAreaElement).value;
  } else {
    content = editor.textContent || '';
  }
  
  const blob = new Blob([content], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `note-${new Date().toISOString().split('T')[0]}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const handleImportFile = () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.md,.txt';
  input.onchange = (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        const editor = getActiveEditor();
        if (editor) {
          if (editor.tagName === 'TEXTAREA') {
            (editor as HTMLTextAreaElement).value = content;
          } else {
            editor.textContent = content;
          }
          const event = new Event('input', { bubbles: true });
          editor.dispatchEvent(event);
        }
      };
      reader.readAsText(file);
    }
  };
  input.click();
};
