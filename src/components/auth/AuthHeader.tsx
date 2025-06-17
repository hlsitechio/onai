
import React from 'react';
import { Brain } from 'lucide-react';

export const AuthHeader: React.FC = () => {
  return (
    <div className="text-center mb-8">
      <div className="flex items-center justify-center space-x-2 mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-noteflow-400 to-purple-500 rounded-lg flex items-center justify-center">
          <Brain className="w-6 h-6 text-white" />
        </div>
        <span className="text-2xl font-bold bg-gradient-to-r from-noteflow-400 to-purple-400 bg-clip-text text-transparent">
          Online Note AI
        </span>
      </div>
    </div>
  );
};
