
import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Card,
  CardBody,
  Switch,
  Button,
  Icon,
  Avatar,
  Input,
  Select,
  Divider,
  Badge,
} from '@chakra-ui/react';
import { Settings as SettingsIcon, Book, Github } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Settings: React.FC = () => {
  const { user } = useAuth();

  return (
    <VStack spacing={6} align="stretch">
      {/* Header */}
      <Box>
        <Text fontSize="2xl" fontWeight="bold" color="gray.800">
          Settings
        </Text>
        <Text color="gray.600">
          Manage your account and preferences
        </Text>
      </Box>

      {/* Profile Section */}
      <Card>
        <CardBody>
          <VStack spacing={6} align="stretch">
            <Text fontSize="lg" fontWeight="semibold">Profile</Text>
            
            <HStack spacing={6}>
              <Avatar size="xl" src={user?.avatar} name={user?.name} />
              <VStack align="start" spacing={3} flex={1}>
                <Box w="100%">
                  <Text fontSize="sm" color="gray.600" mb={1}>Full Name</Text>
                  <Input defaultValue={user?.name} borderRadius="8px" />
                </Box>
                <Box w="100%">
                  <Text fontSize="sm" color="gray.600" mb={1}>Email</Text>
                  <Input defaultValue={user?.email} borderRadius="8px" />
                </Box>
              </VStack>
            </HStack>

            <Button colorScheme="brand" size="sm" alignSelf="start">
              Update Profile
            </Button>
          </VStack>
        </CardBody>
      </Card>

      {/* Preferences */}
      <Card>
        <CardBody>
          <VStack spacing={6} align="stretch">
            <Text fontSize="lg" fontWeight="semibold">Preferences</Text>
            
            <VStack spacing={4} align="stretch">
              <HStack justify="space-between">
                <Box>
                  <Text fontWeight="medium">Dark Mode</Text>
                  <Text fontSize="sm" color="gray.600">Toggle dark theme</Text>
                </Box>
                <Switch colorScheme="brand" />
              </HStack>

              <Divider />

              <HStack justify="space-between">
                <Box>
                  <Text fontWeight="medium">AI Suggestions</Text>
                  <Text fontSize="sm" color="gray.600">Get AI-powered writing suggestions</Text>
                </Box>
                <Switch colorScheme="brand" defaultChecked />
              </HStack>

              <Divider />

              <HStack justify="space-between">
                <Box>
                  <Text fontWeight="medium">Auto-save</Text>
                  <Text fontSize="sm" color="gray.600">Automatically save notes while typing</Text>
                </Box>
                <Switch colorScheme="brand" defaultChecked />
              </HStack>

              <Divider />

              <HStack justify="space-between">
                <Box flex={1}>
                  <Text fontWeight="medium">Default Category</Text>
                  <Text fontSize="sm" color="gray.600">Default category for new notes</Text>
                </Box>
                <Select w="200px" borderRadius="8px" defaultValue="general">
                  <option value="general">General</option>
                  <option value="meeting">Meeting</option>
                  <option value="learning">Learning</option>
                  <option value="brainstorm">Brainstorm</option>
                  <option value="project">Project</option>
                </Select>
              </HStack>
            </VStack>
          </VStack>
        </CardBody>
      </Card>

      {/* AI Settings */}
      <Card>
        <CardBody>
          <VStack spacing={6} align="stretch">
            <HStack justify="space-between">
              <Text fontSize="lg" fontWeight="semibold">AI Assistant</Text>
              <Badge colorScheme="green" borderRadius="full">Active</Badge>
            </HStack>
            
            <VStack spacing={4} align="stretch">
              <HStack justify="space-between">
                <Box flex={1}>
                  <Text fontWeight="medium">AI Model</Text>
                  <Text fontSize="sm" color="gray.600">Choose your preferred AI model</Text>
                </Box>
                <Select w="200px" borderRadius="8px" defaultValue="gpt-3.5">
                  <option value="gpt-3.5">GPT-3.5 Turbo</option>
                  <option value="gpt-4">GPT-4</option>
                  <option value="claude">Claude</option>
                </Select>
              </HStack>

              <Divider />

              <HStack justify="space-between">
                <Box>
                  <Text fontWeight="medium">Smart Formatting</Text>
                  <Text fontSize="sm" color="gray.600">AI-powered text formatting and structure</Text>
                </Box>
                <Switch colorScheme="brand" defaultChecked />
              </HStack>

              <Divider />

              <HStack justify="space-between">
                <Box>
                  <Text fontWeight="medium">Context Awareness</Text>
                  <Text fontSize="sm" color="gray.600">AI considers your previous notes for better suggestions</Text>
                </Box>
                <Switch colorScheme="brand" defaultChecked />
              </HStack>
            </VStack>
          </VStack>
        </CardBody>
      </Card>

      {/* Export & Backup */}
      <Card>
        <CardBody>
          <VStack spacing={6} align="stretch">
            <Text fontSize="lg" fontWeight="semibold">Data & Export</Text>
            
            <VStack spacing={4} align="stretch">
              <HStack justify="space-between">
                <Box>
                  <Text fontWeight="medium">Export Notes</Text>
                  <Text fontSize="sm" color="gray.600">Download all your notes as JSON or Markdown</Text>
                </Box>
                <Button leftIcon={<Icon as={Book} w={4} h={4} />} size="sm" variant="outline">
                  Export
                </Button>
              </HStack>

              <Divider />

              <HStack justify="space-between">
                <Box>
                  <Text fontWeight="medium">Backup to Cloud</Text>
                  <Text fontSize="sm" color="gray.600">Automatically backup your data</Text>
                </Box>
                <Switch colorScheme="brand" defaultChecked />
              </HStack>
            </VStack>
          </VStack>
        </CardBody>
      </Card>

      {/* About */}
      <Card>
        <CardBody>
          <VStack spacing={4} align="stretch">
            <Text fontSize="lg" fontWeight="semibold">About</Text>
            
            <HStack justify="space-between">
              <Text color="gray.600">Version</Text>
              <Text fontWeight="medium">1.0.0</Text>
            </HStack>
            
            <HStack justify="space-between">
              <Text color="gray.600">GitHub</Text>
              <Button
                leftIcon={<Icon as={Github} w={4} h={4} />}
                size="sm"
                variant="ghost"
              >
                View Source
              </Button>
            </HStack>
          </VStack>
        </CardBody>
      </Card>
    </VStack>
  );
};

export default Settings;
