
import React from 'react';
import { Heading1, Heading2, Heading3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Editor } from '@tiptap/react';

interface HeadingControlsProps {
  editor?: Editor;
}

const HeadingControls: React.FC<HeadingControlsProps> = ({ editor }) => {
  const headingButtons = [
    {
      icon: Heading1,
      level: 1 as const,
      isActive: () => editor?.isActive('heading', { level: 1 }) || false,
      onClick: () => {
        if (editor?.isActive('heading', { level: 1 })) {
          editor.chain().focus().setParagraph().run();
        } else if (editor?.chain) {
          editor.chain().focus().toggleHeading({ level: 1 }).run();
        } else {
          document.execCommand('formatBlock', false, 'h1');
        }
      },
      title: 'Heading 1'
    },
    {
      icon: Heading2,
      level: 2 as const,
      isActive: () => editor?.isActive('heading', { level: 2 }) || false,
      onClick: () => {
        if (editor?.isActive('heading', { level: 2 })) {
          editor.chain().focus().setParagraph().run();
        } else if (editor?.chain) {
          editor.chain().focus().toggleHeading({ level: 2 }).run();
        } else {
          document.execCommand('formatBlock', false, 'h2');
        }
      },
      title: 'Heading 2'
    },
    {
      icon: Heading3,
      level: 3 as const,
      isActive: () => editor?.isActive('heading', { level: 3 }) || false,
      onClick: () => {
        if (editor?.isActive('heading', { level: 3 })) {
          editor.chain().focus().setParagraph().run();
        } else if (editor?.chain) {
          editor.chain().focus().toggleHeading({ level: 3 }).run();
        } else {
          document.execCommand('formatBlock', false, 'h3');
        }
      },
      title: 'Heading 3'
    }
  ];

  return (
    <div className="flex items-center gap-1">
      {headingButtons.map((button) => {
        const Icon = button.icon;
        const isActive = button.isActive();
        return (
          <Button
            key={button.level}
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

export default HeadingControls;
