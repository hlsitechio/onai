
import React from 'react';
import { useTheme } from '@/providers/ThemeProvider';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { isDarkMode } from '@/utils/themeUtils';

const PreferencesSection: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const handleThemeToggle = (checked: boolean) => {
    const newTheme = checked ? 'dark' : 'light';
    setTheme(newTheme);
  };

  const isCurrentlyDark = isDarkMode(theme);

  return (
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
                checked={isCurrentlyDark}
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
  );
};

export default PreferencesSection;
