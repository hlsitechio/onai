
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings, Palette, Shield, Database, Zap, Smartphone, User } from 'lucide-react';
import { toast } from 'sonner';
import PWACacheManager from '@/components/pwa/PWACacheManager';
import PWABackgroundSync from '@/components/pwa/PWABackgroundSync';
import PWAPushNotifications from '@/components/pwa/PWAPushNotifications';
import UserProfile from '@/components/UserProfile';

interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  autoSave: boolean;
  autoSaveInterval: number;
  encryptNotes: boolean;
  preferredAIProvider: 'gemini' | 'openai' | 'auto';
  focusModeDefault: boolean;
  spellCheck: boolean;
  wordWrap: boolean;
}

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SettingsDialog: React.FC<SettingsDialogProps> = ({ open, onOpenChange }) => {
  const [settings, setSettings] = useState<AppSettings>({
    theme: 'system',
    autoSave: true,
    autoSaveInterval: 5000,
    encryptNotes: true,
    preferredAIProvider: 'auto',
    focusModeDefault: false,
    spellCheck: true,
    wordWrap: true,
  });
  
  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('oneai-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...settings, ...parsed });
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

  const handleReset = () => {
    const defaultSettings: AppSettings = {
      theme: 'system',
      autoSave: true,
      autoSaveInterval: 5000,
      encryptNotes: true,
      preferredAIProvider: 'auto',
      focusModeDefault: false,
      spellCheck: true,
      wordWrap: true,
    };
    
    setSettings(defaultSettings);
    localStorage.setItem('oneai-settings', JSON.stringify(defaultSettings));
    
    toast.success('Settings reset', {
      description: 'All settings have been restored to defaults.',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="ai">AI & Features</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
            <TabsTrigger value="pwa">PWA</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center">
                <User className="h-5 w-5 mr-2" />
                User Profile
              </h3>
              
              <UserProfile />
            </div>
          </TabsContent>
          
          <TabsContent value="general" className="space-y-6">
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
          </TabsContent>
          
          <TabsContent value="appearance" className="space-y-6">
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
          </TabsContent>
          
          <TabsContent value="ai" className="space-y-6">
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
          </TabsContent>
          
          <TabsContent value="privacy" className="space-y-6">
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
          </TabsContent>
          
          <TabsContent value="pwa" className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center">
                <Smartphone className="h-5 w-5 mr-2" />
                Progressive Web App
              </h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                <PWACacheManager />
                <PWABackgroundSync />
                <PWAPushNotifications />
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
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;
