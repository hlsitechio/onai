
import React, { useState, useEffect } from 'react';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Palette } from 'lucide-react';
import { toast } from 'sonner';

interface AppearanceSettings {
  theme: 'light' | 'dark' | 'system';
  focusModeDefault: boolean;
}

const AppearanceSettings: React.FC = () => {
  const [settings, setSettings] = useState<AppearanceSettings>({
    theme: 'system',
    focusModeDefault: false,
  });
  
  useEffect(() => {
    const savedSettings = localStorage.getItem('oneai-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error('Failed to parse saved settings:', error);
      }
    }
  }, []);

  const saveSettings = (newSettings: Partial<AppearanceSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    localStorage.setItem('oneai-settings', JSON.stringify(updatedSettings));
    
    toast.success('Settings saved', {
      description: 'Your preferences have been updated.',
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center">
        <Palette className="h-5 w-5 mr-2" />
        Display Settings
      </h3>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Theme</label>
        <Select
          value={settings.theme}
          onValueChange={(value: 'light' | 'dark' | 'system') => saveSettings({ theme: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">Light</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
            <SelectItem value="system">System</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Start in focus mode</label>
        <Switch
          checked={settings.focusModeDefault}
          onCheckedChange={(checked) => saveSettings({ focusModeDefault: checked })}
        />
      </div>
    </div>
  );
};

export default AppearanceSettings;
