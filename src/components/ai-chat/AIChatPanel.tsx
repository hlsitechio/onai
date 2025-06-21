
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  Send, 
  Loader2, 
  Copy, 
  Check, 
  Trash2,
  User,
  Bot,
  Zap
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { callGeminiAI, getUsageStats } from '@/utils/aiUtils';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isLoading?: boolean;
}

interface AIChatPanelProps {
  onClose?: () => void;
  onApplyToEditor?: (content: string) => void;
}

const AIChatPanel: React.FC<AIChatPanelProps> = ({ onClose, onApplyToEditor }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your AI writing assistant powered by Gemini 2.5 Flash. I can help you with:\n\n• Writing and editing\n• Content analysis and improvement\n• Brainstorming ideas\n• Text summarization\n• Translation\n• Grammar and style corrections\n• And much more!\n\nWhat would you like to work on today?',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [usageStats] = useState(() => getUsageStats());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isProcessing) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    const loadingMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isLoading: true
    };

    setMessages(prev => [...prev, userMessage, loadingMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setIsProcessing(true);

    try {
      const conversationContext = messages
        .slice(-6) // Last 6 messages for context
        .map(m => `${m.role}: ${m.content}`)
        .join('\n');
      
      const fullPrompt = `Previous conversation:\n${conversationContext}\n\nUser: ${currentInput}`;
      
      const response = await callGeminiAI(
        fullPrompt,
        '',
        'chat'
      );

      setMessages(prev => prev.map(msg => 
        msg.id === loadingMessage.id 
          ? { ...msg, content: response, isLoading: false }
          : msg
      ));

      toast({
        title: 'Response generated',
        description: 'AI has responded to your message.',
      });
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => prev.filter(msg => msg.id !== loadingMessage.id));
      toast({
        title: 'Error',
        description: 'Failed to get AI response. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsProcessing(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const copyToClipboard = async (content: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedId(messageId);
      setTimeout(() => setCopiedId(null), 2000);
      toast({
        title: 'Copied',
        description: 'Message copied to clipboard.',
      });
    } catch (error) {
      toast({
        title: 'Copy failed',
        description: 'Failed to copy message.',
        variant: 'destructive'
      });
    }
  };

  const applyToEditor = (content: string) => {
    if (onApplyToEditor) {
      onApplyToEditor(content);
      toast({
        title: 'Applied to editor',
        description: 'Content has been added to your note.',
      });
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: 'Chat cleared! How can I help you today?',
        timestamp: new Date()
      }
    ]);
    toast({
      title: 'Chat cleared',
      description: 'All messages have been removed.',
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
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
          onClick={clearChat}
          className="text-slate-400 hover:text-white"
          title="Clear chat"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((message) => (
            <div key={message.id} className="flex gap-4">
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
                      onClick={() => copyToClipboard(message.content, message.id)}
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
                        onClick={() => applyToEditor(message.content)}
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
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t border-white/10 bg-gradient-to-r from-[#03010a] to-[#0a0518] p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Message AI Assistant..."
                className="bg-black/30 border-white/20 text-white placeholder:text-slate-400 focus:border-noteflow-500 min-h-[44px] resize-none"
                disabled={isProcessing}
              />
            </div>
            <Button
              onClick={handleSendMessage}
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
    </div>
  );
};

export default AIChatPanel;
