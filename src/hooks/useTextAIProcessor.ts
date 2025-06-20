
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { callGeminiAI } from '@/utils/aiUtils';

interface TextProcessingOptions {
  language?: string;
  style?: string;
  tone?: string;
  size?: string;
}

interface UseTextAIProcessorProps {
  onTextChange?: (text: string) => void;
}

export const useTextAIProcessor = ({ onTextChange }: UseTextAIProcessorProps = {}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState('');
  const { toast } = useToast();

  const processText = async (action: string, text: string, options: TextProcessingOptions = {}) => {
    setIsProcessing(true);
    
    try {
      let prompt = '';
      let requestType = 'improve';

      switch (action) {
        case 'translate':
          prompt = `Translate the following text to ${options.language}. Maintain the original meaning and context:\n\n${text}`;
          requestType = 'translate';
          break;
          
        case 'rewrite':
          prompt = `Rewrite the following text in a ${options.style} style. Keep the core message but adapt the writing style:\n\n${text}`;
          requestType = 'improve';
          break;
          
        case 'resize':
          if (options.size === 'shorter') {
            prompt = `Make this text shorter and more concise while keeping all key information:\n\n${text}`;
          } else if (options.size === 'longer') {
            prompt = `Expand this text with more detail and explanation:\n\n${text}`;
          } else if (options.size === 'expanded') {
            prompt = `Significantly expand this text with comprehensive details, examples, and elaboration:\n\n${text}`;
          } else if (options.size === 'detailed') {
            prompt = `Add detailed explanations, examples, and thorough coverage of all aspects mentioned in:\n\n${text}`;
          }
          requestType = 'improve';
          break;
          
        case 'summarize':
          prompt = `Create a concise summary of the following text, capturing all key points:\n\n${text}`;
          requestType = 'summarize';
          break;
          
        case 'tone':
          prompt = `Rewrite the following text with a ${options.tone} tone while maintaining the same information:\n\n${text}`;
          requestType = 'improve';
          break;
          
        default:
          throw new Error('Invalid action selected');
      }

      const response = await callGeminiAI(prompt, text, requestType);
      setResult(response);
      
      toast({
        title: 'Text processing complete',
        description: `Successfully ${action === 'translate' ? 'translated' : 'processed'} your text.`,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to process text';
      toast({
        title: 'Processing failed',
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(result);
      toast({
        title: 'Copied to clipboard',
        description: 'The processed text has been copied to your clipboard.',
      });
    } catch (error) {
      toast({
        title: 'Copy failed',
        description: 'Failed to copy text to clipboard.',
        variant: 'destructive'
      });
    }
  };

  const applyResult = () => {
    if (onTextChange && result) {
      onTextChange(result);
      toast({
        title: 'Text applied',
        description: 'The processed text has been applied.',
      });
    }
  };

  const clearResult = () => {
    setResult('');
  };

  return {
    isProcessing,
    result,
    processText,
    clearResult,
    copyToClipboard,
    applyResult
  };
};
