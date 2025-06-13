
import { useState, useCallback } from 'react';
import { Editor } from '@tiptap/react';
import { callGeminiAI } from '@/utils/aiUtils';
import { useToast } from '@/hooks/use-toast';
import { useAIRequestQueue } from './useAIRequestQueue';

interface UseTiptapAIProps {
  editor: Editor | null;
  selectedText: string;
  hideInlineActions: () => void;
}

export const useTiptapAI = ({ editor, selectedText, hideInlineActions }: UseTiptapAIProps) => {
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const { toast } = useToast();
  const { enqueueRequest } = useAIRequestQueue();

  const handleAITextReplace = useCallback(async (newText: string) => {
    if (!editor || !selectedText) return;

    try {
      const { from, to } = editor.state.selection;
      editor.chain().focus().setTextSelection({ from, to }).insertContent(newText).run();
      hideInlineActions();
      
      toast({
        title: 'Text replaced',
        description: 'AI has successfully replaced the selected text.',
      });
    } catch (error) {
      console.error('Error replacing text:', error);
      toast({
        title: 'Error',
        description: 'Failed to replace text. Please try again.',
        variant: 'destructive'
      });
    }
  }, [editor, selectedText, hideInlineActions, toast]);

  const handleAITextInsert = useCallback(async (text: string) => {
    if (!editor) return;

    try {
      const { to } = editor.state.selection;
      editor.chain().focus().setTextSelection(to).insertContent(` ${text}`).run();
      hideInlineActions();
      
      toast({
        title: 'Text inserted',
        description: 'AI has successfully inserted new text.',
      });
    } catch (error) {
      console.error('Error inserting text:', error);
      toast({
        title: 'Error',
        description: 'Failed to insert text. Please try again.',
        variant: 'destructive'
      });
    }
  }, [editor, hideInlineActions, toast]);

  const handleQuickAI = useCallback(async (action: 'enhance' | 'continue') => {
    if (!editor) return;

    setIsProcessingAI(true);
    
    try {
      const content = editor.getHTML();
      
      await enqueueRequest(async () => {
        let prompt = '';
        if (action === 'enhance' && selectedText) {
          prompt = `Enhance and improve this text while keeping the same meaning: "${selectedText}"`;
        } else if (action === 'continue') {
          const contextText = selectedText || content.slice(-200);
          prompt = `Continue this thought naturally and logically: "${contextText}"`;
        }
        
        if (!prompt) return;
        
        const result = await callGeminiAI(prompt, content, 'improve');
        
        if (action === 'enhance' && selectedText) {
          await handleAITextReplace(result);
        } else {
          await handleAITextInsert(result);
        }
      });
    } catch (error) {
      console.error('Error in quick AI action:', error);
      toast({
        title: 'AI Action Failed',
        description: 'There was an error processing your request. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsProcessingAI(false);
    }
  }, [editor, selectedText, enqueueRequest, handleAITextReplace, handleAITextInsert, toast]);

  return {
    isProcessingAI,
    handleAITextReplace,
    handleAITextInsert,
    handleQuickAI
  };
};
