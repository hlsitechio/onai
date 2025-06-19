
import React from 'react';
import { List, ListOrdered } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Editor } from '@tiptap/react';

interface ListControlsProps {
  editor: Editor;
}

const ListControls: React.FC<ListControlsProps> = ({ editor }) => {
  const listButtons = [
    {
      icon: List,
      isActive: () => editor?.isActive('bulletList') || false,
      onClick: () => {
        if (editor) {
          editor.chain().focus().toggleBulletList().run();
        }
      },
      title: 'Bullet List'
    },
    {
      icon: ListOrdered,
      isActive: () => editor?.isActive('orderedList') || false,
      onClick: () => {
        if (editor) {
          editor.chain().focus().toggleOrderedList().run();
        }
      },
      title: 'Numbered List'
    }
  ];

  return (
    <div className="flex items-center gap-1">
      {listButtons.map((button, index) => {
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

export default ListControls;
