
import React, { useState, useRef, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { callGeminiAI, getUsageStats } from '@/utils/aiUtils';
import ChatHeader from './ChatHeader';
import ChatMessageList from './ChatMessageList';
import ChatInput from './ChatInput';

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
      <ChatHeader 
        usageStats={usageStats}
        onClearChat={clearChat}
      />

      <ChatMessageList
        messages={messages}
        copiedId={copiedId}
        onCopyMessage={copyToClipboard}
        onApplyToEditor={applyToEditor}
        messagesEndRef={messagesEndRef}
      />

      <ChatInput
        inputValue={inputValue}
        isProcessing={isProcessing}
        usageStats={usageStats}
        onInputChange={setInputValue}
        onSendMessage={handleSendMessage}
        onKeyPress={handleKeyPress}
        inputRef={inputRef}
      />
    </div>
  );
};

export default AIChatPanel;
