
import React, { useState, useEffect } from 'react';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Database } from 'lucide-react';
import { toast } from 'sonner';

interface AppSettings {
  autoSave: boolean;
  autoSaveInterval: number;
  spellCheck: boolean;
  wordWrap: boolean;
}

const GeneralSettings: React.FC = () => {
  const [settings, setSettings] = useState<AppSettings>({
    autoSave: true,
    autoSaveInterval: 5000,
    spellCheck: true,
    wordWrap: true,
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

  const saveSettings = (newSettings: Partial<AppSettings>) => {
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
        <Database className="h-5 w-5 mr-2" />
        Auto-Save Settings
      </h3>
      
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Enable auto-save</label>
        <Switch
          checked={settings.autoSave}
          onCheckedChange={(checked) => saveSettings({ autoSave: checked })}
        />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Auto-save interval</label>
        <Select
          value={settings.autoSaveInterval.toString()}
          onValueChange={(value) => saveSettings({ autoSaveInterval: parseInt(value) })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1000">1 second</SelectItem>
            <SelectItem value="5000">5 seconds</SelectItem>
            <SelectItem value="10000">10 seconds</SelectItem>
            <SelectItem value="30000">30 seconds</SelectItem>
            <SelectItem value="60000">1 minute</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Enable spell check</label>
        <Switch
          checked={settings.spellCheck}
          onCheckedChange={(checked) => saveSettings({ spellCheck: checked })}
        />
      </div>
      
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Word wrap</label>
        <Switch
          checked={settings.wordWrap}
          onCheckedChange={(checked) => saveSettings({ wordWrap: checked })}
        />
      </div>
    </div>
  );
};

export default GeneralSettings;
