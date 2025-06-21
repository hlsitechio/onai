
import React from 'react';
import { Bold, Italic, Underline, Save, List, Undo, Redo } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const SimpleToolbar: React.FC = () => {
  const handleCommand = (command: string) => {
    document.execCommand(command, false);
  };

  const toolbarButtons = [
    {
      icon: Bold,
      command: 'bold',
      title: 'Bold (Ctrl+B)',
    },
    {
      icon: Italic,
      command: 'italic', 
      title: 'Italic (Ctrl+I)',
    },
    {
      icon: Underline,
      command: 'underline',
      title: 'Underline (Ctrl+U)',
    },
    {
      icon: List,
      command: 'insertUnorderedList',
      title: 'Bullet List',
    },
    {
      icon: Undo,
      command: 'undo',
      title: 'Undo',
    },
    {
      icon: Redo,
      command: 'redo',
      title: 'Redo',
    },
  ];

  return (
    <div className="flex items-center gap-1 p-2 bg-black/20 border-b border-white/10">
      {toolbarButtons.map((button, index) => {
        const Icon = button.icon;
        return (
          <Button
            key={index}
            variant="ghost"
            size="sm"
            onClick={() => handleCommand(button.command)}
            className="h-8 w-8 p-0 hover:bg-white/10 transition-colors text-gray-300 hover:text-white"
            title={button.title}
          >
            <Icon className="h-4 w-4" />
          </Button>
        );
      })}
      
      <div className="w-px h-6 bg-white/10 mx-2" />
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {/* Save functionality */}}
        className="h-8 px-3 hover:bg-white/10 transition-colors text-gray-300 hover:text-white"
        title="Save"
      >
        <Save className="h-3 w-3 mr-1" />
        Save
      </Button>
    </div>
  );
};

export default SimpleToolbar;
