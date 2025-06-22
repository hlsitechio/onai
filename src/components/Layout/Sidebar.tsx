
import React from 'react';
import {
  Box,
  VStack,
  Text,
  Icon,
  Flex,
  Avatar,
  Button,
  Divider,
  useColorModeValue,
} from '@chakra-ui/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Settings, 
  Book, 
  Edit, 
  Plus,
  Search,
  Github
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const menuItems = [
  { icon: Book, label: 'Dashboard', path: '/dashboard' },
  { icon: Plus, label: 'AI Chat', path: '/chat' },
  { icon: Edit, label: 'Editor', path: '/editor' },
  { icon: Search, label: 'Notes', path: '/notes' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box
      position="fixed"
      left={0}
      top={0}
      h="100vh"
      w="280px"
      bg={bg}
      borderRight="1px"
      borderColor={borderColor}
      boxShadow="lg"
      zIndex={1000}
      display={{ base: 'none', md: 'block' }}
    >
      <VStack spacing={0} align="stretch" h="100%">
        {/* Logo */}
        <Box p={6} borderBottom="1px" borderColor={borderColor}>
          <Flex align="center" gap={3}>
            <Box
              w={10}
              h={10}
              bg="gradient-to-r from-brand.500 to-secondary.500"
              borderRadius="12px"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Icon as={Github} color="white" w={5} h={5} />
            </Box>
            <Text fontSize="xl" fontWeight="bold" color="gray.800">
              Online Note AI
            </Text>
          </Flex>
        </Box>

        {/* Menu Items */}
        <VStack spacing={2} p={4} flex={1}>
          {menuItems.map((item) => (
            <Button
              key={item.path}
              variant="ghost"
              leftIcon={<Icon as={item.icon} w={5} h={5} />}
              justifyContent="flex-start"
              w="100%"
              h={12}
              bg={location.pathname === item.path ? 'brand.50' : 'transparent'}
              color={location.pathname === item.path ? 'brand.600' : 'gray.600'}
              borderRadius="12px"
              _hover={{
                bg: 'brand.50',
                color: 'brand.600',
                transform: 'translateX(4px)',
              }}
              transition="all 0.2s"
              onClick={() => navigate(item.path)}
            >
              {item.label}
            </Button>
          ))}
        </VStack>

        <Divider />

        {/* User Profile */}
        <Box p={4}>
          <Flex align="center" gap={3} mb={4}>
            <Avatar size="md" src={user?.avatar} name={user?.name} />
            <Box flex={1}>
              <Text fontWeight="semibold" fontSize="sm" color="gray.800">
                {user?.name}
              </Text>
              <Text fontSize="xs" color="gray.500">
                {user?.email}
              </Text>
            </Box>
          </Flex>
          <Button
            variant="ghost"
            size="sm"
            w="100%"
            onClick={logout}
            _hover={{ bg: 'red.50', color: 'red.600' }}
          >
            Sign Out
          </Button>
        </Box>
      </VStack>
    </Box>
  );
};

export default Sidebar;
