
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Wand2, 
  TrendingUp, 
  ChevronRight,
  MessageSquare,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { callGeminiAI } from '@/utils/aiUtils';
import { useToast } from '@/hooks/use-toast';

interface AIQuickActionsProps {
  selectedText: string;
  onTextReplace: (newText: string) => void;
  onTextInsert: (text: string) => void;
  isProcessing: boolean;
}

const AIQuickActions: React.FC<AIQuickActionsProps> = ({
  selectedText,
  onTextReplace,
  onTextInsert,
  isProcessing
}) => {
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const { toast } = useToast();

  const quickActions = [
    {
      id: 'enhance',
      label: 'Enhance',
      description: 'Improve writing quality',
      icon: Wand2,
      color: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      disabled: !selectedText,
      action: async () => {
        const prompt = `Enhance and improve this text while keeping the same meaning: "${selectedText}"`;
        const result = await callGeminiAI(prompt, selectedText, 'improve');
        onTextReplace(result);
      }
    },
    {
      id: 'amplify',
      label: 'Amplify',
      description: 'Expand with more detail',
      icon: TrendingUp,
      color: 'bg-green-500/20 text-green-300 border-green-500/30',
      disabled: !selectedText,
      action: async () => {
        const prompt = `Expand and amplify this idea with more detail and depth: "${selectedText}"`;
        const result = await callGeminiAI(prompt, selectedText, 'ideas');
        onTextInsert(result);
      }
    },
    {
      id: 'continue',
      label: 'Continue',
      description: 'Continue the thought',
      icon: ChevronRight,
      color: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      disabled: false,
      action: async () => {
        const prompt = `Continue this thought naturally and logically: "${selectedText || 'the current content'}"`;
        const result = await callGeminiAI(prompt, selectedText, 'ideas');
        onTextInsert(result);
      }
    },
    {
      id: 'suggest',
      label: 'Suggest',
      description: 'Alternative expressions',
      icon: MessageSquare,
      color: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
      disabled: !selectedText,
      action: async () => {
        const prompt = `Provide alternative ways to express this: "${selectedText}"`;
        const result = await callGeminiAI(prompt, selectedText, 'improve');
        onTextReplace(result);
      }
    }
  ];

  const handleAction = async (action: typeof quickActions[0]) => {
    if (action.disabled || isProcessing) return;
    
    setActiveAction(action.id);
    
    try {
      await action.action();
      toast({
        title: 'Quick Action Complete',
        description: `Successfully ${action.label.toLowerCase()}ed your text.`,
      });
    } catch (error) {
      console.error('Error in quick action:', error);
      toast({
        title: 'Quick Action Failed',
        description: 'There was an error processing your request.',
        variant: 'destructive'
      });
    } finally {
      setActiveAction(null);
    }
  };

  return (
    <div className="space-y-3">
      <div className="text-xs text-slate-400 mb-3">
        {selectedText ? `Selected: "${selectedText.slice(0, 50)}..."` : 'No text selected'}
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        {quickActions.map((action) => {
          const Icon = action.icon;
          const isActive = activeAction === action.id;
          
          return (
            <Button
              key={action.id}
              onClick={() => handleAction(action)}
              disabled={action.disabled || isProcessing}
              variant="ghost"
              className={cn(
                "h-auto p-3 flex flex-col items-start gap-1 text-left",
                "hover:bg-white/10 border border-white/10",
                action.disabled && "opacity-50 cursor-not-allowed",
                isActive && "bg-white/20"
              )}
            >
              <div className="flex items-center gap-2 w-full">
                {isActive ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Icon className="h-4 w-4" />
                )}
                <span className="text-sm font-medium text-white">
                  {action.label}
                </span>
              </div>
              <span className="text-xs text-slate-400">
                {action.description}
              </span>
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default AIQuickActions;
