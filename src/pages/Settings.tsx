
import React from 'react';
import ProfileSection from '../components/Settings/ProfileSection';
import PreferencesSection from '../components/Settings/PreferencesSection';
import AISettingsSection from '../components/Settings/AISettingsSection';
import DataExportSection from '../components/Settings/DataExportSection';
import AboutSection from '../components/Settings/AboutSection';

const Settings: React.FC = () => {
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
      <ProfileSection />

      {/* Preferences */}
      <PreferencesSection />

      {/* AI Settings */}
      <AISettingsSection />

      {/* Export & Backup */}
      <DataExportSection />

      {/* About */}
      <AboutSection />
    </div>
  );
};

export default Settings;
