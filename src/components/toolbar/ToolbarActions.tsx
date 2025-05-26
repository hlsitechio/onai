
import React from "react";
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
  Image
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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
  // Text formatting functions for textarea
  const wrapSelectedText = (prefix: string, suffix: string = prefix) => {
    const activeElement = document.activeElement as HTMLTextAreaElement;
    if (!activeElement || activeElement.tagName !== 'TEXTAREA') return;

    const start = activeElement.selectionStart;
    const end = activeElement.selectionEnd;
    const selectedText = activeElement.value.substring(start, end);
    const beforeText = activeElement.value.substring(0, start);
    const afterText = activeElement.value.substring(end);
    
    const newText = beforeText + prefix + selectedText + suffix + afterText;
    activeElement.value = newText;
    
    // Trigger change event
    const event = new Event('input', { bubbles: true });
    activeElement.dispatchEvent(event);
    
    // Set cursor position
    const newCursorPos = start + prefix.length + selectedText.length + suffix.length;
    activeElement.setSelectionRange(newCursorPos, newCursorPos);
    activeElement.focus();
  };

  const insertText = (text: string) => {
    const activeElement = document.activeElement as HTMLTextAreaElement;
    if (!activeElement || activeElement.tagName !== 'TEXTAREA') return;

    const start = activeElement.selectionStart;
    const end = activeElement.selectionEnd;
    const beforeText = activeElement.value.substring(0, start);
    const afterText = activeElement.value.substring(end);
    
    const newText = beforeText + text + afterText;
    activeElement.value = newText;
    
    // Trigger change event
    const event = new Event('input', { bubbles: true });
    activeElement.dispatchEvent(event);
    
    // Set cursor position
    const newCursorPos = start + text.length;
    activeElement.setSelectionRange(newCursorPos, newCursorPos);
    activeElement.focus();
  };

  const handleBold = () => wrapSelectedText('**');
  const handleItalic = () => wrapSelectedText('*');
  const handleUnderline = () => wrapSelectedText('<u>', '</u>');
  const handleStrikethrough = () => wrapSelectedText('~~');

  const handleHeading = (level: number) => {
    const prefix = '#'.repeat(level) + ' ';
    const activeElement = document.activeElement as HTMLTextAreaElement;
    if (!activeElement || activeElement.tagName !== 'TEXTAREA') return;

    const start = activeElement.selectionStart;
    const lines = activeElement.value.split('\n');
    let currentLine = 0;
    let charCount = 0;
    
    // Find which line the cursor is on
    for (let i = 0; i < lines.length; i++) {
      if (charCount + lines[i].length >= start) {
        currentLine = i;
        break;
      }
      charCount += lines[i].length + 1; // +1 for newline
    }
    
    // Add heading prefix to current line
    lines[currentLine] = prefix + lines[currentLine];
    activeElement.value = lines.join('\n');
    
    // Trigger change event
    const event = new Event('input', { bubbles: true });
    activeElement.dispatchEvent(event);
    
    activeElement.focus();
  };

  const handleInsertList = (ordered: boolean = false) => {
    const activeElement = document.activeElement as HTMLTextAreaElement;
    if (!activeElement || activeElement.tagName !== 'TEXTAREA') return;

    const start = activeElement.selectionStart;
    const selectedText = activeElement.value.substring(activeElement.selectionStart, activeElement.selectionEnd);
    
    if (selectedText) {
      // Convert selected text to list
      const lines = selectedText.split('\n');
      const listItems = lines.map((line, index) => {
        const prefix = ordered ? `${index + 1}. ` : '- ';
        return prefix + line;
      }).join('\n');
      
      const beforeText = activeElement.value.substring(0, activeElement.selectionStart);
      const afterText = activeElement.value.substring(activeElement.selectionEnd);
      activeElement.value = beforeText + listItems + afterText;
    } else {
      // Insert single list item
      const prefix = ordered ? '1. ' : '- ';
      insertText(prefix);
    }
    
    // Trigger change event
    const event = new Event('input', { bubbles: true });
    activeElement.dispatchEvent(event);
    
    activeElement.focus();
  };

  const handleInsertLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      const linkText = prompt('Enter link text:') || url;
      insertText(`[${linkText}](${url})`);
    }
  };

  const handleBlockquote = () => {
    const activeElement = document.activeElement as HTMLTextAreaElement;
    if (!activeElement || activeElement.tagName !== 'TEXTAREA') return;

    const start = activeElement.selectionStart;
    const lines = activeElement.value.split('\n');
    let currentLine = 0;
    let charCount = 0;
    
    // Find which line the cursor is on
    for (let i = 0; i < lines.length; i++) {
      if (charCount + lines[i].length >= start) {
        currentLine = i;
        break;
      }
      charCount += lines[i].length + 1;
    }
    
    // Add blockquote prefix
    lines[currentLine] = '> ' + lines[currentLine];
    activeElement.value = lines.join('\n');
    
    // Trigger change event
    const event = new Event('input', { bubbles: true });
    activeElement.dispatchEvent(event);
    
    activeElement.focus();
  };

  const handleCode = () => wrapSelectedText('`');

  const handleInsertImage = () => {
    const url = prompt('Enter image URL:');
    if (url) {
      const altText = prompt('Enter alt text:') || 'Image';
      insertText(`![${altText}](${url})`);
    }
  };

  // Find & Replace functionality for textarea
  const handleFind = (text: string, options: { caseSensitive: boolean; wholeWord: boolean }) => {
    if (!text.trim()) return;
    
    const activeElement = document.activeElement as HTMLTextAreaElement;
    if (!activeElement || activeElement.tagName !== 'TEXTAREA') return;
    
    const content = activeElement.value;
    let searchText = options.caseSensitive ? content : content.toLowerCase();
    let findText = options.caseSensitive ? text : text.toLowerCase();
    
    if (options.wholeWord) {
      const regex = new RegExp(`\\b${findText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, options.caseSensitive ? 'g' : 'gi');
      const match = regex.exec(content);
      if (match) {
        activeElement.setSelectionRange(match.index, match.index + match[0].length);
        activeElement.focus();
      }
    } else {
      const index = searchText.indexOf(findText);
      if (index !== -1) {
        activeElement.setSelectionRange(index, index + text.length);
        activeElement.focus();
      }
    }
  };

  const handleReplace = (findText: string, replaceText: string, replaceAll: boolean) => {
    const activeElement = document.activeElement as HTMLTextAreaElement;
    if (!activeElement || activeElement.tagName !== 'TEXTAREA') return;
    
    if (replaceAll) {
      const newContent = activeElement.value.replace(new RegExp(findText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), replaceText);
      activeElement.value = newContent;
      
      // Trigger change event
      const event = new Event('input', { bubbles: true });
      activeElement.dispatchEvent(event);
    } else {
      const selectedText = activeElement.value.substring(activeElement.selectionStart, activeElement.selectionEnd);
      if (selectedText === findText) {
        const start = activeElement.selectionStart;
        const beforeText = activeElement.value.substring(0, start);
        const afterText = activeElement.value.substring(activeElement.selectionEnd);
        
        activeElement.value = beforeText + replaceText + afterText;
        
        // Trigger change event
        const event = new Event('input', { bubbles: true });
        activeElement.dispatchEvent(event);
        
        activeElement.setSelectionRange(start + replaceText.length, start + replaceText.length);
      }
    }
    
    activeElement.focus();
  };

  // Font controls - these will apply to the whole textarea
  const handleFontFamilyChange = (fontFamily: string) => {
    const activeElement = document.activeElement as HTMLTextAreaElement;
    if (activeElement && activeElement.tagName === 'TEXTAREA') {
      activeElement.style.fontFamily = fontFamily;
    }
  };

  const handleFontSizeChange = (action: 'increase' | 'decrease' | 'set', size?: number) => {
    const activeElement = document.activeElement as HTMLTextAreaElement;
    if (!activeElement || activeElement.tagName !== 'TEXTAREA') return;
    
    const currentSize = parseFloat(window.getComputedStyle(activeElement).fontSize);
    
    if (action === 'increase') {
      activeElement.style.fontSize = `${currentSize + 2}px`;
    } else if (action === 'decrease') {
      activeElement.style.fontSize = `${Math.max(currentSize - 2, 10)}px`;
    } else if (action === 'set' && size) {
      activeElement.style.fontSize = `${size}px`;
    }
  };

  // Color controls - apply to textarea
  const handleColorChange = (color: string, type: 'text' | 'background') => {
    const activeElement = document.activeElement as HTMLTextAreaElement;
    if (activeElement && activeElement.tagName === 'TEXTAREA') {
      if (type === 'text') {
        activeElement.style.color = color;
      } else {
        activeElement.style.backgroundColor = color;
      }
    }
  };

  // Table insertion
  const handleInsertTable = (rows: number, cols: number, hasHeader: boolean) => {
    let tableMarkdown = '';
    
    // Create header row if requested
    if (hasHeader) {
      const headerCells = Array(cols).fill('Header').map((text, i) => `${text} ${i + 1}`);
      tableMarkdown += '| ' + headerCells.join(' | ') + ' |\n';
      tableMarkdown += '| ' + Array(cols).fill('---').join(' | ') + ' |\n';
      rows--; // Reduce rows since header counts as one
    }
    
    // Create data rows
    for (let r = 0; r < rows; r++) {
      const rowCells = Array(cols).fill('Cell');
      tableMarkdown += '| ' + rowCells.join(' | ') + ' |\n';
    }
    
    insertText(tableMarkdown);
  };

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
          title="Heading 1"
        >
          <Heading1 className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleHeading(2)}
          className="text-slate-300 hover:text-white hover:bg-white/10 p-1.5 md:p-2"
          title="Heading 2"
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
          title="Insert Link"
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

        {/* Table insertion */}
        <TableInsertDialog onInsertTable={handleInsertTable} />
      </div>

      {/* Alignment buttons - Note: These don't work with textarea, so we'll hide them */}
      <div className="hidden xl:flex items-center gap-1">
        <Separator orientation="vertical" className="h-6 bg-white/10" />

        <Button
          variant="ghost"
          size="sm"
          onClick={() => {}} // Disabled for textarea
          className="text-slate-300 hover:text-white hover:bg-white/10 p-1.5 md:p-2 opacity-50 cursor-not-allowed"
          title="Text alignment not available in plain text mode"
        >
          <AlignLeft className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => {}} // Disabled for textarea
          className="text-slate-300 hover:text-white hover:bg-white/10 p-1.5 md:p-2 opacity-50 cursor-not-allowed"
          title="Text alignment not available in plain text mode"
        >
          <AlignCenter className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => {}} // Disabled for textarea
          className="text-slate-300 hover:text-white hover:bg-white/10 p-1.5 md:p-2 opacity-50 cursor-not-allowed"
          title="Text alignment not available in plain text mode"
        >
          <AlignRight className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="h-6 bg-white/10" />

        <Button
          variant="ghost"
          size="sm"
          onClick={() => {}} // Disabled for textarea
          className="text-slate-300 hover:text-white hover:bg-white/10 p-1.5 md:p-2 opacity-50 cursor-not-allowed"
          title="Undo not available in plain text mode"
        >
          <Undo className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => {}} // Disabled for textarea
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
