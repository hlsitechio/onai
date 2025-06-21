
import React from 'react';
import { useEditorRef } from '@udecode/plate-common';
import { Button } from '@/components/ui/button';
import { 
  Bold, 
  Italic, 
  Underline, 
  Heading1, 
  Heading2, 
  Heading3,
  List,
  ListOrdered
} from 'lucide-react';

// Define constants for element and mark types
const MARK_BOLD = 'bold';
const MARK_ITALIC = 'italic';
const MARK_UNDERLINE = 'underline';
const ELEMENT_H1 = 'h1';
const ELEMENT_H2 = 'h2';
const ELEMENT_H3 = 'h3';
const ELEMENT_UL = 'ul';
const ELEMENT_OL = 'ol';
const ELEMENT_LI = 'li';

const PlateToolbar: React.FC = () => {
  const editor = useEditorRef();
  
  if (!editor) return null;
  
  // Simple mark and node manipulation functions
  const toggleMark = (editor: any, mark: string) => {
    const isActive = editor.marks?.[mark];
    if (isActive) {
      editor.removeMark(mark);
    } else {
      editor.addMark(mark, true);
    }
  };

  const isMarkActive = (editor: any, mark: string) => {
    return !!editor.marks?.[mark];
  };

  const insertNodes = (editor: any, node: any) => {
    const { selection } = editor;
    if (selection) {
      editor.insertNode(node);
    }
  };
  
  // Check if marks are active
  const isBoldActive = isMarkActive(editor, MARK_BOLD);
  const isItalicActive = isMarkActive(editor, MARK_ITALIC);
  const isUnderlineActive = isMarkActive(editor, MARK_UNDERLINE);

  const handleToggleBold = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleMark(editor, MARK_BOLD);
  };
  
  const handleToggleItalic = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleMark(editor, MARK_ITALIC);
  };
  
  const handleToggleUnderline = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleMark(editor, MARK_UNDERLINE);
  };

  const insertHeading = (level: 1 | 2 | 3) => (e: React.MouseEvent) => {
    e.preventDefault();
    const elementType = level === 1 ? ELEMENT_H1 : level === 2 ? ELEMENT_H2 : ELEMENT_H3;
    insertNodes(editor, { type: elementType, children: [{ text: '' }] });
  };

  const insertList = (ordered: boolean) => (e: React.MouseEvent) => {
    e.preventDefault();
    const elementType = ordered ? ELEMENT_OL : ELEMENT_UL;
    insertNodes(editor, { 
      type: elementType, 
      children: [{ type: ELEMENT_LI, children: [{ text: '' }] }] 
    });
  };

  return (
    <div className="flex items-center gap-2 p-2">
      {/* Basic Formatting */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onMouseDown={handleToggleBold}
          className={`h-8 w-8 p-0 ${isBoldActive ? 'bg-white/20 text-white' : 'text-gray-300 hover:text-white hover:bg-white/10'}`}
          title="Bold (Ctrl+B)"
        >
          <Bold className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onMouseDown={handleToggleItalic}
          className={`h-8 w-8 p-0 ${isItalicActive ? 'bg-white/20 text-white' : 'text-gray-300 hover:text-white hover:bg-white/10'}`}
          title="Italic (Ctrl+I)"
        >
          <Italic className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onMouseDown={handleToggleUnderline}
          className={`h-8 w-8 p-0 ${isUnderlineActive ? 'bg-white/20 text-white' : 'text-gray-300 hover:text-white hover:bg-white/10'}`}
          title="Underline (Ctrl+U)"
        >
          <Underline className="h-4 w-4" />
        </Button>
      </div>

      <div className="w-px h-6 bg-white/10" />

      {/* Headings */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onMouseDown={insertHeading(1)}
          className="h-8 w-8 p-0 text-gray-300 hover:text-white hover:bg-white/10"
          title="Heading 1"
        >
          <Heading1 className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onMouseDown={insertHeading(2)}
          className="h-8 w-8 p-0 text-gray-300 hover:text-white hover:bg-white/10"
          title="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onMouseDown={insertHeading(3)}
          className="h-8 w-8 p-0 text-gray-300 hover:text-white hover:bg-white/10"
          title="Heading 3"
        >
          <Heading3 className="h-4 w-4" />
        </Button>
      </div>

      <div className="w-px h-6 bg-white/10" />

      {/* Lists */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onMouseDown={insertList(false)}
          className="h-8 w-8 p-0 text-gray-300 hover:text-white hover:bg-white/10"
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onMouseDown={insertList(true)}
          className="h-8 w-8 p-0 text-gray-300 hover:text-white hover:bg-white/10"
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default PlateToolbar;
