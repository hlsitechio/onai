
import React from 'react';
import { cn } from '@/lib/utils';

interface EditorBackgroundLayoutProps {
  children: React.ReactNode;
  isFocusMode: boolean;
}

const EditorBackgroundLayout: React.FC<EditorBackgroundLayoutProps> = ({ 
  children, 
  isFocusMode 
}) => {
  return (
    <div className={cn(
      "min-h-screen w-full relative",
      "bg-gradient-to-br from-[#050510] to-[#0a0518]"
    )}>
      {/* Global animated background overlay */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            background: `
              radial-gradient(circle at 20% 50%, rgba(120, 60, 255, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(255, 60, 120, 0.08) 0%, transparent 50%),
              radial-gradient(circle at 40% 80%, rgba(60, 255, 200, 0.06) 0%, transparent 50%)
            `
          }}
        />
      </div>
      
      {/* Main content container with focus mode handling */}
      <div className={cn(
        "w-full h-screen relative z-10",
        isFocusMode && "z-[101]"
      )}>
        {children}
      </div>

      {/* Focus mode overlay - only when transitioning */}
      {isFocusMode && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm pointer-events-none animate-fadeIn" />
      )}
    </div>
  );
};

export default EditorBackgroundLayout;
