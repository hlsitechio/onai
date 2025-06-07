
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Sparkles, 
  Wand2, 
  TrendingUp, 
  MessageSquare,
  ChevronRight,
  Loader2,
  Square
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { callGeminiAI } from '@/utils/aiUtils';
import { useToast } from '@/hooks/use-toast';

interface InlineAIActionsProps {
  selectedText: string;
  onTextReplace: (newText: string) => void;
  onTextInsert: (text: string) => void;
  position: { x: number; y: number };
  isVisible: boolean;
  onClose: () => void;
}

const InlineAIActions: React.FC<InlineAIActionsProps> = ({
  selectedText,
  onTextReplace,
  onTextInsert,
  position,
  isVisible,
  onClose
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [streamingText, setStreamingText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const { toast } = useToast();
  const containerRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Simulated streaming effect
  const streamText = (text: string, onComplete: () => void) => {
    setIsStreaming(true);
    setStreamingText('');
    
    let index = 0;
    const interval = setInterval(() => {
      if (index < text.length) {
        setStreamingText(prev => prev + text[index]);
        index++;
      } else {
        clearInterval(interval);
        setIsStreaming(false);
        onComplete();
      }
    }, 20); // Typing speed

    return () => clearInterval(interval);
  };

  const handleAction = async (action: 'enhance' | 'amplify' | 'continue' | 'suggest') => {
    if (!selectedText && action !== 'continue') return;
    
    setIsProcessing(true);
    setActiveAction(action);
    setStreamingText('');
    
    // Create abort controller for this request
    abortControllerRef.current = new AbortController();
    
    try {
      let prompt = '';
      let requestType = 'improve';
      
      switch (action) {
        case 'enhance':
          prompt = `Enhance and improve this text while keeping the same meaning: "${selectedText}"`;
          requestType = 'improve';
          break;
        case 'amplify':
          prompt = `Expand and amplify this idea with more detail and depth: "${selectedText}"`;
          requestType = 'ideas';
          break;
        case 'continue':
          prompt = `Continue this thought naturally and logically: "${selectedText}"`;
          requestType = 'ideas';
          break;
        case 'suggest':
          prompt = `Provide alternative ways to express this: "${selectedText}"`;
          requestType = 'improve';
          break;
      }
      
      const result = await callGeminiAI(prompt, selectedText, requestType);
      
      // Start streaming animation
      const cleanup = streamText(result, () => {
        if (action === 'enhance' || action === 'suggest') {
          onTextReplace(result);
        } else {
          onTextInsert(result);
        }
        
        toast({
          title: 'AI Action Complete',
          description: `Successfully ${action === 'enhance' ? 'enhanced' : action === 'amplify' ? 'amplified' : action === 'continue' ? 'continued' : 'suggested alternatives for'} your text.`,
        });
        
        onClose();
      });

      // Store cleanup function
      abortControllerRef.current.signal.addEventListener('abort', cleanup);
      
    } catch (error) {
      if (error.name === 'AbortError') {
        toast({
          title: 'Generation Stopped',
          description: 'AI text generation was stopped.',
        });
      } else {
        console.error('Error processing AI action:', error);
        toast({
          title: 'AI Action Failed',
          description: 'There was an error processing your request. Please try again.',
          variant: 'destructive'
        });
      }
    } finally {
      setIsProcessing(false);
      setActiveAction(null);
      setIsStreaming(false);
      setStreamingText('');
      abortControllerRef.current = null;
    }
  };

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div
      ref={containerRef}
      className="fixed z-50 bg-black/95 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl min-w-56 max-w-sm"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 p-3 border-b border-white/10">
        <Sparkles className="h-4 w-4 text-noteflow-400" />
        <span className="text-sm font-medium text-white">AI Actions</span>
        {isProcessing && (
          <Button
            onClick={handleStop}
            size="sm"
            variant="ghost"
            className="ml-auto h-6 w-6 p-0 hover:bg-red-500/20 hover:text-red-300"
          >
            <Square className="h-3 w-3" />
          </Button>
        )}
      </div>
      
      {/* Streaming preview */}
      {isStreaming && streamingText && (
        <div className="p-3 border-b border-white/10 bg-noteflow-500/5">
          <div className="text-xs text-noteflow-300 mb-1">Preview:</div>
          <div className="text-sm text-white/90 max-h-24 overflow-y-auto">
            {streamingText}
            <span className="animate-pulse">|</span>
          </div>
        </div>
      )}
      
      {/* Action buttons */}
      <div className="p-2 space-y-1">
        <Button
          onClick={() => handleAction('enhance')}
          disabled={isProcessing || !selectedText}
          size="sm"
          variant="ghost"
          className={cn(
            "w-full justify-start gap-3 text-left h-10 px-3",
            "hover:bg-blue-500/20 hover:text-blue-300 text-white/90",
            isProcessing && activeAction === 'enhance' && "bg-blue-500/20 text-blue-300"
          )}
        >
          {isProcessing && activeAction === 'enhance' ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Wand2 className="h-4 w-4" />
          )}
          <div className="flex flex-col items-start">
            <span className="text-sm font-medium">Enhance</span>
            <span className="text-xs opacity-70">Improve writing quality</span>
          </div>
        </Button>
        
        <Button
          onClick={() => handleAction('amplify')}
          disabled={isProcessing || !selectedText}
          size="sm"
          variant="ghost"
          className={cn(
            "w-full justify-start gap-3 text-left h-10 px-3",
            "hover:bg-green-500/20 hover:text-green-300 text-white/90",
            isProcessing && activeAction === 'amplify' && "bg-green-500/20 text-green-300"
          )}
        >
          {isProcessing && activeAction === 'amplify' ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <TrendingUp className="h-4 w-4" />
          )}
          <div className="flex flex-col items-start">
            <span className="text-sm font-medium">Amplify</span>
            <span className="text-xs opacity-70">Expand with more detail</span>
          </div>
        </Button>
        
        <Button
          onClick={() => handleAction('continue')}
          disabled={isProcessing}
          size="sm"
          variant="ghost"
          className={cn(
            "w-full justify-start gap-3 text-left h-10 px-3",
            "hover:bg-purple-500/20 hover:text-purple-300 text-white/90",
            isProcessing && activeAction === 'continue' && "bg-purple-500/20 text-purple-300"
          )}
        >
          {isProcessing && activeAction === 'continue' ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
          <div className="flex flex-col items-start">
            <span className="text-sm font-medium">Continue</span>
            <span className="text-xs opacity-70">Continue the thought</span>
          </div>
        </Button>
        
        <Button
          onClick={() => handleAction('suggest')}
          disabled={isProcessing || !selectedText}
          size="sm"
          variant="ghost"
          className={cn(
            "w-full justify-start gap-3 text-left h-10 px-3",
            "hover:bg-orange-500/20 hover:text-orange-300 text-white/90",
            isProcessing && activeAction === 'suggest' && "bg-orange-500/20 text-orange-300"
          )}
        >
          {isProcessing && activeAction === 'suggest' ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <MessageSquare className="h-4 w-4" />
          )}
          <div className="flex flex-col items-start">
            <span className="text-sm font-medium">Suggest</span>
            <span className="text-xs opacity-70">Alternative expressions</span>
          </div>
        </Button>
      </div>
    </div>
  );
};

export default InlineAIActions;
