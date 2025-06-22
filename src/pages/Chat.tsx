
import React, { useState } from 'react';
import { Plus, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! I\'m your AI assistant. I can help you organize your thoughts, brainstorm ideas, and improve your notes. What would you like to work on today?',
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'I understand you want to discuss "' + input + '". Let me help you explore this topic further. What specific aspects would you like to focus on?',
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
    }, 1000);

    setInput('');
  };

  return (
    <div className="space-y-6 h-[calc(100vh-120px)]">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            AI Assistant
          </h1>
          <p className="text-gray-600">
            Get help with your notes and ideas
          </p>
        </div>
        <Button size="sm">
          <Plus className="w-4 h-4 mr-2" />
          New Chat
        </Button>
      </div>

      {/* Messages */}
      <Card className="flex-1">
        <CardContent>
          <div className="flex flex-col h-full justify-end space-y-6">
            <div className="flex-1 overflow-y-auto max-h-96">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-start gap-3 ${
                      message.isUser ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {!message.isUser && (
                      <Avatar className="w-8 h-8 bg-blue-500">
                        <AvatarFallback className="text-white">AI</AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={`max-w-[70%] p-4 rounded-2xl ${
                        message.isUser
                          ? 'bg-blue-500 text-white rounded-br-sm'
                          : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                      }`}
                    >
                      <p>{message.content}</p>
                      <p className="text-xs opacity-70 mt-2">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                    {message.isUser && (
                      <Avatar className="w-8 h-8 bg-purple-500">
                        <AvatarFallback className="text-white">You</AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="flex gap-3">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything about your notes or ideas..."
                className="resize-none rounded-xl"
                rows={2}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
              />
              <Button
                size="lg"
                onClick={handleSend}
                disabled={!input.trim()}
                className="rounded-xl"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Chat;
