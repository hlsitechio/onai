
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
    if (!text.trim()) {
      toast({
        title: "No text provided",
        description: "Please select some text to process.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      let prompt = '';
      let requestType = 'improve';

      switch (action) {
        case 'translate':
          prompt = `Translate this text to ${options.language}:\n\n${text}`;
          requestType = 'translate';
          break;
          
        case 'rewrite':
          prompt = `Rewrite this text in ${options.style} style:\n\n${text}`;
          requestType = 'improve';
          break;
          
        case 'resize':
          if (options.size === 'shorter') {
            prompt = `Make this text shorter and more concise:\n\n${text}`;
          } else if (options.size === 'longer') {
            prompt = `Expand this text with more detail:\n\n${text}`;
          } else if (options.size === 'expanded') {
            prompt = `Significantly expand this text with comprehensive details:\n\n${text}`;
          } else if (options.size === 'detailed') {
            prompt = `Add detailed explanations and examples to:\n\n${text}`;
          }
          requestType = 'improve';
          break;
          
        case 'summarize':
          prompt = `Create a concise summary of:\n\n${text}`;
          requestType = 'summarize';
          break;
          
        case 'tone':
          prompt = `Rewrite this text with a ${options.tone} tone:\n\n${text}`;
          requestType = 'improve';
          break;
          
        default:
          throw new Error('Invalid action selected');
      }

      const response = await callGeminiAI(prompt, text, requestType);
      setResult(response);
      
      toast({
        title: 'Success!',
        description: `Text ${action === 'translate' ? 'translated' : 'processed'} successfully.`,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to process text';
      toast({
        title: 'Processing failed',
        description: errorMessage,
        variant: 'destructive'
      });
      setResult(''); // Clear any previous result on error
    } finally {
      setIsProcessing(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(result);
      toast({
        title: 'Copied!',
        description: 'Text copied to clipboard.',
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
        title: 'Applied!',
        description: 'Text has been applied to your note.',
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
