
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TiptapFloatingHintProps {
  onShowAIAgent: () => void;
}

const TiptapFloatingHint: React.FC<TiptapFloatingHintProps> = ({
  onShowAIAgent
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [hasBeenDismissed, setHasBeenDismissed] = useState(false);

  useEffect(() => {
    // Check if user has previously dismissed the hint
    const dismissed = localStorage.getItem('ai-hint-dismissed');
    if (dismissed) {
      setHasBeenDismissed(true);
      setIsVisible(false);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    setHasBeenDismissed(true);
    localStorage.setItem('ai-hint-dismissed', 'true');
  };

  const handleShowAI = () => {
    onShowAIAgent();
    handleDismiss();
  };

  if (!isVisible || hasBeenDismissed) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
      <div className="bg-gradient-to-r from-noteflow-500/90 to-purple-500/90 backdrop-blur-xl rounded-lg p-4 shadow-2xl border border-white/20 max-w-sm">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-white" />
            <h3 className="font-medium text-white">AI Assistant Available</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="text-white/70 hover:text-white hover:bg-white/10 p-1 h-6 w-6"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
        
        <p className="text-white/90 text-sm mb-3">
          Select text and get AI suggestions, or use Ctrl+Shift+A to open the AI agent.
        </p>
        
        <div className="flex gap-2">
          <Button
            onClick={handleShowAI}
            size="sm"
            className="bg-white/20 hover:bg-white/30 text-white text-xs"
          >
            Try AI Assistant
          </Button>
          <Button
            onClick={handleDismiss}
            variant="ghost"
            size="sm"
            className="text-white/70 hover:text-white hover:bg-white/10 text-xs"
          >
            Maybe later
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TiptapFloatingHint;
