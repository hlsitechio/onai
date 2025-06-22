
import React from 'react';
import { Button } from "@/components/ui/button";
import { Heading1, Heading2, Heading3, Type, ChevronDown } from "lucide-react";

interface HeadingButtonGroupProps {
  execCommand: (command: string, value?: string) => void;
}

const HeadingButtonGroup: React.FC<HeadingButtonGroupProps> = ({ execCommand }) => {
  const headingButtons = [
    { icon: Heading1, command: 'formatBlock', value: 'h1', title: 'Heading 1' },
    { icon: Heading2, command: 'formatBlock', value: 'h2', title: 'Heading 2' },
    { icon: Heading3, command: 'formatBlock', value: 'h3', title: 'Heading 3' },
  ];

  return (
    <div className="flex items-center bg-gray-800/30 rounded-lg p-1 border border-gray-700/30">
      {headingButtons.map((button, index) => {
        const Icon = button.icon;
        return (
          <Button
            key={index}
            variant="ghost"
            size="sm"
            onClick={() => execCommand(button.command, button.value)}
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
        className="h-8 px-3 text-gray-300 hover:text-white hover:bg-gray-600/50 transition-all duration-150 rounded-md flex items-center gap-1.5"
        title="More Headings"
      >
        <Type className="h-3.5 w-3.5" />
        <ChevronDown className="h-3 w-3" />
      </Button>
    </div>
  );
};

export default HeadingButtonGroup;
