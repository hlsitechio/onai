
import React, { useEffect, useState } from 'react';
import { BubbleMenu } from '@tiptap/react';
import type { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { Bold, Italic, Underline, Code, Sparkles } from 'lucide-react';
import QuickTextActions from '../ai-text-processor/QuickTextActions';

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
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    const updateShouldShow = () => {
      const { from, to } = editor.state.selection;
      const hasSelection = from !== to;
      setShouldShow(hasSelection && selectedText.length > 0);
    };

    updateShouldShow();
    editor.on('selectionUpdate', updateShouldShow);
    
    return () => {
      editor.off('selectionUpdate', updateShouldShow);
    };
  }, [editor, selectedText]);

  const handleTextReplace = (newText: string) => {
    if (!selectedText) return;
    
    const { from, to } = editor.state.selection;
    editor.chain().focus().setTextSelection({ from, to }).insertContent(newText).run();
  };

  if (!shouldShow) return null;

  return (
    <BubbleMenu
      editor={editor}
      tippyOptions={{ 
        duration: 100,
        placement: 'top',
        offset: [0, 10]
      }}
      className="flex flex-col gap-2 p-2 bg-black/90 backdrop-blur-xl rounded-lg border border-white/10 shadow-2xl"
    >
      {/* Traditional formatting buttons */}
      <div className="flex items-center gap-1">
        <Button
          onClick={() => editor.chain().focus().toggleBold().run()}
          variant="ghost"
          size="sm"
          className={`h-7 w-7 p-0 ${editor.isActive('bold') ? 'bg-white/20' : 'hover:bg-white/10'} text-white`}
        >
          <Bold className="h-3 w-3" />
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          variant="ghost"
          size="sm"
          className={`h-7 w-7 p-0 ${editor.isActive('italic') ? 'bg-white/20' : 'hover:bg-white/10'} text-white`}
        >
          <Italic className="h-3 w-3" />
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          variant="ghost"
          size="sm"
          className={`h-7 w-7 p-0 ${editor.isActive('underline') ? 'bg-white/20' : 'hover:bg-white/10'} text-white`}
        >
          <Underline className="h-3 w-3" />
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleCode().run()}
          variant="ghost"
          size="sm"
          className={`h-7 w-7 p-0 ${editor.isActive('code') ? 'bg-white/20' : 'hover:bg-white/10'} text-white`}
        >
          <Code className="h-3 w-3" />
        </Button>
        
        <div className="w-px h-4 bg-white/20 mx-1" />
        
        <Button
          onClick={onShowAIAgent}
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-noteflow-300 hover:text-noteflow-200 hover:bg-noteflow-500/20"
        >
          <Sparkles className="h-3 w-3 mr-1" />
          <span className="text-xs">AI</span>
        </Button>
      </div>

      {/* Quick AI text actions */}
      <QuickTextActions
        selectedText={selectedText}
        onTextReplace={handleTextReplace}
      />
    </BubbleMenu>
  );
};

export default TiptapBubbleMenu;
