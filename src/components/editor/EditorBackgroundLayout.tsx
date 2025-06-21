
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
      "min-h-screen w-full relative overflow-hidden",
      "bg-gradient-to-br from-[#050510] via-[#080818] to-[#0a0a20]",
      // Ensure we override any potential old styles
      "!m-0 !p-0 !border-0 !outline-0"
    )}>
      {/* Enhanced animated background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Primary gradient overlay */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            background: `
              radial-gradient(circle at 25% 25%, rgba(139, 69, 255, 0.15) 0%, transparent 50%),
              radial-gradient(circle at 75% 75%, rgba(255, 69, 139, 0.12) 0%, transparent 50%),
              radial-gradient(circle at 50% 50%, rgba(69, 255, 180, 0.08) 0%, transparent 50%)
            `
          }}
        />
        
        {/* Subtle animated particles */}
        <div className="absolute inset-0">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/5 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      </div>
      
      {/* Main content with enhanced z-index management */}
      <div className={cn(
        "w-full h-screen relative z-10",
        "flex flex-col",
        isFocusMode && "z-[101]",
        // Ensure clean slate for the editor
        "!bg-transparent"
      )}>
        {children}
      </div>

      {/* Focus mode overlay with smoother transition */}
      {isFocusMode && (
        <div className={cn(
          "fixed inset-0 z-[100] pointer-events-none",
          "bg-black/98 backdrop-blur-xl",
          "transition-all duration-500 ease-in-out",
          "animate-fadeIn"
        )} />
      )}
    </div>
  );
};

export default EditorBackgroundLayout;
