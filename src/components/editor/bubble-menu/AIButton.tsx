
import React from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

interface AIButtonProps {
  onShowAIAgent: () => void;
}

const AIButton: React.FC<AIButtonProps> = ({ onShowAIAgent }) => {
  return (
    <Button
      onClick={() => {
        try {
          onShowAIAgent();
        } catch (error) {
          console.warn('AI agent show failed:', error);
        }
      }}
      variant="ghost"
      size="sm"
      className="h-7 px-2 text-noteflow-300 hover:text-noteflow-200 hover:bg-noteflow-500/20"
    >
      <Sparkles className="h-3 w-3 mr-1" />
      <span className="text-xs">AI</span>
    </Button>
  );
};

export default AIButton;
