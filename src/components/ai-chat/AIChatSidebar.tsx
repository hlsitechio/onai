
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
  X,
  Zap,
  MessageSquare,
  User,
  Bot
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

interface AIChatSidebarProps {
  content: string;
  onApplyChanges: (newContent: string) => void;
  onClose?: () => void;
}

const AIChatSidebar: React.FC<AIChatSidebarProps> = ({ 
  content, 
  onApplyChanges, 
  onClose 
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hi! I\'m your AI writing assistant powered by Gemini 2.5 Flash. I can help you with:\n\n• Writing and editing\n• Content analysis and improvement\n• Brainstorming ideas\n• Text summarization\n• Translation\n• And much more!\n\nWhat would you like to work on today?',
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
    setInputValue('');
    setIsProcessing(true);

    try {
      const contextMessage = `Current document content: ${content}\n\nUser request: ${inputValue}`;
      
      const response = await callGeminiAI(
        contextMessage,
        content,
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

  const applyToEditor = (messageContent: string) => {
    const newContent = content + '\n\n' + messageContent;
    onApplyChanges(newContent);
    toast({
      title: 'Applied to editor',
      description: 'Content has been added to your note.',
    });
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

  const quickActions = [
    { label: 'Improve this text', action: 'improve' },
    { label: 'Summarize content', action: 'summarize' },
    { label: 'Generate ideas', action: 'ideas' },
    { label: 'Fix grammar', action: 'grammar' },
  ];

  const handleQuickAction = async (action: string) => {
    if (!content.trim()) {
      toast({
        title: 'No content',
        description: 'Please add some content to your note first.',
        variant: 'destructive'
      });
      return;
    }

    let prompt = '';
    switch (action) {
      case 'improve':
        prompt = 'Please improve and enhance this text while maintaining its original meaning:';
        break;
      case 'summarize':
        prompt = 'Please provide a concise summary of this content:';
        break;
      case 'ideas':
        prompt = 'Based on this content, please generate 5-7 related ideas or concepts:';
        break;
      case 'grammar':
        prompt = 'Please fix any grammar, spelling, or punctuation errors in this text:';
        break;
      default:
        prompt = 'Please help me with this content:';
    }

    setInputValue(prompt);
    handleSendMessage();
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-white/10 bg-black/20">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-noteflow-400" />
            <h2 className="text-lg font-semibold text-white">AI Assistant</h2>
            <Badge variant="outline" className="bg-noteflow-500/20 text-noteflow-300 border-noteflow-500/30 text-xs">
              Gemini 2.5 Flash
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={clearChat}
              className="h-8 w-8 p-0 text-slate-400 hover:text-white"
              title="Clear chat"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Usage Stats */}
        <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
          <span>{usageStats.used}/{usageStats.limit} requests today</span>
          <div className="w-20 bg-black/30 rounded-full h-1.5">
            <div 
              className={`h-1.5 rounded-full ${usageStats.percent > 80 ? 'bg-red-500' : 'bg-noteflow-500'}`} 
              style={{ width: `${usageStats.percent}%` }}
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-2">
          {quickActions.map((action) => (
            <Button
              key={action.action}
              variant="outline"
              size="sm"
              onClick={() => handleQuickAction(action.action)}
              className="h-8 text-xs bg-black/20 border-white/10 text-white hover:bg-white/10"
            >
              {action.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-3 max-w-[85%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Avatar */}
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  message.role === 'user' 
                    ? 'bg-noteflow-500/20 border border-noteflow-500/30' 
                    : 'bg-black/30 border border-white/10'
                }`}>
                  {message.role === 'user' ? (
                    <User className="h-4 w-4 text-noteflow-400" />
                  ) : (
                    <Bot className="h-4 w-4 text-white" />
                  )}
                </div>

                {/* Message Content */}
                <div
                  className={`rounded-lg p-3 ${
                    message.role === 'user'
                      ? 'bg-noteflow-500/20 border border-noteflow-500/30'
                      : 'bg-black/30 border border-white/10'
                  }`}
                >
                  {message.isLoading ? (
                    <div className="flex items-center gap-2 text-slate-400">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>AI is thinking...</span>
                    </div>
                  ) : (
                    <>
                      <div className="text-sm whitespace-pre-wrap text-white">{message.content}</div>
                      {message.role === 'assistant' && (
                        <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/10">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(message.content, message.id)}
                            className="h-6 px-2 text-xs text-slate-400 hover:text-white"
                          >
                            {copiedId === message.id ? (
                              <Check className="h-3 w-3" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => applyToEditor(message.content)}
                            className="h-6 px-2 text-xs text-noteflow-400 hover:text-noteflow-300"
                          >
                            <Zap className="h-3 w-3 mr-1" />
                            Apply
                          </Button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-white/10 bg-black/20">
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask AI about your content... (Enter to send)"
            className="flex-1 bg-black/30 border-white/10 text-white placeholder:text-slate-400 focus:border-noteflow-500"
            disabled={isProcessing}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isProcessing}
            className="bg-noteflow-500 hover:bg-noteflow-600 text-white px-4"
          >
            {isProcessing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
        
        <div className="flex items-center justify-between mt-2 text-xs text-slate-500">
          <span>Powered by Gemini 2.5 Flash</span>
          <span>Press Enter to send, Shift+Enter for new line</span>
        </div>
      </div>
    </div>
  );
};

export default AIChatSidebar;
