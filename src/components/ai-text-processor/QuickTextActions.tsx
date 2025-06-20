
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Languages, 
  PenTool, 
  Maximize2, 
  FileText, 
  Smile,
  Loader2
} from 'lucide-react';
import { useTextAIProcessor } from '@/hooks/useTextAIProcessor';

interface QuickTextActionsProps {
  selectedText: string;
  onTextReplace: (newText: string) => void;
  className?: string;
}

const QuickTextActions: React.FC<QuickTextActionsProps> = ({
  selectedText,
  onTextReplace,
  className = ''
}) => {
  const { isProcessing, processText } = useTextAIProcessor({
    onTextChange: onTextReplace
  });

  const handleAction = async (actionType: string, options: any = {}) => {
    try {
      console.log('Quick action triggered:', actionType, { selectedText: selectedText.substring(0, 50) + '...' });
      await processText(actionType, selectedText, options);
    } catch (error) {
      console.error('Quick action failed:', error);
    }
  };

  const quickActions = [
    {
      id: 'translate-spanish',
      label: 'ES',
      icon: Languages,
      action: () => handleAction('translate', { language: 'Spanish' }),
      color: 'bg-blue-500/20 text-blue-300 hover:bg-blue-500/30'
    },
    {
      id: 'professional',
      label: 'Pro',
      icon: PenTool,
      action: () => handleAction('rewrite', { style: 'professional' }),
      color: 'bg-purple-500/20 text-purple-300 hover:bg-purple-500/30'
    },
    {
      id: 'expand',
      label: 'Exp',
      icon: Maximize2,
      action: () => handleAction('resize', { size: 'longer' }),
      color: 'bg-green-500/20 text-green-300 hover:bg-green-500/30'
    },
    {
      id: 'summarize',
      label: 'Sum',
      icon: FileText,
      action: () => handleAction('summarize'),
      color: 'bg-orange-500/20 text-orange-300 hover:bg-orange-500/30'
    },
    {
      id: 'friendly',
      label: 'Fun',
      icon: Smile,
      action: () => handleAction('tone', { tone: 'friendly' }),
      color: 'bg-pink-500/20 text-pink-300 hover:bg-pink-500/30'
    }
  ];

  // Don't render if no selected text or if processing
  if (!selectedText || selectedText.trim().length === 0) {
    return null;
  }

  if (isProcessing) {
    return (
      <div className={`flex items-center gap-2 p-2 bg-black/80 backdrop-blur-lg rounded-lg border border-white/10 ${className}`}>
        <Loader2 className="h-3 w-3 animate-spin text-noteflow-400" />
        <span className="text-xs text-slate-300">Processing...</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-1 p-2 bg-black/80 backdrop-blur-lg rounded-lg border border-white/10 ${className}`}>
      {quickActions.map((action) => {
        const Icon = action.icon;
        return (
          <Button
            key={action.id}
            onClick={action.action}
            size="sm"
            disabled={isProcessing}
            className={`h-7 w-7 p-0 ${action.color} border-0 hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed`}
            title={`${action.label} - ${action.id.replace('-', ' ')}`}
          >
            <Icon className="h-3 w-3" />
          </Button>
        );
      })}
    </div>
  );
};

export default QuickTextActions;
