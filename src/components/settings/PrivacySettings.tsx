
import React, { useState, useEffect } from 'react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Shield } from 'lucide-react';
import { toast } from 'sonner';

interface PrivacySettings {
  encryptNotes: boolean;
}

const PrivacySettings: React.FC = () => {
  const [settings, setSettings] = useState<PrivacySettings>({
    encryptNotes: true,
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

  const saveSettings = (newSettings: Partial<PrivacySettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    localStorage.setItem('oneai-settings', JSON.stringify(updatedSettings));
    
    toast.success('Settings saved', {
      description: 'Your preferences have been updated.',
    });
  };

  const handleReset = () => {
    const defaultSettings = {
      theme: 'system',
      autoSave: true,
      autoSaveInterval: 5000,
      encryptNotes: true,
      preferredAIProvider: 'auto',
      focusModeDefault: false,
      spellCheck: true,
      wordWrap: true,
    };
    
    localStorage.setItem('oneai-settings', JSON.stringify(defaultSettings));
    
    toast.success('Settings reset', {
      description: 'All settings have been restored to defaults.',
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center">
        <Shield className="h-5 w-5 mr-2" />
        Privacy & Security
      </h3>
      
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Encrypt notes by default</label>
        <Switch
          checked={settings.encryptNotes}
          onCheckedChange={(checked) => saveSettings({ encryptNotes: checked })}
        />
      </div>
      
      <div className="space-y-2">
        <Button 
          variant="outline" 
          onClick={handleReset}
          className="w-full"
        >
          Reset All Settings
        </Button>
      </div>
    </div>
  );
};

export default PrivacySettings;
