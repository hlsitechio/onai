
import React from 'react';
import type { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { Bold, Italic, Underline, Code } from 'lucide-react';

interface FormatButtonsProps {
  editor: Editor;
}

const FormatButtons: React.FC<FormatButtonsProps> = ({ editor }) => {
  return (
    <div className="flex items-center gap-1">
      <Button
        onClick={() => {
          try {
            editor.chain().focus().toggleBold().run();
          } catch (error) {
            console.warn('Bold toggle failed:', error);
          }
        }}
        variant="ghost"
        size="sm"
        className={`h-7 w-7 p-0 ${editor.isActive('bold') ? 'bg-white/20' : 'hover:bg-white/10'} text-white`}
      >
        <Bold className="h-3 w-3" />
      </Button>
      <Button
        onClick={() => {
          try {
            editor.chain().focus().toggleItalic().run();
          } catch (error) {
            console.warn('Italic toggle failed:', error);
          }
        }}
        variant="ghost"
        size="sm"
        className={`h-7 w-7 p-0 ${editor.isActive('italic') ? 'bg-white/20' : 'hover:bg-white/10'} text-white`}
      >
        <Italic className="h-3 w-3" />
      </Button>
      <Button
        onClick={() => {
          try {
            editor.chain().focus().toggleUnderline().run();
          } catch (error) {
            console.warn('Underline toggle failed:', error);
          }
        }}
        variant="ghost"
        size="sm"
        className={`h-7 w-7 p-0 ${editor.isActive('underline') ? 'bg-white/20' : 'hover:bg-white/10'} text-white`}
      >
        <Underline className="h-3 w-3" />
      </Button>
      <Button
        onClick={() => {
          try {
            editor.chain().focus().toggleCode().run();
          } catch (error) {
            console.warn('Code toggle failed:', error);
          }
        }}
        variant="ghost"
        size="sm"
        className={`h-7 w-7 p-0 ${editor.isActive('code') ? 'bg-white/20' : 'hover:bg-white/10'} text-white`}
      >
        <Code className="h-3 w-3" />
      </Button>
    </div>
  );
};

export default FormatButtons;
