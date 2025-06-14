
import { useState, useCallback } from 'react';
import { callGeminiAI } from '@/utils/aiUtils';
import { useToast } from '@/hooks/use-toast';

interface AISuggestion {
  id: string;
  type: 'enhance' | 'amplify' | 'suggest' | 'continue';
  content: string;
  position: number;
  isApplied: boolean;
}

interface UseAICommandCenterProps {
  content: string;
  selectedText: string;
  cursorPosition: number;
  onContentChange: (newContent: string) => void;
}

export const useAICommandCenter = ({
  content,
  selectedText,
  cursorPosition,
  onContentChange
}: UseAICommandCenterProps) => {
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState('');
  const [streamingResult, setStreamingResult] = useState('');
  const { toast } = useToast();

  const generateSuggestions = useCallback(async () => {
    if (!content.trim()) return;

    setIsProcessing(true);
    try {
      const contextText = selectedText || content.slice(Math.max(0, cursorPosition - 200), cursorPosition + 200);
      
      const suggestions = await Promise.all([
        callGeminiAI(
          `Enhance this text with better clarity and depth: "${contextText}". Provide a concise improvement (max 2 sentences).`,
          content,
          'improve'
        ),
        callGeminiAI(
          `Amplify and expand on this idea: "${contextText}". Provide a creative extension (max 2 sentences).`,
          content,
          'ideas'
        ),
        callGeminiAI(
          `Continue this thought naturally: "${contextText}". Provide a logical next sentence or two.`,
          content,
          'ideas'
        )
      ]);

      const newSuggestions: AISuggestion[] = [
        {
          id: `enhance-${Date.now()}`,
          type: 'enhance',
          content: suggestions[0],
          position: cursorPosition,
          isApplied: false
        },
        {
          id: `amplify-${Date.now()}`,
          type: 'amplify', 
          content: suggestions[1],
          position: cursorPosition,
          isApplied: false
        },
        {
          id: `continue-${Date.now()}`,
          type: 'continue',
          content: suggestions[2],
          position: cursorPosition,
          isApplied: false
        }
      ];

      setSuggestions(newSuggestions);
      toast({
        title: 'Suggestions Generated',
        description: 'AI has generated new ideas for your content.',
      });
    } catch (error) {
      console.error('Error generating suggestions:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate suggestions. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsProcessing(false);
    }
  }, [content, selectedText, cursorPosition, toast]);

  const applySuggestion = useCallback((suggestion: AISuggestion) => {
    let newContent = content;
    
    if (suggestion.type === 'enhance' && selectedText) {
      newContent = content.replace(selectedText, suggestion.content);
    } else if (suggestion.type === 'continue' || suggestion.type === 'amplify') {
      const beforeCursor = content.slice(0, cursorPosition);
      const afterCursor = content.slice(cursorPosition);
      newContent = beforeCursor + (beforeCursor.endsWith(' ') ? '' : ' ') + suggestion.content + ' ' + afterCursor;
    }
    
    onContentChange(newContent);
    
    setSuggestions(prev => 
      prev.map(s => s.id === suggestion.id ? { ...s, isApplied: true } : s)
    );

    toast({
      title: 'Suggestion Applied',
      description: 'The AI suggestion has been added to your note.',
    });
  }, [content, selectedText, cursorPosition, onContentChange, toast]);

  const processAI = useCallback(async (action: string, customPrompt?: string, targetLanguage?: string) => {
    if (!content.trim() && !customPrompt?.trim()) return;

    setIsProcessing(true);
    setResult('');
    setStreamingResult('');

    try {
      let prompt = '';
      let requestType = 'improve';
      
      if (customPrompt?.trim()) {
        prompt = customPrompt;
        requestType = action;
      } else {
        switch (action) {
          case 'analyze':
            prompt = `Analyze the following content and provide insights: ${content}`;
            requestType = 'analyze';
            break;
          case 'ideas':
            prompt = `Generate creative ideas based on: ${content}`;
            requestType = 'ideas';
            break;
          case 'improve':
            prompt = `Improve the writing quality of: ${content}`;
            requestType = 'improve';
            break;
          case 'translate':
            prompt = `Translate the following to ${targetLanguage}: ${content}`;
            requestType = 'translate';
            break;
          case 'summarize':
            prompt = `Summarize the following content: ${content}`;
            requestType = 'summarize';
            break;
        }
      }

      const response = await callGeminiAI(prompt, content, requestType);
      setResult(response);
      
      toast({
        title: 'Processing Complete',
        description: 'AI has finished processing your content.',
      });
    } catch (error) {
      console.error('Error processing AI request:', error);
      toast({
        title: 'Processing Failed',
        description: 'There was an error processing your request.',
        variant: 'destructive'
      });
    } finally {
      setIsProcessing(false);
    }
  }, [content, toast]);

  const clearResult = useCallback(() => {
    setResult('');
    setStreamingResult('');
  }, []);

  const stopProcessing = useCallback(() => {
    setIsProcessing(false);
    setStreamingResult('');
  }, []);

  return {
    suggestions,
    isProcessing,
    result,
    streamingResult,
    generateSuggestions,
    applySuggestion,
    processAI,
    clearResult,
    stopProcessing
  };
};
