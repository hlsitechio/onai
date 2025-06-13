
import React from 'react';
import { AlignLeft, AlignCenter, AlignRight, AlignJustify } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Editor } from '@tiptap/react';

interface AlignmentControlsProps {
  editor: Editor;
}

const AlignmentControls: React.FC<AlignmentControlsProps> = ({ editor }) => {
  const alignmentButtons = [
    {
      icon: AlignLeft,
      alignment: 'left',
      isActive: () => editor.isActive({ textAlign: 'left' }),
      onClick: () => editor.chain().focus().setTextAlign('left').run(),
      title: 'Align Left'
    },
    {
      icon: AlignCenter,
      alignment: 'center',
      isActive: () => editor.isActive({ textAlign: 'center' }),
      onClick: () => editor.chain().focus().setTextAlign('center').run(),
      title: 'Align Center'
    },
    {
      icon: AlignRight,
      alignment: 'right',
      isActive: () => editor.isActive({ textAlign: 'right' }),
      onClick: () => editor.chain().focus().setTextAlign('right').run(),
      title: 'Align Right'
    },
    {
      icon: AlignJustify,
      alignment: 'justify',
      isActive: () => editor.isActive({ textAlign: 'justify' }),
      onClick: () => editor.chain().focus().setTextAlign('justify').run(),
      title: 'Justify'
    }
  ];

  return (
    <div className="flex items-center gap-1">
      {alignmentButtons.map((button) => {
        const Icon = button.icon;
        return (
          <Button
            key={button.alignment}
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

export default AlignmentControls;
