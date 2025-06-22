
import React from 'react';
import { Button } from "@/components/ui/button";
import { Bold, Italic, Underline, Strikethrough, Code } from "lucide-react";
import { cn } from "@/lib/utils";

interface FormatButtonGroupProps {
  execCommand: (command: string, value?: string) => void;
}

const FormatButtonGroup: React.FC<FormatButtonGroupProps> = ({ execCommand }) => {
  const formatButtons = [
    { icon: Bold, command: 'bold', title: 'Bold (Ctrl+B)' },
    { icon: Italic, command: 'italic', title: 'Italic (Ctrl+I)' },
    { icon: Underline, command: 'underline', title: 'Underline (Ctrl+U)' },
    { icon: Strikethrough, command: 'strikeThrough', title: 'Strikethrough' },
  ];

  return (
    <div className="flex items-center bg-gray-800/30 rounded-lg p-1 border border-gray-700/30">
      {formatButtons.map((button, index) => {
        const Icon = button.icon;
        return (
          <Button
            key={index}
            variant="ghost"
            size="sm"
            onClick={() => execCommand(button.command)}
            className="h-8 w-8 p-0 text-gray-300 hover:text-white hover:bg-gray-600/50 transition-all duration-150 rounded-md mx-0.5"
            title={button.title}
          >
            <Icon className="h-4 w-4" />
          </Button>
        );
      })}
      
      <div className="w-px h-6 bg-gray-600/50 mx-1" />
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => execCommand('formatBlock', 'code')}
        className="h-8 w-8 p-0 text-gray-300 hover:text-white hover:bg-gray-600/50 transition-all duration-150 rounded-md"
        title="Code"
      >
        <Code className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default FormatButtonGroup;
