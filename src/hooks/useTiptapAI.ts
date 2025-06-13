
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { callGeminiAI } from '@/utils/aiUtils';
import type { Editor } from '@tiptap/react';

interface UseTiptapAIProps {
  editor: Editor | null;
  selectedText: string;
  hideInlineActions: () => void;
}

export const useTiptapAI = ({ editor, selectedText, hideInlineActions }: UseTiptapAIProps) => {
  const { toast } = useToast();
  const [isProcessingAI, setIsProcessingAI] = useState(false);

  const handleAITextReplace = useCallback((newText: string) => {
    if (!editor || !selectedText) return;
    
    const { from, to } = editor.state.selection;
    editor.chain().focus().deleteRange({ from, to }).insertContent(newText).run();
    hideInlineActions();
  }, [editor, selectedText, hideInlineActions]);

  const handleAITextInsert = useCallback((text: string) => {
    if (!editor) return;
    
    const { to } = editor.state.selection;
    editor.chain().focus().insertContentAt(to, ` ${text}`).run();
    hideInlineActions();
  }, [editor, hideInlineActions]);

  const handleQuickAI = async (action: 'enhance' | 'continue') => {
    if (!selectedText || isProcessingAI) return;
    
    setIsProcessingAI(true);
    try {
      let prompt = '';
      if (action === 'enhance') {
        prompt = `Enhance and improve this text while keeping the same meaning: "${selectedText}"`;
      } else {
        prompt = `Continue this thought naturally: "${selectedText}"`;
      }
      
      const result = await callGeminiAI(prompt, selectedText, 'improve');
      
      if (action === 'enhance') {
        handleAITextReplace(result);
      } else {
        handleAITextInsert(result);
      }
      
      toast({
        title: 'AI Enhancement Applied',
        description: `Successfully ${action === 'enhance' ? 'enhanced' : 'continued'} your text.`,
      });
    } catch (error) {
      console.error('AI action failed:', error);
      toast({
        title: 'AI Action Failed',
        description: 'Please try again or use the AI sidebar for more options.',
        variant: 'destructive'
      });
    } finally {
      setIsProcessingAI(false);
    }
  };

  return {
    isProcessingAI,
    handleAITextReplace,
    handleAITextInsert,
    handleQuickAI
  };
};
