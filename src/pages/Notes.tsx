
import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardBody,
  Text,
  VStack,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Icon,
  Badge,
  Button,
  Select,
  Avatar,
} from '@chakra-ui/react';
import { Search, Book, Edit, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Notes: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  const notes = [
    {
      id: '1',
      title: 'Meeting Notes - Q1 Planning',
      content: 'Discussed quarterly goals and team objectives...',
      category: 'meeting',
      tags: ['planning', 'team', 'goals'],
      updatedAt: '2 hours ago',
      wordCount: 450,
    },
    {
      id: '2',
      title: 'React Best Practices',
      content: 'Key principles for writing maintainable React code...',
      category: 'learning',
      tags: ['react', 'development', 'best-practices'],
      updatedAt: '5 hours ago',
      wordCount: 820,
    },
    {
      id: '3',
      title: 'AI Assistant Ideas',
      content: 'Brainstorming features for the AI note assistant...',
      category: 'brainstorm',
      tags: ['ai', 'features', 'innovation'],
      updatedAt: '1 day ago',
      wordCount: 320,
    },
    {
      id: '4',
      title: 'Project Roadmap',
      content: 'Timeline and milestones for the upcoming project...',
      category: 'project',
      tags: ['roadmap', 'timeline', 'milestones'],
      updatedAt: '2 days ago',
      wordCount: 650,
    },
    {
      id: '5',
      title: 'Learning Journal',
      content: 'Daily reflections on new concepts and skills...',
      category: 'learning',
      tags: ['journal', 'reflection', 'growth'],
      updatedAt: '3 days ago',
      wordCount: 280,
    },
    {
      id: '6',
      title: 'Client Feedback',
      content: 'Summary of client meeting and feedback points...',
      category: 'meeting',
      tags: ['client', 'feedback', 'improvement'],
      updatedAt: '4 days ago',
      wordCount: 520,
    },
  ];

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'meeting', label: 'Meeting', color: 'blue' },
    { value: 'learning', label: 'Learning', color: 'green' },
    { value: 'brainstorm', label: 'Brainstorm', color: 'purple' },
    { value: 'project', label: 'Project', color: 'orange' },
  ];

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = filterCategory === 'all' || note.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    const cat = categories.find(c => c.value === category);
    return cat?.color || 'gray';
  };

  return (
    <VStack spacing={6} align="stretch">
      {/* Header */}
      <HStack justify="space-between">
        <Box>
          <Text fontSize="2xl" fontWeight="bold" color="gray.800">
            My Notes
          </Text>
          <Text color="gray.600">
            {filteredNotes.length} notes found
          </Text>
        </Box>
        <Button
          leftIcon={<Icon as={Plus} w={4} h={4} />}
          colorScheme="brand"
          onClick={() => navigate('/editor')}
        >
          New Note
        </Button>
      </HStack>

      {/* Search and Filters */}
      <HStack spacing={4}>
        <InputGroup flex={1}>
          <InputLeftElement>
            <Icon as={Search} color="gray.400" w={4} h={4} />
          </InputLeftElement>
          <Input
            placeholder="Search notes, tags, or content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            borderRadius="12px"
            bg="white"
            border="1px solid"
            borderColor="gray.200"
          />
        </InputGroup>
        <Select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          w="200px"
          borderRadius="12px"
          bg="white"
          border="1px solid"
          borderColor="gray.200"
        >
          {categories.map((category) => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </Select>
      </HStack>

      {/* Notes Grid */}
      <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={6}>
        {filteredNotes.map((note) => (
          <Card
            key={note.id}
            cursor="pointer"
            _hover={{
              transform: 'translateY(-4px)',
              boxShadow: 'xl',
            }}
            transition="all 0.2s"
            onClick={() => navigate('/editor')}
          >
            <CardBody>
              <VStack align="stretch" spacing={4}>
                {/* Header */}
                <HStack justify="space-between" align="start">
                  <VStack align="start" spacing={1} flex={1}>
                    <Text fontWeight="semibold" fontSize="lg" noOfLines={2}>
                      {note.title}
                    </Text>
                    <HStack spacing={2}>
                      <Badge
                        colorScheme={getCategoryColor(note.category)}
                        borderRadius="full"
                        fontSize="xs"
                      >
                        {note.category}
                      </Badge>
                      <Text fontSize="xs" color="gray.500">
                        {note.wordCount} words
                      </Text>
                    </HStack>
                  </VStack>
                  <Button size="sm" variant="ghost" p={1}>
                    <Icon as={Edit} w={4} h={4} />
                  </Button>
                </HStack>

                {/* Content Preview */}
                <Text color="gray.600" fontSize="sm" noOfLines={3} lineHeight="1.5">
                  {note.content}
                </Text>

                {/* Tags */}
                <HStack spacing={2} flexWrap="wrap">
                  {note.tags.slice(0, 3).map((tag) => (
                    <Badge
                      key={tag}
                      variant="subtle"
                      colorScheme="gray"
                      borderRadius="full"
                      fontSize="xs"
                    >
                      #{tag}
                    </Badge>
                  ))}
                  {note.tags.length > 3 && (
                    <Text fontSize="xs" color="gray.400">
                      +{note.tags.length - 3} more
                    </Text>
                  )}
                </HStack>

                {/* Footer */}
                <HStack justify="space-between" pt={2} borderTop="1px" borderColor="gray.100">
                  <HStack spacing={2}>
                    <Avatar size="xs" bg="brand.500" />
                    <Text fontSize="xs" color="gray.500">
                      Updated {note.updatedAt}
                    </Text>
                  </HStack>
                  <Icon as={Book} w={3} h={3} color="gray.400" />
                </HStack>
              </VStack>
            </CardBody>
          </Card>
        ))}
      </Grid>

      {filteredNotes.length === 0 && (
        <Box textAlign="center" py={12}>
          <Icon as={Search} w={12} h={12} color="gray.300" mb={4} />
          <Text fontSize="lg" color="gray.500" mb={2}>
            No notes found
          </Text>
          <Text color="gray.400" mb={6}>
            Try adjusting your search terms or create a new note
          </Text>
          <Button
            leftIcon={<Icon as={Plus} w={4} h={4} />}
            colorScheme="brand"
            onClick={() => navigate('/editor')}
          >
            Create Your First Note
          </Button>
        </Box>
      )}
    </VStack>
  );
};

export default Notes;
