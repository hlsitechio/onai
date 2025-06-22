
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
  Icon,
  Textarea,
  Select,
  Badge,
  Flex,
} from '@chakra-ui/react';
import { Book, Settings, Plus, Search } from 'lucide-react';

const Editor: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('general');

  const categories = [
    { value: 'general', label: 'General', color: 'gray' },
    { value: 'meeting', label: 'Meeting', color: 'blue' },
    { value: 'learning', label: 'Learning', color: 'green' },
    { value: 'brainstorm', label: 'Brainstorm', color: 'purple' },
    { value: 'project', label: 'Project', color: 'orange' },
  ];

  const handleSave = () => {
    // Implement save functionality
    console.log('Saving note:', { title, content, category });
  };

  return (
    <VStack spacing={6} h="calc(100vh - 120px)">
      {/* Header */}
      <HStack justify="space-between" w="100%">
        <Box>
          <Text fontSize="2xl" fontWeight="bold" color="gray.800">
            Note Editor
          </Text>
          <Text color="gray.600">
            Create and edit your notes with AI assistance
          </Text>
        </Box>
        <HStack spacing={3}>
          <Button
            leftIcon={<Icon as={Search} w={4} h={4} />}
            variant="ghost"
            size="sm"
          >
            AI Assist
          </Button>
          <Button
            leftIcon={<Icon as={Book} w={4} h={4} />}
            colorScheme="brand"
            onClick={handleSave}
          >
            Save Note
          </Button>
        </HStack>
      </HStack>

      {/* Editor */}
      <Card w="100%" flex={1}>
        <CardBody p={8}>
          <VStack spacing={6} align="stretch" h="100%">
            {/* Title and Meta */}
            <HStack spacing={4}>
              <Input
                placeholder="Enter note title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                fontSize="xl"
                fontWeight="semibold"
                border="none"
                bg="gray.50"
                borderRadius="12px"
                _focus={{
                  bg: 'white',
                  boxShadow: '0 0 0 3px rgba(99, 102, 241, 0.1)',
                  border: '1px solid',
                  borderColor: 'brand.200',
                }}
              />
              <Select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                w="200px"
                borderRadius="12px"
                bg="gray.50"
                border="none"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </Select>
            </HStack>

            {/* Tags */}
            <Flex gap={2} flexWrap="wrap">
              <Badge colorScheme="brand" borderRadius="full" px={3} py={1}>
                #productivity
              </Badge>
              <Badge colorScheme="green" borderRadius="full" px={3} py={1}>
                #ideas
              </Badge>
              <Button size="xs" variant="ghost" borderRadius="full">
                <Icon as={Plus} w={3} h={3} />
              </Button>
            </Flex>

            {/* Content */}
            <Textarea
              placeholder="Start writing your note... Use '@ai' to get AI assistance"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              flex={1}
              minH="400px"
              resize="none"
              border="none"
              bg="white"
              fontSize="md"
              lineHeight="1.6"
              _focus={{
                boxShadow: 'none',
              }}
            />

            {/* AI Suggestions */}
            {content.length > 50 && (
              <Card bg="brand.50" borderColor="brand.200">
                <CardBody p={4}>
                  <HStack spacing={3}>
                    <Icon as={Search} w={4} h={4} color="brand.500" />
                    <Box flex={1}>
                      <Text fontSize="sm" fontWeight="medium" color="brand.700">
                        AI Suggestion
                      </Text>
                      <Text fontSize="sm" color="brand.600">
                        Consider adding more details about the implementation steps.
                      </Text>
                    </Box>
                    <Button size="xs" colorScheme="brand" variant="ghost">
                      Apply
                    </Button>
                  </HStack>
                </CardBody>
              </Card>
            )}
          </VStack>
        </CardBody>
      </Card>
    </VStack>
  );
};

export default Editor;
