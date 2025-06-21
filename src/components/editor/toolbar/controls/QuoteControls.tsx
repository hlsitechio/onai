import React from 'react';
import { Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Editor } from '@tiptap/react';

interface QuoteControlsProps {
  editor: Editor;
}

const QuoteControls: React.FC<QuoteControlsProps> = ({ editor }) => {
  const isQuoteActive = () => {
    return editor?.isActive('blockquote') || false;
  };

  const toggleBlockquote = () => {
    try {
      if (editor?.chain) {
        editor.chain().focus().toggleBlockquote().run();
      } else {
        const selection = window.getSelection();
        if (selection && selection.toString().trim()) {
          const selectedText = selection.toString();
          const quoteHtml = `<blockquote style="border-left: 4px solid #6366f1; padding-left: 1rem; margin: 1rem 0; font-style: italic; color: #94a3b8;">${selectedText}</blockquote>`;
          document.execCommand('insertHTML', false, quoteHtml);
        } else {
          const quoteHtml = `<blockquote style="border-left: 4px solid #6366f1; padding-left: 1rem; margin: 1rem 0; font-style: italic; color: #94a3b8;">Quote text here...</blockquote>`;
          document.execCommand('insertHTML', false, quoteHtml);
        }
      }
    } catch {
      const quoteHtml = `<blockquote style="border-left: 4px solid #6366f1; padding-left: 1rem; margin: 1rem 0; font-style: italic; color: #94a3b8;">Quote text here...</blockquote>`;
      document.execCommand('insertHTML', false, quoteHtml);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleBlockquote}
      className={cn(
        "h-8 w-8 p-0 hover:bg-white/10 transition-colors",
        isQuoteActive() 
          ? "bg-white/20 text-white" 
          : "text-gray-300 hover:text-white"
      )}
      title="Blockquote"
    >
      <Quote className="h-4 w-4" />
    </Button>
  );
};

export default QuoteControls;
