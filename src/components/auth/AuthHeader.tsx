
import React from 'react';

export const AuthHeader: React.FC = () => {
  return (
    <div className="text-center mb-8">
      <div className="flex items-center justify-center space-x-2 mb-4">
        <div className="w-10 h-10 flex items-center justify-center">
          <img 
            src="/lovable-uploads/fccad14b-dab2-4cbe-82d9-fe30b6f82787.png" 
            alt="ONAI Logo" 
            className="w-10 h-10 object-contain"
          />
        </div>
        <span className="text-2xl font-bold bg-gradient-to-r from-noteflow-400 to-purple-400 bg-clip-text text-transparent">
          Online Note AI
        </span>
      </div>
    </div>
  );
};
