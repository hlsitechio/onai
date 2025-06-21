
import React from 'react';
import { useEditorRef } from '@udecode/plate/react';
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
  
  // Simple toolbar actions using editor methods
  const toggleBold = () => {
    if (editor.marks?.bold) {
      editor.removeMark('bold');
    } else {
      editor.addMark('bold', true);
    }
  };

  const toggleItalic = () => {
    if (editor.marks?.italic) {
      editor.removeMark('italic');
    } else {
      editor.addMark('italic', true);
    }
  };

  const toggleUnderline = () => {
    if (editor.marks?.underline) {
      editor.removeMark('underline');
    } else {
      editor.addMark('underline', true);
    }
  };

  const insertHeading = (type: string) => {
    editor.insertNode({ type, children: [{ text: '' }] });
  };

  const insertList = (type: string) => {
    editor.insertNode({ 
      type, 
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
          onMouseDown={(e) => {
            e.preventDefault();
            toggleBold();
          }}
          className={`h-8 w-8 p-0 ${editor.marks?.bold ? 'bg-white/20 text-white' : 'text-gray-300 hover:text-white hover:bg-white/10'}`}
          title="Bold (Ctrl+B)"
        >
          <Bold className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onMouseDown={(e) => {
            e.preventDefault();
            toggleItalic();
          }}
          className={`h-8 w-8 p-0 ${editor.marks?.italic ? 'bg-white/20 text-white' : 'text-gray-300 hover:text-white hover:bg-white/10'}`}
          title="Italic (Ctrl+I)"
        >
          <Italic className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onMouseDown={(e) => {
            e.preventDefault();
            toggleUnderline();
          }}
          className={`h-8 w-8 p-0 ${editor.marks?.underline ? 'bg-white/20 text-white' : 'text-gray-300 hover:text-white hover:bg-white/10'}`}
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
          onMouseDown={(e) => {
            e.preventDefault();
            insertHeading(ELEMENT_H1);
          }}
          className="h-8 w-8 p-0 text-gray-300 hover:text-white hover:bg-white/10"
          title="Heading 1"
        >
          <Heading1 className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onMouseDown={(e) => {
            e.preventDefault();
            insertHeading(ELEMENT_H2);
          }}
          className="h-8 w-8 p-0 text-gray-300 hover:text-white hover:bg-white/10"
          title="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onMouseDown={(e) => {
            e.preventDefault();
            insertHeading(ELEMENT_H3);
          }}
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
          onMouseDown={(e) => {
            e.preventDefault();
            insertList(ELEMENT_UL);
          }}
          className="h-8 w-8 p-0 text-gray-300 hover:text-white hover:bg-white/10"
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onMouseDown={(e) => {
            e.preventDefault();
            insertList(ELEMENT_OL);
          }}
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
