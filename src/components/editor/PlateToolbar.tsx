
import React from 'react';
import { useEditorRef } from '@udecode/plate-common/react';
import { 
  toggleMark, 
  insertNodes,
  isMarkActive 
} from '@udecode/plate-common';
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
  
  // Check if marks are active
  const isBoldActive = editor ? isMarkActive(editor, MARK_BOLD) : false;
  const isItalicActive = editor ? isMarkActive(editor, MARK_ITALIC) : false;
  const isUnderlineActive = editor ? isMarkActive(editor, MARK_UNDERLINE) : false;

  const toggleBold = () => {
    if (editor) toggleMark(editor, { key: MARK_BOLD });
  };
  
  const toggleItalic = () => {
    if (editor) toggleMark(editor, { key: MARK_ITALIC });
  };
  
  const toggleUnderline = () => {
    if (editor) toggleMark(editor, { key: MARK_UNDERLINE });
  };

  const insertHeading = (level: 1 | 2 | 3) => {
    if (!editor) return;
    const elementType = level === 1 ? ELEMENT_H1 : level === 2 ? ELEMENT_H2 : ELEMENT_H3;
    insertNodes(editor, { type: elementType, children: [{ text: '' }] });
  };

  const insertList = (ordered: boolean) => {
    if (!editor) return;
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
          onClick={toggleBold}
          className={`h-8 w-8 p-0 ${isBoldActive ? 'bg-white/20 text-white' : 'text-gray-300 hover:text-white hover:bg-white/10'}`}
          title="Bold (Ctrl+B)"
        >
          <Bold className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={toggleItalic}
          className={`h-8 w-8 p-0 ${isItalicActive ? 'bg-white/20 text-white' : 'text-gray-300 hover:text-white hover:bg-white/10'}`}
          title="Italic (Ctrl+I)"
        >
          <Italic className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={toggleUnderline}
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
          onClick={() => insertHeading(1)}
          className="h-8 w-8 p-0 text-gray-300 hover:text-white hover:bg-white/10"
          title="Heading 1"
        >
          <Heading1 className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => insertHeading(2)}
          className="h-8 w-8 p-0 text-gray-300 hover:text-white hover:bg-white/10"
          title="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => insertHeading(3)}
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
          onClick={() => insertList(false)}
          className="h-8 w-8 p-0 text-gray-300 hover:text-white hover:bg-white/10"
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => insertList(true)}
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
