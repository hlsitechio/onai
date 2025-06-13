
import React from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

interface TiptapFloatingHintProps {
  onShowAIAgent: () => void;
}

const TiptapFloatingHint: React.FC<TiptapFloatingHintProps> = ({
  onShowAIAgent
}) => {
  return (
    <div className="absolute bottom-4 right-4 z-40">
      <Button
        onClick={onShowAIAgent}
        size="sm"
        className="bg-noteflow-500/20 hover:bg-noteflow-500/30 text-noteflow-300 border border-noteflow-500/30 backdrop-blur-sm"
      >
        <Sparkles className="h-3 w-3 mr-1" />
        AI Assistant
      </Button>
    </div>
  );
};

export default TiptapFloatingHint;
