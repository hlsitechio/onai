
import React from 'react';
import { Bold, Italic, Underline, Strikethrough, Code, Superscript, Subscript } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FormatControlsProps {
  editor?: any;
}

const FormatControls: React.FC<FormatControlsProps> = ({ editor }) => {
  const execCommand = (command: string, value?: string) => {
    console.log('Executing command:', command, value);
    
    // Use document.execCommand for contentEditable
    try {
      document.execCommand(command, false, value);
    } catch (error) {
      console.log('Command execution failed:', command, error);
    }
  };

  const formatButtons = [
    {
      icon: Bold,
      onClick: () => execCommand('bold'),
      title: 'Bold (Ctrl+B)',
      shortcut: 'Ctrl+B'
    },
    {
      icon: Italic,
      onClick: () => execCommand('italic'),
      title: 'Italic (Ctrl+I)',
      shortcut: 'Ctrl+I'
    },
    {
      icon: Underline,
      onClick: () => execCommand('underline'),
      title: 'Underline (Ctrl+U)',
      shortcut: 'Ctrl+U'
    },
    {
      icon: Strikethrough,
      onClick: () => execCommand('strikeThrough'),
      title: 'Strikethrough',
      shortcut: null
    },
    {
      icon: Code,
      onClick: () => execCommand('formatBlock', 'code'),
      title: 'Inline Code',
      shortcut: null
    },
    {
      icon: Superscript,
      onClick: () => execCommand('superscript'),
      title: 'Superscript',
      shortcut: null,
      className: 'hidden sm:flex'
    },
    {
      icon: Subscript,
      onClick: () => execCommand('subscript'),
      title: 'Subscript',
      shortcut: null,
      className: 'hidden sm:flex'
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
              "h-8 w-8 p-0 hover:bg-white/10 transition-colors text-gray-300 hover:text-white",
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
