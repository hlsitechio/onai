
import React from 'react';
import { Brain } from 'lucide-react';
import { AuthVisualEffects } from './AuthVisualEffects';
import { AuthFeatureHighlights } from './AuthFeatureHighlights';

export const AuthBrandingPanel: React.FC = () => {
  return (
    <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
      {/* Animated Background */}
      <AuthVisualEffects />

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-center items-center p-12 text-white">
        {/* Logo Area */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 mb-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl shadow-2xl">
            <Brain className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Online Note AI
          </h1>
          <p className="text-xl text-gray-300 max-w-md">
            Transform your note-taking experience with the power of artificial intelligence
          </p>
        </div>

        {/* Feature Highlights */}
        <AuthFeatureHighlights />
      </div>
    </div>
  );
};
