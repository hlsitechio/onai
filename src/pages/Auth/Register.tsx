
import React, { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Input,
  Button,
  Card,
  CardBody,
  Link,
  Icon,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react';
import { Github } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register, isLoading } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      // toast.error('Passwords do not match');
      return;
    }

    const success = await register(name, email, password);
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <Box
      minH="100vh"
      bg="gradient-to-br from-slate-50 via-blue-50 to-purple-50"
      display="flex"
      alignItems="center"
      justifyContent="center"
      p={4}
    >
      <Card maxW="md" w="100%" boxShadow="2xl">
        <CardBody p={8}>
          <VStack spacing={8}>
            {/* Logo */}
            <VStack spacing={4}>
              <Box
                w={16}
                h={16}
                bg="gradient-to-r from-brand.500 to-secondary.500"
                borderRadius="20px"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Icon as={Github} color="white" w={8} h={8} />
              </Box>
              <VStack spacing={2}>
                <Text fontSize="2xl" fontWeight="bold" color="gray.800">
                  Create Account
                </Text>
                <Text color="gray.600" textAlign="center">
                  Join Online Note AI and start organizing your thoughts
                </Text>
              </VStack>
            </VStack>

            {/* Form */}
            <VStack as="form" onSubmit={handleSubmit} spacing={6} w="100%">
              <VStack spacing={4} w="100%">
                <Box w="100%">
                  <Text fontSize="sm" color="gray.600" mb={2}>
                    Full Name
                  </Text>
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    borderRadius="12px"
                    bg="gray.50"
                    border="1px solid"
                    borderColor="gray.200"
                    _focus={{
                      bg: 'white',
                      borderColor: 'brand.300',
                      boxShadow: '0 0 0 3px rgba(99, 102, 241, 0.1)',
                    }}
                    required
                  />
                </Box>

                <Box w="100%">
                  <Text fontSize="sm" color="gray.600" mb={2}>
                    Email
                  </Text>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    borderRadius="12px"
                    bg="gray.50"
                    border="1px solid"
                    borderColor="gray.200"
                    _focus={{
                      bg: 'white',
                      borderColor: 'brand.300',
                      boxShadow: '0 0 0 3px rgba(99, 102, 241, 0.1)',
                    }}
                    required
                  />
                </Box>

                <Box w="100%">
                  <Text fontSize="sm" color="gray.600" mb={2}>
                    Password
                  </Text>
                  <InputGroup>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create a password"
                      borderRadius="12px"
                      bg="gray.50"
                      border="1px solid"
                      borderColor="gray.200"
                      _focus={{
                        bg: 'white',
                        borderColor: 'brand.300',
                        boxShadow: '0 0 0 3px rgba(99, 102, 241, 0.1)',
                      }}
                      required
                    />
                    <InputRightElement>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? 'Hide' : 'Show'}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                </Box>

                <Box w="100%">
                  <Text fontSize="sm" color="gray.600" mb={2}>
                    Confirm Password
                  </Text>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    borderRadius="12px"
                    bg="gray.50"
                    border="1px solid"
                    borderColor="gray.200"
                    _focus={{
                      bg: 'white',
                      borderColor: 'brand.300',
                      boxShadow: '0 0 0 3px rgba(99, 102, 241, 0.1)',
                    }}
                    required
                  />
                </Box>
              </VStack>

              <Button
                type="submit"
                colorScheme="brand"
                size="lg"
                w="100%"
                borderRadius="12px"
                isLoading={isLoading}
                loadingText="Creating account..."
              >
                Create Account
              </Button>
            </VStack>

            {/* Footer */}
            <VStack spacing={4}>
              <HStack spacing={2}>
                <Text fontSize="sm" color="gray.600">
                  Already have an account?
                </Text>
                <Link
                  color="brand.500"
                  fontWeight="medium"
                  onClick={() => navigate('/login')}
                >
                  Sign in
                </Link>
              </HStack>
            </VStack>
          </VStack>
        </CardBody>
      </Card>
    </Box>
  );
};

export default Register;
