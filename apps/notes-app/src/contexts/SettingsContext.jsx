// Settings Context and Hooks for ONAI
// Provides comprehensive settings management with real functionality

import { createContext, useContext, useState, useEffect } from 'react';

// Default settings configuration
const defaultSettings = {
  // General Settings
  theme: 'dark', // 'light', 'dark', 'auto'
  language: 'en',
  animations: true,
  reducedMotion: false,
  desktopNotifications: true,
  emailNotifications: false,
  soundEffects: true,
  
  // Editor Settings
  editorType: 'rich', // 'rich', 'markdown'
  fontSize: 16,
  fontFamily: 'Inter',
  lineHeight: 1.6,
  autoSave: true,
  autoSaveInterval: 2000, // milliseconds
  spellCheck: true,
  wordWrap: true,
  showLineNumbers: false,
  tabSize: 2,
  
  // AI Settings
  aiEnabled: true,
  geminiApiKey: '',
  aiModel: 'gemini-2.5-flash',
  maxTokens: 1000,
  temperature: 0.7,
  autoTagging: true,
  aiSuggestions: true,
  aiAutoComplete: false,
  
  // Security Settings
  encryptionEnabled: true,
  twoFactorAuth: false,
  sessionTimeout: 30, // minutes
  autoLock: false,
  autoLockTime: 15, // minutes
  auditLogging: true,
  secureMode: false,
  
  // Sync Settings
  autoBackup: true,
  backupInterval: 24, // hours
  cloudSync: false,
  syncProvider: 'supabase',
  offlineMode: true,
  conflictResolution: 'manual', // 'manual', 'local', 'remote'
  
  // Advanced Settings
  cacheSize: 100, // MB
  maxNotes: 10000,
  debugMode: false,
  experimentalFeatures: false,
  performanceMode: false,
  customCSS: '',
  shortcuts: {
    newNote: 'Ctrl+N',
    save: 'Ctrl+S',
    search: 'Ctrl+F',
    aiAssistant: 'Ctrl+K',
    focusMode: 'F11',
    settings: 'Ctrl+,',
  }
};

// Settings Context
const SettingsContext = createContext();

