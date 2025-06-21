
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
  Send, 
  Loader2, 
  Copy, 
  Check, 
  Trash2,
  X,
  Maximize2,
  Minimize2,
  User,
  Bot,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { callGeminiAI, getUsageStats } from "@/utils/aiUtils";

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isLoading?: boolean;
}

interface EnhancedAISidebarProps {
  content: string;
  onApplyChanges: (newContent: string) => void;
  editorHeight?: number;
  onClose?: () => void;
}

const EnhancedAISidebar: React.FC<EnhancedAISidebarProps> = ({
  content,
  onApplyChanges,
  editorHeight,
  onClose
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
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
  const { toast } = useToast();

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
        .slice(-6)
        .map(m => `${m.role}: ${m.content}`)
        .join('\n');
      
      const fullPrompt = `Current document content: ${content}\n\nPrevious conversation:\n${conversationContext}\n\nUser: ${currentInput}`;
      
      const response = await callGeminiAI(
        fullPrompt,
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
    setTimeout(() => handleSendMessage(), 100);
  };

  return (
    <div className={cn(
      "h-full flex flex-col bg-gradient-to-br from-[#03010a] to-[#0a0518]",
      isExpanded ? "w-[800px]" : "w-full"
    )}>
      {/* Header Controls */}
      <div className="flex items-center justify-between p-3 border-b border-white/10 bg-black/20">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-8 w-8 p-0 text-slate-400 hover:text-white"
            title={isExpanded ? "Minimize" : "Expand"}
          >
            {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-noteflow-400 to-purple-500 flex items-center justify-center">
              <Sparkles className="h-3 w-3 text-white" />
            </div>
            <h2 className="text-sm font-semibold text-white">AI Chat Assistant</h2>
            <Badge variant="outline" className="bg-noteflow-500/20 text-noteflow-300 border-noteflow-500/30 text-xs">
              Gemini 2.5 Flash
            </Badge>
          </div>
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
          {onClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 text-slate-400 hover:text-white"
              title="Close AI Chat"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Usage Stats & Quick Actions */}
      <div className="p-3 border-b border-white/10 bg-black/10">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
          <span>{usageStats.used}/{usageStats.limit} requests today</span>
          <div className="w-20 bg-black/30 rounded-full h-1.5">
            <div 
              className={`h-1.5 rounded-full ${usageStats.percent > 80 ? 'bg-red-500' : 'bg-noteflow-500'}`} 
              style={{ width: `${usageStats.percent}%` }}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {quickActions.map((action) => (
            <Button
              key={action.action}
              variant="outline"
              size="sm"
              onClick={() => handleQuickAction(action.action)}
              className="h-7 text-xs bg-black/20 border-white/10 text-white hover:bg-white/10"
            >
              {action.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-6">
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
                
                {message.isLoading ? (
                  <div className="flex items-center gap-2 text-slate-400 py-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>AI is thinking...</span>
                  </div>
                ) : (
                  <div className="text-gray-200 whitespace-pre-wrap leading-relaxed text-sm">
                    {message.content}
                  </div>
                )}

                {/* Action Buttons */}
                {message.role === 'assistant' && !message.isLoading && (
                  <div className="flex items-center gap-2 mt-3 pt-2 border-t border-white/10">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(message.content, message.id)}
                      className="h-7 px-2 text-xs text-slate-400 hover:text-white"
                    >
                      {copiedId === message.id ? (
                        <Check className="h-3 w-3 mr-1" />
                      ) : (
                        <Copy className="h-3 w-3 mr-1" />
                      )}
                      Copy
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => applyToEditor(message.content)}
                      className="h-7 px-2 text-xs text-noteflow-400 hover:text-noteflow-300"
                    >
                      <Zap className="h-3 w-3 mr-1" />
                      Apply to Editor
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t border-white/10 bg-gradient-to-r from-[#03010a] to-[#0a0518] p-4">
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Message AI Assistant..."
              className="bg-black/30 border-white/20 text-white placeholder:text-slate-400 focus:border-noteflow-500 min-h-[40px]"
              disabled={isProcessing}
            />
          </div>
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isProcessing}
            className="bg-noteflow-500 hover:bg-noteflow-600 text-white px-4 h-[40px]"
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

export default EnhancedAISidebar;
