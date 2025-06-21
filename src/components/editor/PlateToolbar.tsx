
import React from 'react';
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

const PlateToolbar: React.FC = () => {
  // Simple toolbar with basic formatting options
  // We'll implement the actual editor commands once we have a working base
  
  const handleBold = () => {
    document.execCommand('bold', false, undefined);
  };

  const handleItalic = () => {
    document.execCommand('italic', false, undefined);
  };

  const handleUnderline = () => {
    document.execCommand('underline', false, undefined);
  };

  const handleHeading = (level: number) => {
    document.execCommand('formatBlock', false, `h${level}`);
  };

  const handleBulletList = () => {
    document.execCommand('insertUnorderedList', false, undefined);
  };

  const handleNumberedList = () => {
    document.execCommand('insertOrderedList', false, undefined);
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
            handleBold();
          }}
          className="h-8 w-8 p-0 text-gray-300 hover:text-white hover:bg-white/10"
          title="Bold (Ctrl+B)"
        >
          <Bold className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onMouseDown={(e) => {
            e.preventDefault();
            handleItalic();
          }}
          className="h-8 w-8 p-0 text-gray-300 hover:text-white hover:bg-white/10"
          title="Italic (Ctrl+I)"
        >
          <Italic className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onMouseDown={(e) => {
            e.preventDefault();
            handleUnderline();
          }}
          className="h-8 w-8 p-0 text-gray-300 hover:text-white hover:bg-white/10"
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
            handleHeading(1);
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
            handleHeading(2);
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
            handleHeading(3);
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
            handleBulletList();
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
            handleNumberedList();
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
