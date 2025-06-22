
import React from 'react';
import { Settings as SettingsIcon, Book, Github } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '@/providers/ThemeProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const Settings: React.FC = () => {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();

  const handleThemeToggle = (checked: boolean) => {
    setTheme(checked ? 'dark' : 'light');
  };

  // Determine if dark mode is currently active
  const isDarkMode = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
          Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your account and preferences
        </p>
      </div>

      {/* Profile Section */}
      <Card>
        <CardContent>
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Profile</h3>
            
            <div className="flex gap-6">
              <Avatar className="w-16 h-16">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
              </Avatar>
              <div className="space-y-3 flex-1">
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">Full Name</label>
                  <Input defaultValue={user?.name} className="rounded-lg" />
                </div>
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">Email</label>
                  <Input defaultValue={user?.email} className="rounded-lg" />
                </div>
              </div>
            </div>

            <Button size="sm" className="self-start">
              Update Profile
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card>
        <CardContent>
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Preferences</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Dark Mode</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Toggle dark theme</p>
                </div>
                <Switch 
                  checked={isDarkMode}
                  onCheckedChange={handleThemeToggle}
                />
              </div>

              <Separator />

              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">AI Suggestions</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Get AI-powered writing suggestions</p>
                </div>
                <Switch defaultChecked />
              </div>

              <Separator />

              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Auto-save</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Automatically save notes while typing</p>
                </div>
                <Switch defaultChecked />
              </div>

              <Separator />

              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <p className="font-medium">Default Category</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Default category for new notes</p>
                </div>
                <Select defaultValue="general">
                  <SelectTrigger className="w-48 rounded-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="meeting">Meeting</SelectItem>
                    <SelectItem value="learning">Learning</SelectItem>
                    <SelectItem value="brainstorm">Brainstorm</SelectItem>
                    <SelectItem value="project">Project</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Settings */}
      <Card>
        <CardContent>
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">AI Assistant</h3>
              <Badge className="rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">Active</Badge>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <p className="font-medium">AI Model</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Choose your preferred AI model</p>
                </div>
                <Select defaultValue="gpt-3.5">
                  <SelectTrigger className="w-48 rounded-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt-3.5">GPT-3.5 Turbo</SelectItem>
                    <SelectItem value="gpt-4">GPT-4</SelectItem>
                    <SelectItem value="claude">Claude</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Smart Formatting</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">AI-powered text formatting and structure</p>
                </div>
                <Switch defaultChecked />
              </div>

              <Separator />

              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Context Awareness</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">AI considers your previous notes for better suggestions</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Export & Backup */}
      <Card>
        <CardContent>
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Data & Export</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Export Notes</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Download all your notes as JSON or Markdown</p>
                </div>
                <Button size="sm" variant="outline">
                  <Book className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>

              <Separator />

              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Backup to Cloud</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Automatically backup your data</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* About */}
      <Card>
        <CardContent>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">About</h3>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Version</span>
              <span className="font-medium">1.0.0</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">GitHub</span>
              <Button size="sm" variant="ghost">
                <Github className="w-4 h-4 mr-2" />
                View Source
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
