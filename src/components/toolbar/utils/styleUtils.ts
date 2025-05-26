
import { getActiveEditor } from './editorUtils';

export const handleFontFamilyChange = (fontFamily: string) => {
  const editor = getActiveEditor();
  if (editor) {
    editor.style.fontFamily = fontFamily;
  }
};

export const handleFontSizeChange = (action: 'increase' | 'decrease' | 'set', size?: number) => {
  const editor = getActiveEditor();
  if (!editor) return;
  
  const currentSize = parseFloat(window.getComputedStyle(editor).fontSize);
  
  switch (action) {
    case 'increase':
      editor.style.fontSize = `${Math.min(currentSize + 2, 32)}px`;
      break;
    case 'decrease':
      editor.style.fontSize = `${Math.max(currentSize - 2, 8)}px`;
      break;
    case 'set':
      if (size) editor.style.fontSize = `${size}px`;
      break;
  }
};

export const handleColorChange = (color: string, type: 'text' | 'background') => {
  const editor = getActiveEditor();
  if (editor) {
    if (type === 'text') {
      editor.style.color = color;
    } else {
      editor.style.backgroundColor = color;
    }
  }
};
