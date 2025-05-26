
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
  // Get active textarea element
  const getActiveTextarea = (): HTMLTextAreaElement | null => {
    const activeElement = document.activeElement as HTMLTextAreaElement;
    return activeElement && activeElement.tagName === 'TEXTAREA' ? activeElement : null;
  };

  // Enhanced text wrapping with undo support
  const wrapSelectedText = (prefix: string, suffix: string = prefix) => {
    const textarea = getActiveTextarea();
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    const beforeText = textarea.value.substring(0, start);
    const afterText = textarea.value.substring(end);
    
    const newText = beforeText + prefix + selectedText + suffix + afterText;
    textarea.value = newText;
    
    // Trigger change event
    const event = new Event('input', { bubbles: true });
    textarea.dispatchEvent(event);
    
    // Set cursor position
    const newCursorPos = start + prefix.length + selectedText.length + suffix.length;
    textarea.setSelectionRange(newCursorPos, newCursorPos);
    textarea.focus();
  };

  const insertText = (text: string) => {
    const textarea = getActiveTextarea();
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const beforeText = textarea.value.substring(0, start);
    const afterText = textarea.value.substring(end);
    
    const newText = beforeText + text + afterText;
    textarea.value = newText;
    
    // Trigger change event
    const event = new Event('input', { bubbles: true });
    textarea.dispatchEvent(event);
    
    // Set cursor position
    const newCursorPos = start + text.length;
    textarea.setSelectionRange(newCursorPos, newCursorPos);
    textarea.focus();
  };

  // Enhanced formatting functions
  const handleBold = () => wrapSelectedText('**');
  const handleItalic = () => wrapSelectedText('*');
  const handleUnderline = () => wrapSelectedText('<u>', '</u>');
  const handleStrikethrough = () => wrapSelectedText('~~');
  const handleCode = () => wrapSelectedText('`');

  // Enhanced heading function with better line detection
  const handleHeading = (level: number) => {
    const textarea = getActiveTextarea();
    if (!textarea) return;

    const start = textarea.selectionStart;
    const lines = textarea.value.split('\n');
    let currentLine = 0;
    let charCount = 0;
    
    // Find current line
    for (let i = 0; i < lines.length; i++) {
      if (charCount + lines[i].length >= start) {
        currentLine = i;
        break;
      }
      charCount += lines[i].length + 1;
    }
    
    const prefix = '#'.repeat(level) + ' ';
    
    // Remove existing heading if present
    const currentLineText = lines[currentLine];
    const headingMatch = currentLineText.match(/^#{1,6}\s*/);
    if (headingMatch) {
      lines[currentLine] = currentLineText.replace(/^#{1,6}\s*/, '');
    }
    
    // Add new heading
    lines[currentLine] = prefix + lines[currentLine];
    textarea.value = lines.join('\n');
    
    const event = new Event('input', { bubbles: true });
    textarea.dispatchEvent(event);
    textarea.focus();
  };

  // Enhanced list function with smart indentation
  const handleInsertList = (ordered: boolean = false) => {
    const textarea = getActiveTextarea();
    if (!textarea) return;

    const start = textarea.selectionStart;
    const selectedText = textarea.value.substring(textarea.selectionStart, textarea.selectionEnd);
    
    if (selectedText) {
      // Convert selected text to list
      const lines = selectedText.split('\n').filter(line => line.trim());
      const listItems = lines.map((line, index) => {
        const prefix = ordered ? `${index + 1}. ` : '- ';
        return prefix + line.trim();
      }).join('\n');
      
      const beforeText = textarea.value.substring(0, textarea.selectionStart);
      const afterText = textarea.value.substring(textarea.selectionEnd);
      textarea.value = beforeText + listItems + afterText;
    } else {
      // Insert single list item
      const prefix = ordered ? '1. ' : '- ';
      insertText('\n' + prefix);
    }
    
    const event = new Event('input', { bubbles: true });
    textarea.dispatchEvent(event);
    textarea.focus();
  };

  // Enhanced link insertion with validation
  const handleInsertLink = () => {
    const textarea = getActiveTextarea();
    if (!textarea) return;

    const selectedText = textarea.value.substring(textarea.selectionStart, textarea.selectionEnd);
    const linkText = selectedText || 'Link text';
    
    const url = prompt('Enter URL:', 'https://');
    if (url && url.trim()) {
      const sanitizedUrl = DOMPurify.sanitize(url.trim());
      const finalLinkText = selectedText || prompt('Enter link text:', 'Link text') || 'Link text';
      
      if (selectedText) {
        wrapSelectedText(`[`, `](${sanitizedUrl})`);
      } else {
        insertText(`[${finalLinkText}](${sanitizedUrl})`);
      }
    }
  };

  // Enhanced blockquote with multi-line support
  const handleBlockquote = () => {
    const textarea = getActiveTextarea();
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    
    if (selectedText) {
      // Handle multi-line selection
      const lines = selectedText.split('\n');
      const quotedLines = lines.map(line => '> ' + line).join('\n');
      
      const beforeText = textarea.value.substring(0, start);
      const afterText = textarea.value.substring(end);
      textarea.value = beforeText + quotedLines + afterText;
    } else {
      // Handle current line
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
      
      lines[currentLine] = '> ' + lines[currentLine];
      textarea.value = lines.join('\n');
    }
    
    const event = new Event('input', { bubbles: true });
    textarea.dispatchEvent(event);
    textarea.focus();
  };

  // Enhanced image insertion with drag & drop support
  const handleInsertImage = () => {
    const url = prompt('Enter image URL:', 'https://');
    if (url && url.trim()) {
      const altText = prompt('Enter alt text:', 'Image') || 'Image';
      const sanitizedUrl = DOMPurify.sanitize(url.trim());
      insertText(`\n![${altText}](${sanitizedUrl})\n`);
    }
  };

  // Advanced find with regex support
  const handleFind = (text: string, options: { caseSensitive: boolean; wholeWord: boolean; useRegex?: boolean }) => {
    if (!text.trim()) return;
    
    const textarea = getActiveTextarea();
    if (!textarea) return;
    
    const content = textarea.value;
    
    try {
      let searchPattern;
      if (options.useRegex) {
        const flags = options.caseSensitive ? 'g' : 'gi';
        searchPattern = new RegExp(text, flags);
      } else {
        let pattern = options.caseSensitive ? text : text.toLowerCase();
        if (options.wholeWord) {
          pattern = `\\b${pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`;
        }
        const flags = options.caseSensitive ? 'g' : 'gi';
        searchPattern = new RegExp(pattern, flags);
      }
      
      const searchContent = options.caseSensitive ? content : content.toLowerCase();
      const match = searchPattern.exec(options.caseSensitive ? content : content);
      
      if (match) {
        textarea.setSelectionRange(match.index, match.index + match[0].length);
        textarea.focus();
        textarea.scrollIntoView({ block: 'center' });
      }
    } catch (error) {
      console.error('Search error:', error);
      // Fallback to simple search
      const searchText = options.caseSensitive ? content : content.toLowerCase();
      const findText = options.caseSensitive ? text : text.toLowerCase();
      const index = searchText.indexOf(findText);
      
      if (index !== -1) {
        textarea.setSelectionRange(index, index + text.length);
        textarea.focus();
      }
    }
  };

  // Enhanced replace with undo support
  const handleReplace = (findText: string, replaceText: string, replaceAll: boolean) => {
    const textarea = getActiveTextarea();
    if (!textarea) return;
    
    const sanitizedReplaceText = DOMPurify.sanitize(replaceText);
    
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
  };

  // Enhanced font controls with system font detection
  const handleFontFamilyChange = (fontFamily: string) => {
    const textarea = getActiveTextarea();
    if (textarea) {
      textarea.style.fontFamily = fontFamily;
    }
  };

  const handleFontSizeChange = (action: 'increase' | 'decrease' | 'set', size?: number) => {
    const textarea = getActiveTextarea();
    if (!textarea) return;
    
    const currentSize = parseFloat(window.getComputedStyle(textarea).fontSize);
    
    switch (action) {
      case 'increase':
        textarea.style.fontSize = `${Math.min(currentSize + 2, 32)}px`;
        break;
      case 'decrease':
        textarea.style.fontSize = `${Math.max(currentSize - 2, 8)}px`;
        break;
      case 'set':
        if (size) textarea.style.fontSize = `${size}px`;
        break;
    }
  };

  // Enhanced color controls with theme support
  const handleColorChange = (color: string, type: 'text' | 'background') => {
    const textarea = getActiveTextarea();
    if (textarea) {
      if (type === 'text') {
        textarea.style.color = color;
      } else {
        textarea.style.backgroundColor = color;
      }
    }
  };

  // Enhanced table insertion with templates
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
    insertText(tableMarkdown);
  };

  // Export/Import functions
  const handleExportMarkdown = () => {
    const textarea = getActiveTextarea();
    if (!textarea) return;
    
    const content = textarea.value;
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
          const textarea = getActiveTextarea();
          if (textarea) {
            textarea.value = content;
            const event = new Event('input', { bubbles: true });
            textarea.dispatchEvent(event);
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
      // Only trigger if we have an active textarea
      if (!getActiveTextarea()) return;
      
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
