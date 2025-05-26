
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
  const handleHeading = (level: number) => {
    execCommand('formatBlock', `h${level}`);
  };

  const handleInsertList = (ordered: boolean = false) => {
    execCommand(ordered ? 'insertOrderedList' : 'insertUnorderedList');
  };

  const handleInsertLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      execCommand('createLink', url);
    }
  };

  const handleBlockquote = () => {
    execCommand('formatBlock', 'blockquote');
  };

  const handleCode = () => {
    execCommand('formatBlock', 'pre');
  };

  const handleInsertImage = () => {
    const url = prompt('Enter image URL:');
    if (url) {
      execCommand('insertImage', url);
    }
  };

  // Find & Replace functionality
  const handleFind = (text: string, options: { caseSensitive: boolean; wholeWord: boolean }) => {
    // Simple find implementation using browser's built-in find
    if (window.find) {
      window.find(text, options.caseSensitive, false, true, options.wholeWord, true, false);
    }
  };

  const handleReplace = (findText: string, replaceText: string, replaceAll: boolean) => {
    // Simple replace implementation
    const selection = window.getSelection();
    if (selection && selection.toString() === findText) {
      execCommand('insertText', replaceText);
    }
    
    if (replaceAll) {
      // For replace all, we'd need a more sophisticated implementation
      console.log('Replace all functionality would be implemented here');
    }
  };

  // Font controls
  const handleFontFamilyChange = (fontFamily: string) => {
    execCommand('fontName', fontFamily);
  };

  const handleFontSizeChange = (action: 'increase' | 'decrease' | 'set', size?: number) => {
    if (action === 'increase') {
      execCommand('increaseFontSize', null);
    } else if (action === 'decrease') {
      execCommand('decreaseFontSize', null);
    } else if (action === 'set' && size) {
      execCommand('fontSize', size.toString());
    }
  };

  // Color controls
  const handleColorChange = (color: string, type: 'text' | 'background') => {
    if (type === 'text') {
      execCommand('foreColor', color);
    } else {
      execCommand('backColor', color);
    }
  };

  // Table insertion
  const handleInsertTable = (rows: number, cols: number, hasHeader: boolean) => {
    let tableHTML = '<table border="1" style="border-collapse: collapse; width: 100%;">';
    
    for (let r = 0; r < rows; r++) {
      tableHTML += '<tr>';
      for (let c = 0; c < cols; c++) {
        const tag = hasHeader && r === 0 ? 'th' : 'td';
        tableHTML += `<${tag} style="border: 1px solid #ccc; padding: 8px;">${hasHeader && r === 0 ? `Header ${c + 1}` : ''}</${tag}>`;
      }
      tableHTML += '</tr>';
    }
    tableHTML += '</table>';
    
    execCommand('insertHTML', tableHTML);
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
          onClick={() => execCommand('bold', null)}
          className="text-slate-300 hover:text-white hover:bg-white/10 p-1.5 md:p-2"
          title="Bold (Ctrl+B)"
        >
          <Bold className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => execCommand('italic', null)}
          className="text-slate-300 hover:text-white hover:bg-white/10 p-1.5 md:p-2"
          title="Italic (Ctrl+I)"
        >
          <Italic className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => execCommand('underline', null)}
          className="text-slate-300 hover:text-white hover:bg-white/10 p-1.5 md:p-2"
          title="Underline (Ctrl+U)"
        >
          <Underline className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => execCommand('strikeThrough', null)}
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

      {/* Alignment buttons - hidden on mobile and small tablets */}
      <div className="hidden xl:flex items-center gap-1">
        <Separator orientation="vertical" className="h-6 bg-white/10" />

        <Button
          variant="ghost"
          size="sm"
          onClick={() => execCommand('justifyLeft', null)}
          className="text-slate-300 hover:text-white hover:bg-white/10 p-1.5 md:p-2"
          title="Align Left"
        >
          <AlignLeft className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => execCommand('justifyCenter', null)}
          className="text-slate-300 hover:text-white hover:bg-white/10 p-1.5 md:p-2"
          title="Align Center"
        >
          <AlignCenter className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => execCommand('justifyRight', null)}
          className="text-slate-300 hover:text-white hover:bg-white/10 p-1.5 md:p-2"
          title="Align Right"
        >
          <AlignRight className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="h-6 bg-white/10" />

        <Button
          variant="ghost"
          size="sm"
          onClick={() => execCommand('undo', null)}
          className="text-slate-300 hover:text-white hover:bg-white/10 p-1.5 md:p-2"
          title="Undo (Ctrl+Z)"
        >
          <Undo className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => execCommand('redo', null)}
          className="text-slate-300 hover:text-white hover:bg-white/10 p-1.5 md:p-2"
          title="Redo (Ctrl+Y)"
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ToolbarActions;
