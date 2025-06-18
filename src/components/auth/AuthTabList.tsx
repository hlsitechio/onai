
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';

interface AuthTabListProps {
  hoveredTab: string | null;
  setHoveredTab: (tab: string | null) => void;
}

export const AuthTabList: React.FC<AuthTabListProps> = ({
  hoveredTab,
  setHoveredTab,
}) => {
  return (
    <div className="relative">
      <TabsList className="grid w-full grid-cols-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-1 relative overflow-hidden">
        {/* Moving background effect */}
        <div 
          className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-gradient-to-r transition-all duration-500 ease-out rounded-md shadow-lg ${
            hoveredTab === 'signin' || (!hoveredTab && true) 
              ? 'left-1 from-blue-600 to-purple-600 shadow-blue-500/25' 
              : 'left-[calc(50%+2px)] from-purple-600 to-pink-600 shadow-purple-500/25'
          }`}
        />
        
        <TabsTrigger 
          value="signin" 
          className="relative z-10 text-gray-300 data-[state=active]:text-white rounded-md transition-all duration-300 hover:text-white"
          onMouseEnter={() => setHoveredTab('signin')}
          onMouseLeave={() => setHoveredTab(null)}
        >
          <span className="relative z-10">
            {hoveredTab === 'signup' ? 'Sign Up' : 'Sign In'}
          </span>
        </TabsTrigger>
        <TabsTrigger 
          value="signup" 
          className="relative z-10 text-gray-300 data-[state=active]:text-white rounded-md transition-all duration-300 hover:text-white"
          onMouseEnter={() => setHoveredTab('signup')}
          onMouseLeave={() => setHoveredTab(null)}
        >
          <span className="relative z-10">
            {hoveredTab === 'signin' ? 'Sign In' : 'Sign Up'}
          </span>
        </TabsTrigger>
      </TabsList>
    </div>
  );
};
