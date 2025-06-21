
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import ChatMessage from './ChatMessage';

interface ChatMessageType {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isLoading?: boolean;
}

interface ChatMessageListProps {
  messages: ChatMessageType[];
  copiedId: string | null;
  onCopyMessage: (content: string, messageId: string) => void;
  onApplyToEditor?: (content: string) => void;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

const ChatMessageList: React.FC<ChatMessageListProps> = ({
  messages,
  copiedId,
  onCopyMessage,
  onApplyToEditor,
  messagesEndRef
}) => {
  return (
    <ScrollArea className="flex-1 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
            copiedId={copiedId}
            onCopy={onCopyMessage}
            onApplyToEditor={onApplyToEditor}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
};

export default ChatMessageList;
