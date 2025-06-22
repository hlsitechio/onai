
import React from 'react';
import {
  Flex,
  Box,
  Input,
  InputGroup,
  InputLeftElement,
  Icon,
  Avatar,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { Search, Settings, Book } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Header: React.FC = () => {
  const { user } = useAuth();
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box
      position="fixed"
      top={0}
      right={0}
      left={{ base: 0, md: '280px' }}
      h={16}
      bg={bg}
      borderBottom="1px"
      borderColor={borderColor}
      zIndex={999}
      px={6}
    >
      <Flex align="center" justify="space-between" h="100%">
        {/* Search */}
        <Box w="400px">
          <InputGroup>
            <InputLeftElement>
              <Icon as={Search} color="gray.400" w={4} h={4} />
            </InputLeftElement>
            <Input
              placeholder="Search notes, chats, or create new..."
              borderRadius="12px"
              bg="gray.50"
              border="none"
              _focus={{
                bg: 'white',
                boxShadow: '0 0 0 3px rgba(99, 102, 241, 0.1)',
                border: '1px solid',
                borderColor: 'brand.200',
              }}
            />
          </InputGroup>
        </Box>

        {/* User Menu */}
        <Flex align="center" gap={4}>
          <Button
            leftIcon={<Icon as={Book} w={4} h={4} />}
            colorScheme="brand"
            variant="solid"
            size="sm"
            borderRadius="12px"
          >
            New Note
          </Button>

          <Menu>
            <MenuButton as={Button} variant="ghost" p={2} borderRadius="full">
              <Avatar size="sm" src={user?.avatar} name={user?.name} />
            </MenuButton>
            <MenuList borderRadius="12px" boxShadow="xl">
              <MenuItem icon={<Icon as={Settings} w={4} h={4} />}>
                Settings
              </MenuItem>
              <MenuItem icon={<Icon as={Book} w={4} h={4} />}>
                Documentation
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Header;
