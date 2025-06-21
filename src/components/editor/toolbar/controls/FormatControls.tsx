
import React from 'react';
import { Bold, Italic, Underline, Strikethrough, Code, Superscript, Subscript } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Editor } from '@tiptap/react';

interface FormatControlsProps {
  editor?: Editor;
}

const FormatControls: React.FC<FormatControlsProps> = ({ editor }) => {
  const formatButtons = [
    {
      icon: Bold,
      isActive: () => editor?.isActive && editor.isActive('bold') || false,
      onClick: () => {
        try {
          if (editor?.chain && typeof editor.chain === 'function') {
            editor.chain().focus().toggleBold().run();
          } else {
            document.execCommand('bold', false);
          }
        } catch {
          document.execCommand('bold', false);
        }
      },
      title: 'Bold (Ctrl+B)',
      shortcut: 'Ctrl+B'
    },
    {
      icon: Italic,
      isActive: () => editor?.isActive && editor.isActive('italic') || false,
      onClick: () => {
        try {
          if (editor?.chain && typeof editor.chain === 'function') {
            editor.chain().focus().toggleItalic().run();
          } else {
            document.execCommand('italic', false);
          }
        } catch {
          document.execCommand('italic', false);
        }
      },
      title: 'Italic (Ctrl+I)',
      shortcut: 'Ctrl+I'
    },
    {
      icon: Underline,
      isActive: () => editor?.isActive && editor.isActive('underline') || false,
      onClick: () => {
        try {
          if (editor?.chain && typeof editor.chain === 'function') {
            editor.chain().focus().toggleUnderline().run();
          } else {
            document.execCommand('underline', false);
          }
        } catch {
          document.execCommand('underline', false);
        }
      },
      title: 'Underline (Ctrl+U)',
      shortcut: 'Ctrl+U'
    },
    {
      icon: Strikethrough,
      isActive: () => editor?.isActive && editor.isActive('strike') || false,
      onClick: () => {
        try {
          if (editor?.chain && typeof editor.chain === 'function' && editor.can && editor.can().toggleStrike()) {
            editor.chain().focus().toggleStrike().run();
          } else {
            document.execCommand('strikeThrough', false);
          }
        } catch {
          document.execCommand('strikeThrough', false);
        }
      },
      title: 'Strikethrough',
      shortcut: null
    },
    {
      icon: Code,
      isActive: () => editor?.isActive && editor.isActive('code') || false,
      onClick: () => {
        try {
          if (editor?.chain && typeof editor.chain === 'function') {
            editor.chain().focus().toggleCode().run();
          } else {
            document.execCommand('formatBlock', false, 'code');
          }
        } catch {
          document.execCommand('formatBlock', false, 'code');
        }
      },
      title: 'Inline Code',
      shortcut: null
    },
    {
      icon: Superscript,
      isActive: () => editor?.isActive && editor.isActive('superscript') || false,
      onClick: () => {
        try {
          if (editor?.chain && typeof editor.chain === 'function') {
            editor.chain().focus().toggleSuperscript().run();
          } else {
            document.execCommand('superscript', false);
          }
        } catch {
          document.execCommand('superscript', false);
        }
      },
      title: 'Superscript',
      shortcut: null,
      className: 'hidden sm:flex'
    },
    {
      icon: Subscript,
      isActive: () => editor?.isActive && editor.isActive('subscript') || false,
      onClick: () => {
        try {
          if (editor?.chain && typeof editor.chain === 'function') {
            editor.chain().focus().toggleSubscript().run();
          } else {
            document.execCommand('subscript', false);
          }
        } catch {
          document.execCommand('subscript', false);
        }
      },
      title: 'Subscript',
      shortcut: null,
      className: 'hidden sm:flex'
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
                : "text-gray-300 hover:text-white",
              button.className
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
