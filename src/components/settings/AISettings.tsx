
import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Zap } from 'lucide-react';
import { toast } from 'sonner';

interface AISettings {
  preferredAIProvider: 'gemini' | 'openai' | 'auto';
}

const AISettings: React.FC = () => {
  const [settings, setSettings] = useState<AISettings>({
    preferredAIProvider: 'auto',
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

  const saveSettings = (newSettings: Partial<AISettings>) => {
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
        <Zap className="h-5 w-5 mr-2" />
        AI Settings
      </h3>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Preferred AI Provider</label>
        <Select
          value={settings.preferredAIProvider}
          onValueChange={(value: 'gemini' | 'openai' | 'auto') => saveSettings({ preferredAIProvider: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="auto">Auto (Best Available)</SelectItem>
            <SelectItem value="gemini">Google Gemini</SelectItem>
            <SelectItem value="openai">OpenAI GPT</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default AISettings;
