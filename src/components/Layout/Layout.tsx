
import React from 'react';
import { Box, Flex } from '@chakra-ui/react';
import Sidebar from './Sidebar';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Flex minH="100vh" bg="gray.50">
      <Sidebar />
      <Box flex={1} ml={{ base: 0, md: '280px' }}>
        <Header />
        <Box p={6} pt={24}>
          {children}
        </Box>
      </Box>
    </Flex>
  );
};

export default Layout;
