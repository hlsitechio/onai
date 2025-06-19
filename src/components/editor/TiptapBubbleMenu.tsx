
import React from 'react';
import { BubbleMenu, Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { Bold, Italic, Underline } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TiptapBubbleMenuProps {
  editor: Editor;
  selectedText: string;
  isProcessingAI: boolean;
  onQuickAI: () => void;
  onShowAIAgent: () => void;
}

const TiptapBubbleMenu: React.FC<TiptapBubbleMenuProps> = ({
  editor,
  selectedText,
  isProcessingAI,
  onQuickAI,
  onShowAIAgent
}) => {
  if (!editor) return null;

  return (
    <BubbleMenu
      editor={editor}
      tippyOptions={{ duration: 100 }}
      className="flex items-center gap-1 bg-black/90 backdrop-blur-xl border border-white/20 rounded-lg p-1 shadow-xl"
    >
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={cn(
          "h-8 w-8 p-0 text-white hover:bg-white/20",
          editor.isActive('bold') && "bg-white/20"
        )}
      >
        <Bold className="h-4 w-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={cn(
          "h-8 w-8 p-0 text-white hover:bg-white/20",
          editor.isActive('italic') && "bg-white/20"
        )}
      >
        <Italic className="h-4 w-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={cn(
          "h-8 w-8 p-0 text-white hover:bg-white/20",
          editor.isActive('underline') && "bg-white/20"
        )}
      >
        <Underline className="h-4 w-4" />
      </Button>
    </BubbleMenu>
  );
};

export default TiptapBubbleMenu;
