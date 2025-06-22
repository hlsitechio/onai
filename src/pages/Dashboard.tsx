
import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardBody,
  Text,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  VStack,
  HStack,
  Button,
  Icon,
  Avatar,
  Progress,
  Divider,
} from '@chakra-ui/react';
import { Plus, Book, Edit, Search, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const stats = [
    { label: 'Total Notes', value: '127', change: 12, isPositive: true },
    { label: 'AI Conversations', value: '43', change: 8, isPositive: true },
    { label: 'Words Written', value: '25.6K', change: 5, isPositive: true },
    { label: 'This Week', value: '18', change: 2, isPositive: false },
  ];

  const recentNotes = [
    { title: 'Meeting Notes - Q1 Planning', time: '2 hours ago', type: 'meeting' },
    { title: 'React Best Practices', time: '5 hours ago', type: 'learning' },
    { title: 'AI Assistant Ideas', time: '1 day ago', type: 'brainstorm' },
    { title: 'Project Roadmap', time: '2 days ago', type: 'planning' },
  ];

  const quickActions = [
    { icon: Plus, label: 'New Note', action: () => navigate('/editor'), color: 'brand' },
    { icon: Search, label: 'AI Chat', action: () => navigate('/chat'), color: 'secondary' },
    { icon: Book, label: 'Browse Notes', action: () => navigate('/notes'), color: 'green' },
    { icon: Settings, label: 'Settings', action: () => navigate('/settings'), color: 'gray' },
  ];

  return (
    <Box>
      <VStack align="stretch" spacing={8}>
        {/* Welcome Section */}
        <Box>
          <Text fontSize="3xl" fontWeight="bold" color="gray.800" mb={2}>
            Good morning! 👋
          </Text>
          <Text fontSize="lg" color="gray.600">
            Ready to capture your thoughts and ideas with AI assistance?
          </Text>
        </Box>

        {/* Stats Grid */}
        <Grid templateColumns={{ base: '1fr', md: 'repeat(4, 1fr)' }} gap={6}>
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardBody>
                <Stat>
                  <StatLabel color="gray.600">{stat.label}</StatLabel>
                  <StatNumber fontSize="2xl">{stat.value}</StatNumber>
                  <StatHelpText>
                    <StatArrow type={stat.isPositive ? 'increase' : 'decrease'} />
                    {stat.change}% from last week
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>
          ))}
        </Grid>

        <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={8}>
          {/* Recent Activity */}
          <Card>
            <CardBody>
              <Text fontSize="xl" fontWeight="semibold" mb={6}>
                Recent Notes
              </Text>
              <VStack spacing={4} align="stretch">
                {recentNotes.map((note, index) => (
                  <Box key={index}>
                    <HStack justify="space-between" p={4} borderRadius="12px" bg="gray.50">
                      <HStack>
                        <Avatar size="sm" bg="brand.500" />
                        <VStack align="start" spacing={0}>
                          <Text fontWeight="medium">{note.title}</Text>
                          <Text fontSize="sm" color="gray.500">{note.time}</Text>
                        </VStack>
                      </HStack>
                      <Button size="sm" variant="ghost">
                        <Icon as={Edit} w={4} h={4} />
                      </Button>
                    </HStack>
                    {index < recentNotes.length - 1 && <Divider />}
                  </Box>
                ))}
              </VStack>
            </CardBody>
          </Card>

          {/* Quick Actions & Progress */}
          <VStack spacing={6}>
            <Card w="100%">
              <CardBody>
                <Text fontSize="lg" fontWeight="semibold" mb={4}>
                  Quick Actions
                </Text>
                <Grid templateColumns="repeat(2, 1fr)" gap={3}>
                  {quickActions.map((action, index) => (
                    <Button
                      key={index}
                      leftIcon={<Icon as={action.icon} w={4} h={4} />}
                      variant="ghost"
                      size="sm"
                      h={12}
                      flexDirection="column"
                      gap={1}
                      onClick={action.action}
                      _hover={{
                        bg: `${action.color}.50`,
                        color: `${action.color}.600`,
                        transform: 'translateY(-2px)',
                      }}
                      transition="all 0.2s"
                    >
                      <Text fontSize="xs">{action.label}</Text>
                    </Button>
                  ))}
                </Grid>
              </CardBody>
            </Card>

            <Card w="100%">
              <CardBody>
                <Text fontSize="lg" fontWeight="semibold" mb={4}>
                  Weekly Goal
                </Text>
                <VStack spacing={3}>
                  <Box w="100%">
                    <HStack justify="space-between" mb={2}>
                      <Text fontSize="sm" color="gray.600">Notes Created</Text>
                      <Text fontSize="sm" fontWeight="medium">18/25</Text>
                    </HStack>
                    <Progress value={72} colorScheme="brand" borderRadius="full" />
                  </Box>
                  <Text fontSize="xs" color="gray.500" textAlign="center">
                    7 more notes to reach your weekly goal!
                  </Text>
                </VStack>
              </CardBody>
            </Card>
          </VStack>
        </Grid>
      </VStack>
    </Box>
  );
};

export default Dashboard;
