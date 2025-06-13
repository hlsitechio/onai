
import React from 'react';
import { BubbleMenu } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { 
  Bold, 
  Italic,
  Wand2, 
  ChevronRight,
  Sparkles,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Editor } from '@tiptap/react';

interface TiptapBubbleMenuProps {
  editor: Editor;
  selectedText: string;
  isProcessingAI: boolean;
  onQuickAI: (action: 'enhance' | 'continue') => void;
  onShowAIAgent: () => void;
}

const TiptapBubbleMenu: React.FC<TiptapBubbleMenuProps> = ({
  editor,
  selectedText,
  isProcessingAI,
  onQuickAI,
  onShowAIAgent
}) => {
  return (
    <BubbleMenu
      editor={editor}
      tippyOptions={{ duration: 100 }}
      className="bg-black/95 backdrop-blur-xl border border-white/20 rounded-lg shadow-2xl overflow-hidden"
    >
      <div className="flex items-center divide-x divide-white/10">
        {/* Basic formatting */}
        <div className="flex items-center p-1">
          <Button
            onClick={() => editor.chain().focus().toggleBold().run()}
            size="sm"
            variant="ghost"
            className={cn(
              "h-8 w-8 p-0",
              editor.isActive('bold') 
                ? "bg-white/20 text-white" 
                : "text-white/70 hover:text-white hover:bg-white/10"
            )}
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            size="sm"
            variant="ghost"
            className={cn(
              "h-8 w-8 p-0",
              editor.isActive('italic') 
                ? "bg-white/20 text-white" 
                : "text-white/70 hover:text-white hover:bg-white/10"
            )}
          >
            <Italic className="h-4 w-4" />
          </Button>
        </div>
        
        {/* AI Actions */}
        <div className="flex items-center p-1">
          <Button
            onClick={() => onQuickAI('enhance')}
            disabled={isProcessingAI || !selectedText}
            size="sm"
            variant="ghost"
            className="h-8 px-2 text-white/70 hover:text-white hover:bg-white/10"
            title="Enhance with AI"
          >
            {isProcessingAI ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <Wand2 className="h-3 w-3" />
            )}
          </Button>
          <Button
            onClick={() => onQuickAI('continue')}
            disabled={isProcessingAI || !selectedText}
            size="sm"
            variant="ghost"
            className="h-8 px-2 text-white/70 hover:text-white hover:bg-white/10"
            title="Continue with AI"
          >
            <ChevronRight className="h-3 w-3" />
          </Button>
          <Button
            onClick={onShowAIAgent}
            size="sm"
            variant="ghost"
            className="h-8 px-2 text-noteflow-300 hover:text-noteflow-200 hover:bg-noteflow-500/20"
            title="Open AI Agent"
          >
            <Sparkles className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </BubbleMenu>
  );
};

export default TiptapBubbleMenu;
