
import React from 'react';
import { useEditorContext } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface HeadingButtonProps {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
}

export const HeadingButton: React.FC<HeadingButtonProps> = ({ level, className }) => {
  const { editor } = useEditorContext();

  if (!editor) {
    return null;
  }

  const isActive = editor.isActive('heading', { level });

  const handleClick = () => {
    if (isActive) {
      editor.chain().focus().setParagraph().run();
    } else {
      editor.chain().focus().toggleHeading({ level }).run();
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleClick}
      className={cn(
        "h-8 px-2 font-medium",
        isActive && "bg-accent text-accent-foreground",
        className
      )}
      type="button"
    >
      H{level}
    </Button>
  );
};
