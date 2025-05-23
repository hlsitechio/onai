
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Sparkles, 
  Wand2, 
  TrendingUp, 
  MessageSquare,
  ChevronRight,
  Loader2
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
  const { toast } = useToast();
  const containerRef = useRef<HTMLDivElement>(null);

  const handleAction = async (action: 'enhance' | 'amplify' | 'continue' | 'suggest') => {
    if (!selectedText && action !== 'continue') return;
    
    setIsProcessing(true);
    setActiveAction(action);
    
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
    } catch (error) {
      console.error('Error processing AI action:', error);
      toast({
        title: 'AI Action Failed',
        description: 'There was an error processing your request. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsProcessing(false);
      setActiveAction(null);
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
      className="fixed z-50 bg-black/95 backdrop-blur-xl border border-white/20 rounded-xl p-3 shadow-2xl min-w-48"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="h-4 w-4 text-noteflow-400" />
        <span className="text-sm font-medium text-white">AI Actions</span>
      </div>
      
      <div className="space-y-1">
        <Button
          onClick={() => handleAction('enhance')}
          disabled={isProcessing || !selectedText}
          size="sm"
          variant="ghost"
          className={cn(
            "w-full justify-start gap-2 text-left",
            "hover:bg-blue-500/20 hover:text-blue-300",
            isProcessing && activeAction === 'enhance' && "bg-blue-500/20"
          )}
        >
          {isProcessing && activeAction === 'enhance' ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <Wand2 className="h-3 w-3" />
          )}
          <span className="text-xs">Enhance</span>
        </Button>
        
        <Button
          onClick={() => handleAction('amplify')}
          disabled={isProcessing || !selectedText}
          size="sm"
          variant="ghost"
          className={cn(
            "w-full justify-start gap-2 text-left",
            "hover:bg-green-500/20 hover:text-green-300",
            isProcessing && activeAction === 'amplify' && "bg-green-500/20"
          )}
        >
          {isProcessing && activeAction === 'amplify' ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <TrendingUp className="h-3 w-3" />
          )}
          <span className="text-xs">Amplify</span>
        </Button>
        
        <Button
          onClick={() => handleAction('continue')}
          disabled={isProcessing}
          size="sm"
          variant="ghost"
          className={cn(
            "w-full justify-start gap-2 text-left",
            "hover:bg-purple-500/20 hover:text-purple-300",
            isProcessing && activeAction === 'continue' && "bg-purple-500/20"
          )}
        >
          {isProcessing && activeAction === 'continue' ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <ChevronRight className="h-3 w-3" />
          )}
          <span className="text-xs">Continue</span>
        </Button>
        
        <Button
          onClick={() => handleAction('suggest')}
          disabled={isProcessing || !selectedText}
          size="sm"
          variant="ghost"
          className={cn(
            "w-full justify-start gap-2 text-left",
            "hover:bg-orange-500/20 hover:text-orange-300",
            isProcessing && activeAction === 'suggest' && "bg-orange-500/20"
          )}
        >
          {isProcessing && activeAction === 'suggest' ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <MessageSquare className="h-3 w-3" />
          )}
          <span className="text-xs">Suggest</span>
        </Button>
      </div>
    </div>
  );
};

export default InlineAIActions;
