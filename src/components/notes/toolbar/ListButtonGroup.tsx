
import React from 'react';
import { Button } from "@/components/ui/button";
import { List, ListOrdered } from "lucide-react";

interface ListButtonGroupProps {
  execCommand: (command: string) => void;
}

const ListButtonGroup: React.FC<ListButtonGroupProps> = ({ execCommand }) => {
  const listButtons = [
    { icon: List, command: 'insertUnorderedList', title: 'Bullet List' },
    { icon: ListOrdered, command: 'insertOrderedList', title: 'Numbered List' },
  ];

  return (
    <div className="flex items-center bg-gray-800/30 rounded-lg p-1 border border-gray-700/30">
      {listButtons.map((button, index) => {
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

export default ListButtonGroup;
