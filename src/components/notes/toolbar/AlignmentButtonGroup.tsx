
import React from 'react';
import { Button } from "@/components/ui/button";
import { AlignLeft, AlignCenter, AlignRight } from "lucide-react";

interface AlignmentButtonGroupProps {
  execCommand: (command: string) => void;
}

const AlignmentButtonGroup: React.FC<AlignmentButtonGroupProps> = ({ execCommand }) => {
  const alignButtons = [
    { icon: AlignLeft, command: 'justifyLeft', title: 'Align Left' },
    { icon: AlignCenter, command: 'justifyCenter', title: 'Align Center' },
    { icon: AlignRight, command: 'justifyRight', title: 'Align Right' },
  ];

  return (
    <div className="flex items-center bg-gray-800/30 rounded-lg p-1 border border-gray-700/30">
      {alignButtons.map((button, index) => {
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
    </div>
  );
};

export default AlignmentButtonGroup;
