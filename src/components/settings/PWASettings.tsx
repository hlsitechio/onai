
import React from 'react';
import { Button } from '@/components/ui/button';
import { Smartphone } from 'lucide-react';
import PWACacheManager from '@/components/pwa/PWACacheManager';
import PWABackgroundSync from '@/components/pwa/PWABackgroundSync';
import PWAPushNotifications from '@/components/pwa/PWAPushNotifications';

const PWASettings: React.FC = () => {
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
    location.reload();
  };

  return (
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
  );
};

export default PWASettings;
