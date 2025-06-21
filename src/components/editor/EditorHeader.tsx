
import React from 'react';
import UserMenu from '@/components/UserMenu';

const EditorHeader: React.FC = () => {
  return (
    <div className="absolute top-0 left-0 right-0 z-20 bg-black/20 backdrop-blur-sm border-b border-white/10">
      <div className="flex items-center justify-between h-16 px-6">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold bg-gradient-to-r from-noteflow-400 to-purple-400 bg-clip-text text-transparent">
            Online Note AI
          </h1>
        </div>
        <UserMenu />
      </div>
    </div>
  );
};

export default EditorHeader;
