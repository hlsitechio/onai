
import React from 'react';
import { Plus, Book, Edit, Search, Settings, TrendingUp, TrendingDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';

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
    { icon: Plus, label: 'New Note', action: () => navigate('/editor'), color: 'blue' },
    { icon: Search, label: 'AI Chat', action: () => navigate('/chat'), color: 'purple' },
    { icon: Book, label: 'Browse Notes', action: () => navigate('/notes'), color: 'green' },
    { icon: Settings, label: 'Settings', action: () => navigate('/settings'), color: 'gray' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Good morning! 👋
        </h1>
        <p className="text-lg text-gray-600">
          Ready to capture your thoughts and ideas with AI assistance?
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div>
                <p className="text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
                <div className="flex items-center mt-2 text-sm">
                  {stat.isPositive ? (
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                  )}
                  <span className={stat.isPositive ? 'text-green-500' : 'text-red-500'}>
                    {stat.change}% from last week
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-xl">Recent Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentNotes.map((note, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center p-4 rounded-xl bg-gray-50">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-8 h-8 bg-blue-500">
                        <AvatarFallback>N</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{note.title}</p>
                        <p className="text-sm text-gray-500">{note.time}</p>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                  {index < recentNotes.length - 1 && <Separator className="my-4" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions & Progress */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    className="h-12 flex-col gap-1 hover:scale-105 transition-transform"
                    onClick={action.action}
                  >
                    <action.icon className="w-4 h-4" />
                    <span className="text-xs">{action.label}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Weekly Goal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-600">Notes Created</span>
                    <span className="text-sm font-medium">18/25</span>
                  </div>
                  <Progress value={72} className="rounded-full" />
                </div>
                <p className="text-xs text-gray-500 text-center">
                  7 more notes to reach your weekly goal!
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
