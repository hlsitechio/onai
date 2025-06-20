
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
      isActive: () => {
        if (!editor) return false;
        return editor.isActive('bold');
      },
      onClick: () => {
        if (editor) {
          editor.chain().focus().toggleBold().run();
        }
      },
      title: 'Bold (Ctrl+B)',
      shortcut: 'Ctrl+B'
    },
    {
      icon: Italic,
      isActive: () => {
        if (!editor) return false;
        return editor.isActive('italic');
      },
      onClick: () => {
        if (editor) {
          editor.chain().focus().toggleItalic().run();
        }
      },
      title: 'Italic (Ctrl+I)',
      shortcut: 'Ctrl+I'
    },
    {
      icon: Underline,
      isActive: () => {
        if (!editor) return false;
        return editor.isActive('underline');
      },
      onClick: () => {
        if (editor) {
          editor.chain().focus().toggleUnderline().run();
        }
      },
      title: 'Underline (Ctrl+U)',
      shortcut: 'Ctrl+U'
    },
    {
      icon: Strikethrough,
      isActive: () => {
        if (!editor) return false;
        return editor.isActive('strike');
      },
      onClick: () => {
        if (editor) {
          editor.chain().focus().toggleStrike().run();
        }
      },
      title: 'Strikethrough',
      shortcut: null
    },
    {
      icon: Code,
      isActive: () => {
        if (!editor) return false;
        return editor.isActive('code');
      },
      onClick: () => {
        if (editor) {
          editor.chain().focus().toggleCode().run();
        }
      },
      title: 'Inline Code',
      shortcut: null
    }
  ];

  return (
    <div className="flex items-center gap-1">
      {formatButtons.map((button, index) => {
        const Icon = button.icon;
        const isActive = button.isActive();
        return (
          <Button
            key={index}
            variant="ghost"
            size="sm"
            onClick={button.onClick}
            className={cn(
              "h-8 w-8 p-0 hover:bg-white/10 transition-colors",
              isActive 
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
