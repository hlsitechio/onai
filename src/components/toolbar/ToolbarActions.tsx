
import React, { useEffect } from "react";
import { 
  Bold, 
  Italic, 
  Underline, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Undo, 
  Redo,
  List,
  ListOrdered,
  Quote,
  Code,
  Link,
  Heading1,
  Heading2,
  Strikethrough,
  Image,
  Save,
  Download,
  Upload
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import DOMPurify from 'dompurify';
import FindReplaceDialog from "./FindReplaceDialog";
import FontControls from "./FontControls";
import ColorPicker from "./ColorPicker";
import TableInsertDialog from "./TableInsertDialog";

interface ToolbarActionsProps {
  execCommand: (command: string, value?: string | null) => void;
  isFocusMode: boolean;
}

const ToolbarActions: React.FC<ToolbarActionsProps> = ({
  execCommand,
  isFocusMode
}) => {
  // Get active editor element (either textarea or contentEditable div)
  const getActiveEditor = (): HTMLTextAreaElement | HTMLDivElement | null => {
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
    
    return null;
  };

  // Enhanced text manipulation for both textarea and contentEditable
  const insertTextAtCursor = (text: string) => {
    const editor = getActiveEditor();
    if (!editor) return;

    if (editor.tagName === 'TEXTAREA') {
      const textarea = editor as HTMLTextAreaElement;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const beforeText = textarea.value.substring(0, start);
      const afterText = textarea.value.substring(end);
      
      textarea.value = beforeText + text + afterText;
      
      // Trigger change event
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
        const textNode = document.createTextNode(text);
        range.insertNode(textNode);
        range.setStartAfter(textNode);
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

  const wrapSelectedText = (prefix: string, suffix: string = prefix) => {
    const editor = getActiveEditor();
    if (!editor) return;

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

  // Enhanced formatting functions
  const handleBold = () => wrapSelectedText('**');
  const handleItalic = () => wrapSelectedText('*');
  const handleUnderline = () => wrapSelectedText('<u>', '</u>');
  const handleStrikethrough = () => wrapSelectedText('~~');
  const handleCode = () => wrapSelectedText('`');

  const handleHeading = (level: number) => {
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
      // For contentEditable, insert at current position
      insertTextAtCursor('\n' + prefix);
    }
  };

  const handleInsertList = (ordered: boolean = false) => {
    const prefix = ordered ? '1. ' : '- ';
    insertTextAtCursor('\n' + prefix);
  };

  const handleInsertLink = () => {
    const url = prompt('Enter URL:', 'https://');
    if (url && url.trim()) {
      const sanitizedUrl = DOMPurify.sanitize(url.trim());
      const linkText = prompt('Enter link text:', 'Link text') || 'Link text';
      insertTextAtCursor(`[${linkText}](${sanitizedUrl})`);
    }
  };

  const handleBlockquote = () => {
    insertTextAtCursor('\n> ');
  };

  const handleInsertImage = () => {
    const url = prompt('Enter image URL:', 'https://');
    if (url && url.trim()) {
      const altText = prompt('Enter alt text:', 'Image') || 'Image';
      const sanitizedUrl = DOMPurify.sanitize(url.trim());
      insertTextAtCursor(`\n![${altText}](${sanitizedUrl})\n`);
    }
  };

  const handleFind = (text: string, options: { caseSensitive: boolean; wholeWord: boolean; useRegex?: boolean }) => {
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

  const handleReplace = (findText: string, replaceText: string, replaceAll: boolean) => {
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

  const handleFontFamilyChange = (fontFamily: string) => {
    const editor = getActiveEditor();
    if (editor) {
      editor.style.fontFamily = fontFamily;
    }
  };

  const handleFontSizeChange = (action: 'increase' | 'decrease' | 'set', size?: number) => {
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

  const handleColorChange = (color: string, type: 'text' | 'background') => {
    const editor = getActiveEditor();
    if (editor) {
      if (type === 'text') {
        editor.style.color = color;
      } else {
        editor.style.backgroundColor = color;
      }
    }
  };

  const handleInsertTable = (rows: number, cols: number, hasHeader: boolean) => {
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

  const handleExportMarkdown = () => {
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

  const handleImportFile = () => {
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

  // Keyboard shortcuts using native event listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only trigger if we have an active editor
      if (!getActiveEditor()) return;
      
      // Check for Ctrl/Cmd key combinations
      const isCtrlOrCmd = e.ctrlKey || e.metaKey;
      
      if (isCtrlOrCmd) {
        switch (e.key.toLowerCase()) {
          case 'b':
            e.preventDefault();
            handleBold();
            break;
          case 'i':
            e.preventDefault();
            handleItalic();
            break;
          case 'u':
            e.preventDefault();
            handleUnderline();
            break;
          case 'k':
            e.preventDefault();
            handleInsertLink();
            break;
        }
        
        // Check for Shift combinations
        if (e.shiftKey) {
          switch (e.key) {
            case '!': // Ctrl+Shift+1
              e.preventDefault();
              handleHeading(1);
              break;
            case '@': // Ctrl+Shift+2
              e.preventDefault();
              handleHeading(2);
              break;
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="flex flex-wrap items-center gap-1 md:gap-2">
      {/* Find & Replace */}
      <div className="hidden lg:flex items-center">
        <FindReplaceDialog 
          onFind={handleFind}
          onReplace={handleReplace}
        />
        <Separator orientation="vertical" className="h-6 bg-white/10 mx-1" />
      </div>

      {/* Font Controls */}
      <div className="hidden xl:flex items-center">
        <FontControls
          onFontFamilyChange={handleFontFamilyChange}
          onFontSizeChange={handleFontSizeChange}
        />
        <Separator orientation="vertical" className="h-6 bg-white/10 mx-1" />
      </div>

      {/* Import/Export */}
      <div className="hidden lg:flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleImportFile}
          className="text-slate-300 hover:text-white hover:bg-white/10 p-1.5 md:p-2"
          title="Import File"
        >
          <Upload className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleExportMarkdown}
          className="text-slate-300 hover:text-white hover:bg-white/10 p-1.5 md:p-2"
          title="Export as Markdown"
        >
          <Download className="h-4 w-4" />
        </Button>
        
        <Separator orientation="vertical" className="h-6 bg-white/10 mx-1" />
      </div>

      {/* Text Formatting Group */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBold}
          className="text-slate-300 hover:text-white hover:bg-white/10 p-1.5 md:p-2"
          title="Bold (Ctrl+B)"
        >
          <Bold className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleItalic}
          className="text-slate-300 hover:text-white hover:bg-white/10 p-1.5 md:p-2"
          title="Italic (Ctrl+I)"
        >
          <Italic className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleUnderline}
          className="text-slate-300 hover:text-white hover:bg-white/10 p-1.5 md:p-2"
          title="Underline (Ctrl+U)"
        >
          <Underline className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleStrikethrough}
          className="text-slate-300 hover:text-white hover:bg-white/10 p-1.5 md:p-2"
          title="Strikethrough"
        >
          <Strikethrough className="h-4 w-4" />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6 bg-white/10" />

      {/* Color Controls */}
      <div className="hidden lg:flex items-center">
        <ColorPicker onColorChange={handleColorChange} />
      </div>

      {/* Heading Group */}
      <div className="hidden lg:flex items-center gap-1">
        <Separator orientation="vertical" className="h-6 bg-white/10" />
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleHeading(1)}
          className="text-slate-300 hover:text-white hover:bg-white/10 p-1.5 md:p-2"
          title="Heading 1 (Ctrl+Shift+1)"
        >
          <Heading1 className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleHeading(2)}
          className="text-slate-300 hover:text-white hover:bg-white/10 p-1.5 md:p-2"
          title="Heading 2 (Ctrl+Shift+2)"
        >
          <Heading2 className="h-4 w-4" />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6 bg-white/10 hidden lg:block" />

      {/* List and Structure Group */}
      <div className="hidden md:flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleInsertList(false)}
          className="text-slate-300 hover:text-white hover:bg-white/10 p-1.5 md:p-2"
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleInsertList(true)}
          className="text-slate-300 hover:text-white hover:bg-white/10 p-1.5 md:p-2"
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleBlockquote}
          className="text-slate-300 hover:text-white hover:bg-white/10 p-1.5 md:p-2"
          title="Quote"
        >
          <Quote className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleCode}
          className="text-slate-300 hover:text-white hover:bg-white/10 p-1.5 md:p-2"
          title="Code Block"
        >
          <Code className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleInsertLink}
          className="text-slate-300 hover:text-white hover:bg-white/10 p-1.5 md:p-2"
          title="Insert Link (Ctrl+K)"
        >
          <Link className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleInsertImage}
          className="text-slate-300 hover:text-white hover:bg-white/10 p-1.5 md:p-2"
          title="Insert Image"
        >
          <Image className="h-4 w-4" />
        </Button>

        <TableInsertDialog onInsertTable={handleInsertTable} />
      </div>

      {/* Alignment buttons - disabled for textarea */}
      <div className="hidden xl:flex items-center gap-1">
        <Separator orientation="vertical" className="h-6 bg-white/10" />

        <Button
          variant="ghost"
          size="sm"
          onClick={() => {}}
          className="text-slate-300 hover:text-white hover:bg-white/10 p-1.5 md:p-2 opacity-50 cursor-not-allowed"
          title="Text alignment not available in plain text mode"
        >
          <AlignLeft className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => {}}
          className="text-slate-300 hover:text-white hover:bg-white/10 p-1.5 md:p-2 opacity-50 cursor-not-allowed"
          title="Text alignment not available in plain text mode"
        >
          <AlignCenter className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => {}}
          className="text-slate-300 hover:text-white hover:bg-white/10 p-1.5 md:p-2 opacity-50 cursor-not-allowed"
          title="Text alignment not available in plain text mode"
        >
          <AlignRight className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="h-6 bg-white/10" />

        <Button
          variant="ghost"
          size="sm"
          onClick={() => {}}
          className="text-slate-300 hover:text-white hover:bg-white/10 p-1.5 md:p-2 opacity-50 cursor-not-allowed"
          title="Undo not available in plain text mode"
        >
          <Undo className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => {}}
          className="text-slate-300 hover:text-white hover:bg-white/10 p-1.5 md:p-2 opacity-50 cursor-not-allowed"
          title="Redo not available in plain text mode"
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ToolbarActions;
