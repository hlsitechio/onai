
import React, { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Input,
  Button,
  Text,
  Card,
  CardBody,
  Avatar,
  Icon,
  Textarea,
} from '@chakra-ui/react';
import { Plus, Search } from 'lucide-react';

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
    <VStack spacing={6} h="calc(100vh - 120px)">
      {/* Header */}
      <HStack justify="space-between" w="100%">
        <Box>
          <Text fontSize="2xl" fontWeight="bold" color="gray.800">
            AI Assistant
          </Text>
          <Text color="gray.600">
            Get help with your notes and ideas
          </Text>
        </Box>
        <Button leftIcon={<Icon as={Plus} w={4} h={4} />} colorScheme="brand" size="sm">
          New Chat
        </Button>
      </HStack>

      {/* Messages */}
      <Card flex={1} w="100%">
        <CardBody>
          <VStack spacing={6} align="stretch" h="100%" justify="flex-end">
            <Box flex={1} overflowY="auto" maxH="600px">
              <VStack spacing={4} align="stretch">
                {messages.map((message) => (
                  <HStack
                    key={message.id}
                    align="start"
                    justify={message.isUser ? 'flex-end' : 'flex-start'}
                    spacing={3}
                  >
                    {!message.isUser && (
                      <Avatar size="sm" bg="brand.500" color="white" name="AI" />
                    )}
                    <Box
                      maxW="70%"
                      bg={message.isUser ? 'brand.500' : 'gray.100'}
                      color={message.isUser ? 'white' : 'gray.800'}
                      p={4}
                      borderRadius="16px"
                      borderBottomRightRadius={message.isUser ? '4px' : '16px'}
                      borderBottomLeftRadius={message.isUser ? '16px' : '4px'}
                    >
                      <Text>{message.content}</Text>
                      <Text
                        fontSize="xs"
                        opacity={0.7}
                        mt={2}
                      >
                        {message.timestamp.toLocaleTimeString()}
                      </Text>
                    </Box>
                    {message.isUser && (
                      <Avatar size="sm" bg="secondary.500" color="white" name="You" />
                    )}
                  </HStack>
                ))}
              </VStack>
            </Box>

            {/* Input */}
            <HStack spacing={3}>
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything about your notes or ideas..."
                resize="none"
                rows={2}
                borderRadius="12px"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
              />
              <Button
                colorScheme="brand"
                size="lg"
                onClick={handleSend}
                isDisabled={!input.trim()}
                borderRadius="12px"
              >
                Send
              </Button>
            </HStack>
          </VStack>
        </CardBody>
      </Card>
    </VStack>
  );
};

export default Chat;
