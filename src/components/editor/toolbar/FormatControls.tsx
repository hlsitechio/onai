
import React from 'react';
import { Bold, Italic, Underline, Strikethrough, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Editor } from '@tiptap/react';

interface FormatControlsProps {
  editor: Editor;
}

const FormatControls: React.FC<FormatControlsProps> = ({ editor }) => {
  const formatButtons = [
    {
      icon: Bold,
      isActive: () => editor.isActive('bold'),
      onClick: () => editor.chain().focus().toggleBold().run(),
      title: 'Bold (Ctrl+B)',
      shortcut: 'Ctrl+B'
    },
    {
      icon: Italic,
      isActive: () => editor.isActive('italic'),
      onClick: () => editor.chain().focus().toggleItalic().run(),
      title: 'Italic (Ctrl+I)',
      shortcut: 'Ctrl+I'
    },
    {
      icon: Underline,
      isActive: () => editor.isActive('underline'),
      onClick: () => editor.chain().focus().toggleUnderline().run(),
      title: 'Underline (Ctrl+U)',
      shortcut: 'Ctrl+U'
    },
    {
      icon: Strikethrough,
      isActive: () => editor.isActive('strike'),
      onClick: () => editor.chain().focus().toggleStrike().run(),
      title: 'Strikethrough',
      shortcut: null
    },
    {
      icon: Code,
      isActive: () => editor.isActive('code'),
      onClick: () => editor.chain().focus().toggleCode().run(),
      title: 'Inline Code',
      shortcut: null
    }
  ];

  return (
    <div className="flex items-center gap-1">
      {formatButtons.map((button, index) => {
        const Icon = button.icon;
        return (
          <Button
            key={index}
            variant="ghost"
            size="sm"
            onClick={button.onClick}
            className={cn(
              "h-8 w-8 p-0 hover:bg-white/10",
              button.isActive() 
                ? "bg-white/20 text-white" 
                : "text-gray-300 hover:text-white"
            )}
            title={button.title}
          >
            <Icon className="h-4 w-4" />
          </Button>
        );
      })}
    </div>
  );
};

export default FormatControls;
