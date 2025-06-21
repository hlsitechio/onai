
import React from 'react';
import { Button } from '@/components/ui/button';
import { User, Bot, Loader2, Copy, Check, Zap } from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isLoading?: boolean;
}

interface ChatMessageProps {
  message: ChatMessage;
  copiedId: string | null;
  onCopy: (content: string, messageId: string) => void;
  onApplyToEditor?: (content: string) => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  copiedId,
  onCopy,
  onApplyToEditor
}) => {
  return (
    <div className="flex gap-4">
      {/* Avatar */}
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
        message.role === 'user' 
          ? 'bg-gradient-to-r from-blue-500 to-blue-600' 
          : 'bg-gradient-to-r from-noteflow-500 to-purple-500'
      }`}>
        {message.role === 'user' ? (
          <User className="h-4 w-4 text-white" />
        ) : (
          <Bot className="h-4 w-4 text-white" />
        )}
      </div>

      {/* Message Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm font-medium text-white">
            {message.role === 'user' ? 'You' : 'AI Assistant'}
          </span>
          <span className="text-xs text-slate-500">
            {message.timestamp.toLocaleTimeString()}
          </span>
        </div>
        
        <div className="prose prose-invert max-w-none">
          {message.isLoading ? (
            <div className="flex items-center gap-2 text-slate-400 py-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>AI is thinking...</span>
            </div>
          ) : (
            <div className="text-gray-200 whitespace-pre-wrap leading-relaxed">
              {message.content}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {message.role === 'assistant' && !message.isLoading && (
          <div className="flex items-center gap-2 mt-3 pt-2 border-t border-white/10">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onCopy(message.content, message.id)}
              className="h-8 px-3 text-xs text-slate-400 hover:text-white"
            >
              {copiedId === message.id ? (
                <Check className="h-3 w-3 mr-1" />
              ) : (
                <Copy className="h-3 w-3 mr-1" />
              )}
              Copy
            </Button>
            {onApplyToEditor && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onApplyToEditor(message.content)}
                className="h-8 px-3 text-xs text-noteflow-400 hover:text-noteflow-300"
              >
                <Zap className="h-3 w-3 mr-1" />
                Apply to Editor
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