// Settings Provider Component
export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(() => {
    // Load settings from localStorage on initialization
    const savedSettings = localStorage.getItem('onai-settings');
    if (savedSettings) {
      try {
        return { ...defaultSettings, ...JSON.parse(savedSettings) };
      } catch (error) {
        console.error('Error loading settings:', error);
        return defaultSettings;
      }
    }
    return defaultSettings;
  });

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('onai-settings', JSON.stringify(settings));
    
    // Apply theme changes immediately
    applyThemeSettings(settings.theme);
    
    // Apply font settings
    applyFontSettings(settings);
    
    // Apply animation settings
    applyAnimationSettings(settings);
    
    // Apply notification settings
    applyNotificationSettings(settings);
    
  }, [settings]);

  // Update a specific setting
  const updateSetting = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Update multiple settings at once
  const updateSettings = (newSettings) => {
    setSettings(prev => ({
      ...prev,
      ...newSettings
    }));
  };

  // Reset settings to defaults
  const resetSettings = () => {
    setSettings(defaultSettings);
    localStorage.removeItem('onai-settings');
  };

  // Export settings
  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'onai-settings.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  // Import settings
  const importSettings = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedSettings = JSON.parse(e.target.result);
          setSettings({ ...defaultSettings, ...importedSettings });
          resolve(importedSettings);
        } catch (error) {
          reject(error);
        }
      };
      reader.readAsText(file);
    });
  };

  const value = {
    settings,
    updateSetting,
    updateSettings,
    resetSettings,
    exportSettings,
    importSettings,
    defaultSettings
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

// Hook to use settings
export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

// Apply theme settings to the document
const applyThemeSettings = (theme) => {
  const root = document.documentElement;
  
  if (theme === 'auto') {
    // Use system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    theme = prefersDark ? 'dark' : 'light';
  }
  
  root.setAttribute('data-theme', theme);
  
  if (theme === 'light') {
    root.style.setProperty('--bg-primary', '#ffffff');
    root.style.setProperty('--bg-secondary', '#f8fafc');
    root.style.setProperty('--text-primary', '#1e293b');
    root.style.setProperty('--text-secondary', '#64748b');
    root.style.setProperty('--border-color', '#e2e8f0');
  } else {
    root.style.setProperty('--bg-primary', '#0f172a');
    root.style.setProperty('--bg-secondary', '#1e293b');
    root.style.setProperty('--text-primary', '#f8fafc');
    root.style.setProperty('--text-secondary', '#cbd5e1');
    root.style.setProperty('--border-color', '#334155');
  }
};

// Apply font settings
const applyFontSettings = (settings) => {
  const root = document.documentElement;
  root.style.setProperty('--editor-font-size', `${settings.fontSize}px`);
  root.style.setProperty('--editor-font-family', settings.fontFamily);
  root.style.setProperty('--editor-line-height', settings.lineHeight);
};

// Apply animation settings
const applyAnimationSettings = (settings) => {
  const root = document.documentElement;
  
  if (!settings.animations || settings.reducedMotion) {
    root.style.setProperty('--animation-duration', '0ms');
    root.style.setProperty('--transition-duration', '0ms');
  } else {
    root.style.setProperty('--animation-duration', '300ms');
    root.style.setProperty('--transition-duration', '200ms');
  }
};

// Apply notification settings
const applyNotificationSettings = (settings) => {
  // Request notification permission if desktop notifications are enabled
  if (settings.desktopNotifications && 'Notification' in window) {
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }
};

// Notification utility functions
export const showNotification = (title, options = {}) => {
  const { settings } = useSettings();
  
  if (!settings.desktopNotifications) return;
  
  if ('Notification' in window && Notification.permission === 'granted') {
    const notification = new Notification(title, {
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      ...options
    });
    
    if (settings.soundEffects) {
      // Play notification sound
      const audio = new Audio('/notification.mp3');
      audio.volume = 0.3;
      audio.play().catch(() => {}); // Ignore errors
    }
    
    return notification;
  }
};

// Keyboard shortcut handler
export const useKeyboardShortcuts = () => {
  const { settings } = useSettings();
  
  useEffect(() => {
    const handleKeyDown = (event) => {
      const { shortcuts } = settings;
      const key = `${event.ctrlKey ? 'Ctrl+' : ''}${event.shiftKey ? 'Shift+' : ''}${event.altKey ? 'Alt+' : ''}${event.key}`;
      
      // Handle shortcuts based on settings
      Object.entries(shortcuts).forEach(([action, shortcut]) => {
        if (key === shortcut) {
          event.preventDefault();
          handleShortcutAction(action);
        }
      });
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [settings.shortcuts]);
};

// Handle shortcut actions
const handleShortcutAction = (action) => {
  switch (action) {
    case 'newNote':
      window.dispatchEvent(new CustomEvent('onai:newNote'));
      break;
    case 'save':
      window.dispatchEvent(new CustomEvent('onai:save'));
      break;
    case 'search':
      window.dispatchEvent(new CustomEvent('onai:search'));
      break;
    case 'aiAssistant':
      window.dispatchEvent(new CustomEvent('onai:aiAssistant'));
      break;
    case 'focusMode':
      window.dispatchEvent(new CustomEvent('onai:focusMode'));
      break;
    case 'settings':
      window.dispatchEvent(new CustomEvent('onai:settings'));
      break;
  }
};

// Auto-save hook
export const useAutoSave = (content, onSave) => {
  const { settings } = useSettings();
  
  useEffect(() => {
    if (!settings.autoSave) return;
    
    const timeoutId = setTimeout(() => {
      if (content && onSave) {
        onSave(content);
      }
    }, settings.autoSaveInterval);
    
    return () => clearTimeout(timeoutId);
  }, [content, settings.autoSave, settings.autoSaveInterval, onSave]);
};

// Theme hook
export const useTheme = () => {
  const { settings, updateSetting } = useSettings();
  
  const setTheme = (theme) => {
    updateSetting('theme', theme);
  };
  
  const toggleTheme = () => {
    const newTheme = settings.theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };
  
  return {
    theme: settings.theme,
    setTheme,
    toggleTheme
  };
};

export default SettingsContext;

