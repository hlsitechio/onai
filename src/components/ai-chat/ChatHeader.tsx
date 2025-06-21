
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Trash2 } from 'lucide-react';

interface ChatHeaderProps {
  usageStats: {
    used: number;
    limit: number;
    percent: number;
  };
  onClearChat: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ usageStats, onClearChat }) => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-white/10 bg-gradient-to-r from-[#03010a] to-[#0a0518]">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-noteflow-400 to-purple-500 flex items-center justify-center">
          <Sparkles className="h-4 w-4 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white">AI Chat Assistant</h2>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-noteflow-500/20 text-noteflow-300 border-noteflow-500/30 text-xs">
              Gemini 2.5 Flash
            </Badge>
            <span className="text-xs text-slate-400">
              {usageStats.used}/{usageStats.limit} requests today
            </span>
          </div>
        </div>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={onClearChat}
        className="text-slate-400 hover:text-white"
        title="Clear chat"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ChatHeader;
