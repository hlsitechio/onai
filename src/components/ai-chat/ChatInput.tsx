
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Loader2 } from 'lucide-react';

interface ChatInputProps {
  inputValue: string;
  isProcessing: boolean;
  usageStats: {
    used: number;
    limit: number;
    percent: number;
  };
  onInputChange: (value: string) => void;
  onSendMessage: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  inputRef: React.RefObject<HTMLInputElement>;
}

const ChatInput: React.FC<ChatInputProps> = ({
  inputValue,
  isProcessing,
  usageStats,
  onInputChange,
  onSendMessage,
  onKeyPress,
  inputRef
}) => {
  return (
    <div className="border-t border-white/10 bg-gradient-to-r from-[#03010a] to-[#0a0518] p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => onInputChange(e.target.value)}
              onKeyPress={onKeyPress}
              placeholder="Message AI Assistant..."
              className="bg-black/30 border-white/20 text-white placeholder:text-slate-400 focus:border-noteflow-500 min-h-[44px] resize-none"
              disabled={isProcessing}
            />
          </div>
          <Button
            onClick={onSendMessage}
            disabled={!inputValue.trim() || isProcessing}
            className="bg-noteflow-500 hover:bg-noteflow-600 text-white px-4 h-[44px]"
          >
            {isProcessing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
        
        <div className="flex items-center justify-between mt-2 text-xs text-slate-500">
          <span>Powered by Gemini 2.5 Flash • Press Enter to send</span>
          <div className="w-16 bg-black/30 rounded-full h-1">
            <div 
              className={`h-1 rounded-full ${usageStats.percent > 80 ? 'bg-red-500' : 'bg-noteflow-500'}`} 
              style={{ width: `${usageStats.percent}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
