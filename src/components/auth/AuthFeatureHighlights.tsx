
import React from 'react';
import { Sparkles, Zap, Lock } from 'lucide-react';

export const AuthFeatureHighlights: React.FC = () => {
  return (
    <div className="space-y-6 max-w-sm">
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-white">AI-Powered Insights</h3>
          <p className="text-gray-400 text-sm">Get intelligent suggestions and auto-completion</p>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
          <Zap className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-white">Lightning Fast</h3>
          <p className="text-gray-400 text-sm">Real-time sync across all your devices</p>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
          <Lock className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-white">Secure & Private</h3>
          <p className="text-gray-400 text-sm">End-to-end encryption for your peace of mind</p>
        </div>
      </div>
    </div>
  );
};
