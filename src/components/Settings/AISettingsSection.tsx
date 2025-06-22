
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const AISettingsSection: React.FC = () => {
  return (
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
  );
};

export default AISettingsSection;
